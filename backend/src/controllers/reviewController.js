const pool = require("../config/db");

const getCourseReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        reviews.id,
        reviews.rating,
        reviews.comment,
        reviews.created_at,
        reviews.student_id,
        profiles.name AS student_name
       FROM reviews
       JOIN profiles ON profiles.id = reviews.student_id
       WHERE reviews.course_id = $1
       ORDER BY reviews.created_at DESC`,
      [req.params.courseId]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch reviews" });
  }
};

const createOrUpdateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be a number from 1 to 5",
      });
    }

    const enrollment = await pool.query(
      `SELECT id FROM enrollments
       WHERE student_id = $1 AND course_id = $2`,
      [req.user.id, req.params.courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({
        message: "Enroll in the course before leaving a review",
      });
    }

    const result = await pool.query(
      `INSERT INTO reviews (course_id, student_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (course_id, student_id)
       DO UPDATE SET
         rating = EXCLUDED.rating,
         comment = EXCLUDED.comment,
         updated_at = NOW()
       RETURNING *`,
      [req.params.courseId, req.user.id, rating, comment || null]
    );

    res.status(201).json({
      message: "Review saved successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Could not save review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reviews
       WHERE id = $1 AND student_id = $2
       RETURNING id`,
      [req.params.reviewId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found or you do not have permission",
      });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete review" });
  }
};

module.exports = {
  getCourseReviews,
  createOrUpdateReview,
  deleteReview,
};