const pool = require("../config/db");

const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check that the course exists and is published
    const courseResult = await pool.query(
      `SELECT id, instructor_id
       FROM courses
       WHERE id = $1
         AND status = 'published'`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const course = courseResult.rows[0];

    // Admin can access
    if (req.user?.role === "admin") {
      const result = await pool.query(
        `SELECT *
         FROM lessons
         WHERE course_id = $1
         ORDER BY order_index ASC`,
        [courseId]
      );

      return res.status(200).json({
        lessons: result.rows,
      });
    }

    // Instructor can access their own course
    if (req.user?.id === course.instructor_id) {
      const result = await pool.query(
        `SELECT *
         FROM lessons
         WHERE course_id = $1
         ORDER BY order_index ASC`,
        [courseId]
      );

      return res.status(200).json({
        lessons: result.rows,
      });
    }

    // Student must be enrolled
    if (!req.user) {
      return res.status(401).json({
        message: "Please login to access this course",
      });
    }

    const enrollmentResult = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2`,
      [req.user.id, courseId]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({
        message: "You must be enrolled in this course",
      });
    }

    // Student is enrolled
    const result = await pool.query(
      `SELECT *
       FROM lessons
       WHERE course_id = $1
       ORDER BY order_index ASC`,
      [courseId]
    );

    return res.status(200).json({
      lessons: result.rows,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    res.status(500).json({
      message: "Could not fetch lessons",
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const {
      title,
      contentType,
      contentUrl,
      content,
      orderIndex,
      isPreview,
    } = req.body;

    if (!title || !orderIndex) {
      return res.status(400).json({
        message: "Title and orderIndex are required",
      });
    }

    const courseResult = await pool.query(
      `SELECT id
       FROM courses
       WHERE id = $1
         AND (instructor_id = $2 OR $3 = 'admin')`,
      [req.params.courseId, req.user.id, req.user.role]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    const result = await pool.query(
      `INSERT INTO lessons
        (course_id, title, content_type, content_url, content, order_index, is_preview)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.params.courseId,
        title,
        contentType || "video",
        contentUrl || null,
        content || null,
        orderIndex,
        isPreview || false,
      ]
    );

    res.status(201).json({
      message: "Lesson created successfully",
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({ message: "Could not create lesson" });
  }
};
const getLessonById = async (req, res) => {
  try {

    const lessonResult = await pool.query(
      `SELECT
          lessons.*,
          courses.title AS course_title,
          courses.instructor_id
       FROM lessons
       JOIN courses
         ON courses.id = lessons.course_id
       WHERE lessons.id = $1
         AND courses.status = 'published'`,
      [req.params.lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const lesson = lessonResult.rows[0];

    if (lesson.is_preview) {
      return res.status(200).json({
        lesson,
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Please login to access this lesson",
      });
    }

    if (req.user.role === "admin") {
      return res.status(200).json({
        lesson,
      });
    }

    if (lesson.instructor_id === req.user.id) {
      return res.status(200).json({
        lesson,
      });
    }

    const enrollment = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2`,
      [req.user.id, lesson.course_id]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({
        message: "Enroll in this course to access this lesson",
      });
    }

    res.status(200).json({
      lesson,
    });

  } catch (error) {

    console.error("Get lesson error:", error);

    res.status(500).json({
      message: "Could not fetch lesson",
    });

  }
};
const getInstructorLessons = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lessons.*
       FROM lessons
       JOIN courses ON lessons.course_id = courses.id
       WHERE lessons.course_id = $1
         AND courses.instructor_id = $2
       ORDER BY lessons.order_index ASC`,
      [req.params.courseId, req.user.id]
    );

    res.status(200).json({
      lessons: result.rows,
    });
  } catch (error) {
    console.error("Get instructor lessons error:", error);
    res.status(500).json({
      message: "Could not fetch instructor lessons",
    });
  }
};
const updateLesson = async (req, res) => {
  try {
    const {
      title,
      contentType,
      contentUrl,
      content,
      orderIndex,
      isPreview,
    } = req.body;

    const courseResult = await pool.query(
      `SELECT id
       FROM courses
       WHERE id = $1
         AND (instructor_id = $2 OR $3 = 'admin')`,
      [req.params.courseId, req.user.id, req.user.role]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    const result = await pool.query(
      `UPDATE lessons
       SET title = $1,
           content_type = $2,
           content_url = $3,
           content = $4,
           order_index = $5,
           is_preview = $6
       WHERE id = $7
         AND course_id = $8
       RETURNING *`,
      [
        title,
        contentType,
        contentUrl || null,
        content || null,
        orderIndex,
        isPreview || false,
        req.params.lessonId,
        req.params.courseId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    res.status(500).json({
      message: "Could not update lesson",
    });
  }
};
const getInstructorLessonById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        lessons.*,
        courses.title AS course_title,
        courses.instructor_id
       FROM lessons
       JOIN courses
         ON courses.id = lessons.course_id
       WHERE lessons.id = $1
         AND lessons.course_id = $2
         AND courses.instructor_id = $3`,
      [
        req.params.lessonId,
        req.params.courseId,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found or you do not have permission",
      });
    }

    res.status(200).json({
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error("Get instructor lesson error:", error);

    res.status(500).json({
      message: "Could not fetch lesson",
    });
  }
};
module.exports = { getLessons, createLesson, getLessonById ,getInstructorLessons, updateLesson, getInstructorLessonById};