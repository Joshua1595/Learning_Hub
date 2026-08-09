const pool = require("../config/db");

const getCourseProgress = async (req, res) => {
  try {
    const enrollment = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1 AND course_id = $2`,
      [req.user.id, req.params.courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    const result = await pool.query(
      `SELECT
        COUNT(lessons.id) AS total_lessons,
        COUNT(lesson_progress.id)
          FILTER (WHERE lesson_progress.is_completed = true) AS completed_lessons
       FROM lessons
       LEFT JOIN lesson_progress
         ON lesson_progress.lesson_id = lessons.id
         AND lesson_progress.student_id = $1
       WHERE lessons.course_id = $2`,
      [req.user.id, req.params.courseId]
    );

    const totalLessons = Number(result.rows[0].total_lessons);
    const completedLessons = Number(result.rows[0].completed_lessons);

    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    res.status(200).json({
      totalLessons,
      completedLessons,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch course progress" });
  }
};
const getLessonProgress = async (req, res) => {
  try {
    const enrollment = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1 AND course_id = $2`,
      [req.user.id, req.params.courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    const result = await pool.query(
      `SELECT
        lessons.id AS lesson_id,
        COALESCE(lesson_progress.is_completed, false) AS is_completed
       FROM lessons
       LEFT JOIN lesson_progress
         ON lesson_progress.lesson_id = lessons.id
         AND lesson_progress.student_id = $1
       WHERE lessons.course_id = $2
       ORDER BY lessons.order_index`,
      [req.user.id, req.params.courseId]
    );

    res.status(200).json({ progress: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch lesson progress" });
  }
};
const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Make sure lesson exists and get its course
    const lessonResult = await pool.query(
      `SELECT id, course_id
       FROM lessons
       WHERE id = $1`,
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const courseId = lessonResult.rows[0].course_id;

    // Make sure student is enrolled
    const enrollment = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2`,
      [req.user.id, courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    // Create or update progress
    const result = await pool.query(
      `INSERT INTO lesson_progress
        (student_id, lesson_id, is_completed, completed_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (student_id, lesson_id)
       DO UPDATE SET
         is_completed = true,
         completed_at = NOW()
       RETURNING *`,
      [req.user.id, lessonId]
    );

    res.status(200).json({
      message: "Lesson marked as completed",
      progress: result.rows[0],
    });
  } catch (error) {
    console.error("Mark lesson complete error:", error);

    res.status(500).json({
      message: "Could not mark lesson as completed",
    });
  }
};

module.exports = { getCourseProgress, getLessonProgress, markLessonComplete };