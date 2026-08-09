const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [users, courses, enrollments, reviews] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM profiles"),
      pool.query(
        `SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'published') AS published,
          COUNT(*) FILTER (WHERE status = 'draft') AS drafts
         FROM courses`
      ),
      pool.query("SELECT COUNT(*) FROM enrollments"),
      pool.query("SELECT COUNT(*) FROM reviews"),
    ]);

    res.status(200).json({
      statistics: {
        totalUsers: Number(users.rows[0].count),
        totalCourses: Number(courses.rows[0].total),
        publishedCourses: Number(courses.rows[0].published),
        draftCourses: Number(courses.rows[0].drafts),
        totalEnrollments: Number(enrollments.rows[0].count),
        totalReviews: Number(reviews.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Could not load dashboard" });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        profiles.id,
        profiles.name,
        profiles.role,
        profiles.created_at,
        auth.users.email
       FROM profiles
       JOIN auth.users ON auth.users.id = profiles.id
       ORDER BY profiles.created_at DESC`
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({
        message: "Role must be student or instructor",
      });
    }

    const result = await pool.query(
      `UPDATE profiles
       SET role = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, role`,
      [role, req.params.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update user role" });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  updateUserRole,
};