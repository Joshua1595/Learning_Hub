const express = require("express");
const {
  enrollInCourse,
  getMyEnrolledCourses,
  completeLesson,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/courses/:courseId/enroll",
  protect,
  authorize("student"),
  enrollInCourse
);

router.get(
  "/enrollments/my-courses",
  protect,
  authorize("student"),
  getMyEnrolledCourses
);

router.patch(
  "/lessons/:lessonId/complete",
  protect,
  authorize("student"),
  completeLesson
);

module.exports = router;