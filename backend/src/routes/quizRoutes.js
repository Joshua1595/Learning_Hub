const express = require("express");
const {
  createQuiz,
  addQuestion,
  getQuizForStudent,
  submitQuiz,
  getCourseQuizzes,
  getInstructorCourseQuiz,
  getInstructorQuiz,
  updateQuiz,
  updateQuestion,
  deleteQuestion,
  deleteQuiz,
} = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/courses/:courseId/quizzes",
  protect,
  authorize("instructor", "admin"),
  createQuiz
);

router.post(
  "/quizzes/:quizId/questions",
  protect,
  authorize("instructor", "admin"),
  addQuestion
);

router.get(
  "/quizzes/:quizId",
  protect,
  authorize("student"),
  getQuizForStudent
);
router.get(
  "/courses/:courseId/quizzes",
  protect,
  authorize("student"),
  getCourseQuizzes
);

router.post(
  "/quizzes/:quizId/submit",
  protect,
  authorize("student"),
  submitQuiz
);
router.get(
  "/instructor/courses/:courseId/quizzes",
  protect,
  authorize("instructor", "admin"),
  getInstructorCourseQuiz
);
// Instructor - get quiz with questions
router.get(
  "/instructor/quizzes/:quizId",
  protect,
  authorize("instructor", "admin"),
  getInstructorQuiz
);

// Instructor - update quiz
router.patch(
  "/instructor/quizzes/:quizId",
  protect,
  authorize("instructor", "admin"),
  updateQuiz
);

// Instructor - update question
router.patch(
  "/instructor/questions/:questionId",
  protect,
  authorize("instructor", "admin"),
  updateQuestion
);

// Instructor - delete question
router.delete(
  "/instructor/questions/:questionId",
  protect,
  authorize("instructor", "admin"),
  deleteQuestion
);
router.delete(
  "/instructor/quizzes/:quizId",
  protect,
  authorize("instructor", "admin"),
  deleteQuiz
);

module.exports = router;