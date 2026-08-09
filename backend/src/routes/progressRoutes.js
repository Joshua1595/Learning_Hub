const express = require("express");
const { getCourseProgress,getLessonProgress,markLessonComplete } = require("../controllers/progressController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/courses/:courseId/progress",
  protect,
  authorize("student"),
  getCourseProgress
);
router.get(
  "/courses/:courseId/lesson-progress",
  protect,
  authorize("student"),
  getLessonProgress
);
router.post(
  "/lessons/:lessonId/complete",
  protect,
  authorize("student"),
  markLessonComplete
);
module.exports = router;