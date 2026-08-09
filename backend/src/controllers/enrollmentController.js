const pool = require("../config/db");

const enrollInCourse = async (req, res) => {
  try {
    const course = await pool.query(
      "SELECT id FROM courses WHERE id = $1 AND status = 'published'",
      [req.params.courseId]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ message: "Published course not found" });
    }

    const result = await pool.query(
      `INSERT INTO enrollments (student_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (student_id, course_id) DO NOTHING
       RETURNING *`,
      [req.user.id, req.params.courseId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "You are already enrolled" });
    }

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment: result.rows[0],
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Could not enroll in course" });
  }
};

const getMyEnrolledCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        courses.id,
        courses.title,
        courses.thumbnail_url,
        courses.level,
        enrollments.enrolled_at,
        COUNT(lessons.id) AS total_lessons,
        COUNT(lesson_progress.id)
          FILTER (WHERE lesson_progress.is_completed = true) AS completed_lessons
       FROM enrollments
       JOIN courses ON courses.id = enrollments.course_id
       LEFT JOIN lessons ON lessons.course_id = courses.id
       LEFT JOIN lesson_progress
         ON lesson_progress.lesson_id = lessons.id
         AND lesson_progress.student_id = enrollments.student_id
       WHERE enrollments.student_id = $1
       GROUP BY courses.id, enrollments.enrolled_at
       ORDER BY enrollments.enrolled_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({ message: "Could not fetch enrolled courses" });
  }
};

const completeLesson = async (req, res) => {
  try {
    const lessonAccess = await pool.query(
      `SELECT lessons.id
       FROM lessons
       JOIN enrollments ON enrollments.course_id = lessons.course_id
       WHERE lessons.id = $1
         AND enrollments.student_id = $2`,
      [req.params.lessonId, req.user.id]
    );

    if (lessonAccess.rows.length === 0) {
      return res.status(403).json({
        message: "Enroll in this course before completing its lessons",
      });
    }

    const result = await pool.query(
      `INSERT INTO lesson_progress
        (student_id, lesson_id, is_completed, completed_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (student_id, lesson_id)
       DO UPDATE SET is_completed = true, completed_at = NOW()
       RETURNING *`,
      [req.user.id, req.params.lessonId]
    );

    res.status(200).json({
      message: "Lesson marked as complete",
      progress: result.rows[0],
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    res.status(500).json({ message: "Could not update lesson progress" });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrolledCourses,
  completeLesson,
};