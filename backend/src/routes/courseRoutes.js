const express = require("express");

const {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  publishCourse,
  updateCourse,
  deleteCourse,
  getMyCourseById,
} = require("../controllers/courseController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCourses);

// Instructor/Admin routes
router.get(
  "/my-courses",
  protect,
  authorize("instructor", "admin"),
  getMyCourses
);

router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  createCourse
);

router.patch(
  "/:id/publish",
  protect,
  authorize("instructor", "admin"),
  publishCourse
);

// Public course details
router.get("/:courseId", getCourseById);
router.get(
  "/my-courses/:courseId",
  protect,
  authorize("instructor", "admin"),
  getMyCourseById
);

// Update course
router.patch(
  "/:courseId",
  protect,
  authorize("instructor", "admin"),
  updateCourse
);

// Delete course
router.delete(
  "/:courseId",
  protect,
  authorize("instructor", "admin"),
  deleteCourse
);

module.exports = router;