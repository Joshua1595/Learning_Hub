const pool = require("../config/db");
const getMyCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        courses.*,
        categories.name AS category_name
      FROM courses
      LEFT JOIN categories ON courses.category_id = categories.id
      WHERE courses.instructor_id = $1
      ORDER BY courses.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error("Get my courses error:", error);
    res.status(500).json({ message: "Could not fetch your courses" });
  }
};

const publishCourse = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE courses
       SET status = 'published', updated_at = NOW()
       WHERE id = $1
         AND (instructor_id = $2 OR $3 = 'admin')
       RETURNING *`,
      [req.params.id, req.user.id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    res.status(200).json({
      message: "Course published successfully",
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Publish course error:", error);
    res.status(500).json({ message: "Could not publish course" });
  }
};

const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50
    );
    const offset = (page - 1) * limit;

    const conditions = ["courses.status = 'published'"];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(
        `(courses.title ILIKE $${values.length}
          OR courses.description ILIKE $${values.length})`
      );
    }

    if (category) {
      values.push(category);
      conditions.push(`courses.category_id = $${values.length}`);
    }

    if (level) {
      values.push(level);
      conditions.push(`courses.level = $${values.length}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM courses ${whereClause}`,
      values
    );

    const coursesResult = await pool.query(
      `SELECT
        courses.*,
        categories.name AS category_name,
        profiles.name AS instructor_name
       FROM courses
       LEFT JOIN categories ON courses.category_id = categories.id
       JOIN profiles ON courses.instructor_id = profiles.id
       ${whereClause}
       ORDER BY courses.created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    const totalCourses = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      courses: coursesResult.rows,
      pagination: {
        page,
        limit,
        totalCourses,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Could not fetch courses" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, categoryId, price, level, thumbnailUrl } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO courses
        (title, description, category_id, price, level, thumbnail_url, instructor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description,
        categoryId || null,
        price || 0,
        level || "beginner",
        thumbnailUrl || null,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Course created as a draft",
      course: result.rows[0],
    });
    } catch (error) {
  console.error("Create course error:", error);

  res.status(500).json({
    message: "Could not create course",
    error: error.message,
  });
}
};
const getCourseById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        courses.*,
        categories.name AS category_name,
        profiles.name AS instructor_name
       FROM courses
       LEFT JOIN categories ON categories.id = courses.category_id
       JOIN profiles ON profiles.id = courses.instructor_id
       WHERE courses.id = $1
         AND courses.status = 'published'`,
      [req.params.courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch course" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      price,
      level,
      thumbnailUrl,
    } = req.body;

    const result = await pool.query(
      `UPDATE courses
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         category_id = COALESCE($3, category_id),
         price = COALESCE($4, price),
         level = COALESCE($5, level),
         thumbnail_url = COALESCE($6, thumbnail_url),
         updated_at = NOW()
       WHERE id = $7
         AND (instructor_id = $8 OR $9 = 'admin')
       RETURNING *`,
      [
        title || null,
        description || null,
        categoryId || null,
        price ?? null,
        level || null,
        thumbnailUrl || null,
        req.params.courseId,
        req.user.id,
        req.user.role,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Could not update course" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM courses
       WHERE id = $1
         AND (instructor_id = $2 OR $3 = 'admin')
       RETURNING id`,
      [req.params.courseId, req.user.id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete course" });
  }
};
const getMyCourseById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        courses.*,
        categories.name AS category_name
       FROM courses
       LEFT JOIN categories
         ON categories.id = courses.category_id
       WHERE courses.id = $1
         AND courses.instructor_id = $2`,
      [req.params.courseId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found or you do not have permission",
      });
    }

    res.status(200).json({
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Get my course error:", error);

    res.status(500).json({
      message: "Could not fetch course",
    });
  }
};

module.exports = { getCourses, createCourse, getMyCourses, publishCourse, getCourseById, updateCourse, deleteCourse, getMyCourseById };