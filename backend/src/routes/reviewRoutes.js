const express = require("express");
const {
  getCourseReviews,
  createOrUpdateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/courses/:courseId/reviews", getCourseReviews);

router.post(
  "/courses/:courseId/reviews",
  protect,
  authorize("student"),
  createOrUpdateReview
);

router.delete(
  "/reviews/:reviewId",
  protect,
  authorize("student"),
  deleteReview
);

module.exports = router;