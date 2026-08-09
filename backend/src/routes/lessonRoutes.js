const express = require("express");
const {
  getLessons,
  createLesson,
  getLessonById,
  getInstructorLessons,
  updateLesson,
  getInstructorLessonById,
} = require("../controllers/lessonController");
const {
  protect,
  authorize,
  optionalProtect,
} = require("../middleware/authMiddleware");

const router = express.Router();
router.get(
  "/courses/:courseId/lessons",
  protect,
  getLessons
);
router.get("/courses/:courseId/lessons/:lessonId",getLessonById);

router.post(
  "/courses/:courseId/lessons",
  protect,
  authorize("instructor", "admin"),
  createLesson
);
router.get(
  "/lessons/:lessonId",
  optionalProtect,
  getLessonById
);
router.get(
  "/instructor/courses/:courseId/lessons",
  protect,
  authorize("instructor", "admin"),
  getInstructorLessons
);
router.put(
  "/courses/:courseId/lessons/:lessonId",
  protect,
  authorize("instructor", "admin"),
  updateLesson
);
router.get(
  "/instructor/courses/:courseId/lessons/:lessonId",
  protect,
  authorize("instructor", "admin"),
  getInstructorLessonById
);

module.exports = router;