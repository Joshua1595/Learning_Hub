const pool = require("../config/db");

const createQuiz = async (req, res) => {
  try {
    const { title, passingScore } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Quiz title is required",
      });
    }

    const course = await pool.query(
      `SELECT id
       FROM courses
       WHERE id = $1
         AND (instructor_id = $2 OR $3 = 'admin')`,
      [
        req.params.courseId,
        req.user.id,
        req.user.role,
      ]
    );

    if (course.rows.length === 0) {
      return res.status(403).json({
        message: "No permission for this course",
      });
    }

    const result = await pool.query(
      `INSERT INTO quizzes
        (course_id, title, passing_score, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        req.params.courseId,
        title,
        passingScore || 60,
        req.user.id,
      ]
    );

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: result.rows[0],
    });

  } catch (error) {
    console.error("Create quiz error:", error);

    return res.status(500).json({
      message: "Could not create quiz",
      error: error.message,
    });
  }
};

const addQuestion = async (req, res) => {
  const { questionText, options, correctOption, orderIndex } = req.body;

  if (!questionText || !options || !correctOption || !orderIndex) {
    return res.status(400).json({ message: "All question fields are required" });
  }

  const result = await pool.query(
    `INSERT INTO questions
      (quiz_id, question_text, options, correct_option, order_index)
     VALUES ($1, $2, $3::jsonb, $4, $5)
     RETURNING *`,
    [
      req.params.quizId,
      questionText,
      JSON.stringify(options),
      correctOption,
      orderIndex,
    ]
  );

  res.status(201).json({ question: result.rows[0] });
};

const getQuizForStudent = async (req, res) => {
  const quiz = await pool.query(
    `SELECT quizzes.id, quizzes.title, quizzes.passing_score
     FROM quizzes
     JOIN enrollments ON enrollments.course_id = quizzes.course_id
     WHERE quizzes.id = $1 AND enrollments.student_id = $2`,
    [req.params.quizId, req.user.id]
  );

  if (quiz.rows.length === 0) {
    return res.status(403).json({ message: "Enroll in this course first" });
  }

  const questions = await pool.query(
    `SELECT id, question_text, options, order_index
     FROM questions
     WHERE quiz_id = $1
     ORDER BY order_index`,
    [req.params.quizId]
  );

  res.status(200).json({
    quiz: quiz.rows[0],
    questions: questions.rows,
  });
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ message: "Answers must be an array" });
  }

  const access = await pool.query(
    `SELECT quizzes.passing_score
     FROM quizzes
     JOIN enrollments ON enrollments.course_id = quizzes.course_id
     WHERE quizzes.id = $1 AND enrollments.student_id = $2`,
    [req.params.quizId, req.user.id]
  );

  if (access.rows.length === 0) {
    return res.status(403).json({ message: "Enroll in this course first" });
  }

  const questions = await pool.query(
    "SELECT id, correct_option FROM questions WHERE quiz_id = $1",
    [req.params.quizId]
  );

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer.selectedOption])
  );

  const correctCount = questions.rows.filter(
    (question) => answerMap.get(question.id) === question.correct_option
  ).length;

  const score =
    questions.rows.length === 0
      ? 0
      : (correctCount / questions.rows.length) * 100;

  const passed = score >= access.rows[0].passing_score;

  const result = await pool.query(
    `INSERT INTO quiz_attempts
      (quiz_id, student_id, answers, score, passed)
     VALUES ($1, $2, $3::jsonb, $4, $5)
     RETURNING *`,
    [
      req.params.quizId,
      req.user.id,
      JSON.stringify(answers),
      score,
      passed,
    ]
  );

  res.status(201).json({
    message: "Quiz submitted",
    score,
    passed,
    attempt: result.rows[0],
  });
};
const getCourseQuizzes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         quizzes.id,
         quizzes.course_id,
         quizzes.title,
         quizzes.passing_score,
         quizzes.created_at
       FROM quizzes
       JOIN enrollments
         ON enrollments.course_id = quizzes.course_id
       WHERE quizzes.course_id = $1
         AND enrollments.student_id = $2
       ORDER BY quizzes.created_at DESC`,
      [req.params.courseId, req.user.id]
    );

    return res.status(200).json({
      quizzes: result.rows,
    });
  } catch (error) {
    console.error("Get course quizzes error:", error);

    return res.status(500).json({
      message: "Could not fetch course quizzes",
    });
  }
};
const getInstructorCourseQuiz = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          quizzes.id,
          quizzes.course_id,
          quizzes.title,
          quizzes.passing_score,
          quizzes.created_by,
          quizzes.created_at
       FROM quizzes
       JOIN courses
         ON courses.id = quizzes.course_id
       WHERE quizzes.course_id = $1
         AND (
           courses.instructor_id = $2
           OR $3 = 'admin'
         )
       ORDER BY quizzes.created_at DESC`,
      [
        req.params.courseId,
        req.user.id,
        req.user.role,
      ]
    );

    res.status(200).json({
      quizzes: result.rows,
    });
  } catch (error) {
    console.error(
      "Get instructor course quizzes error:",
      error
    );

    res.status(500).json({
      message: "Could not fetch course quizzes",
    });
  }
};
const getInstructorQuiz = async (req, res) => {
  try {
    console.log("========== GET INSTRUCTOR QUIZ ==========");
    console.log("Quiz ID:", req.params.quizId);
    console.log("User ID:", req.user.id);
    console.log("User Role:", req.user.role);

    const quizResult = await pool.query(
      `SELECT
         quizzes.id,
         quizzes.course_id,
         quizzes.title,
         quizzes.passing_score,
         quizzes.created_by,
         quizzes.created_at,
         courses.instructor_id
       FROM quizzes
       JOIN courses
         ON courses.id = quizzes.course_id
       WHERE quizzes.id = $1`,
      [req.params.quizId]
    );

    console.log("Quiz from database:", quizResult.rows);

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz does not exist",
      });
    }

    const quiz = quizResult.rows[0];

    if (
      req.user.role !== "admin" &&
      quiz.instructor_id !== req.user.id
    ) {
      console.log("PERMISSION DENIED");
      console.log("Course instructor:", quiz.instructor_id);
      console.log("Current user:", req.user.id);

      return res.status(403).json({
        message: "You do not have permission to manage this quiz",
      });
    }

    const questionsResult = await pool.query(
      `SELECT
         id,
         quiz_id,
         question_text,
         options,
         correct_option,
         order_index
       FROM questions
       WHERE quiz_id = $1
       ORDER BY order_index ASC`,
      [req.params.quizId]
    );

    console.log(
      "Questions:",
      questionsResult.rows.length
    );

    return res.status(200).json({
      quiz,
      questions: questionsResult.rows,
    });

  } catch (error) {
    console.error("Get instructor quiz error:", error);

    return res.status(500).json({
      message: "Could not fetch instructor quiz",
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { title, passingScore } = req.body;

    const result = await pool.query(
      `UPDATE quizzes
       SET
         title = COALESCE($1, title),
         passing_score = COALESCE($2, passing_score)
       WHERE quizzes.id = $3
         AND quizzes.course_id IN (
           SELECT courses.id
           FROM courses
           WHERE courses.instructor_id = $4
         )
       RETURNING *`,
      [
        title || null,
        passingScore ?? null,
        req.params.quizId,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz not found or you do not have permission",
      });
    }

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: result.rows[0],
    });
  } catch (error) {
    console.error("Update quiz error:", error);

    res.status(500).json({
      message: "Could not update quiz",
    });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctOption,
      orderIndex,
    } = req.body;

    const result = await pool.query(
      `UPDATE questions
       SET
         question_text = COALESCE($1, question_text),
         options = COALESCE($2::jsonb, options),
         correct_option = COALESCE($3, correct_option),
         order_index = COALESCE($4, order_index)
       WHERE id = $5
         AND quiz_id IN (
           SELECT quizzes.id
           FROM quizzes
           JOIN courses
             ON courses.id = quizzes.course_id
           WHERE courses.instructor_id = $6
         )
       RETURNING *`,
      [
        questionText || null,
        options ? JSON.stringify(options) : null,
        correctOption || null,
        orderIndex ?? null,
        req.params.questionId,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found or you do not have permission",
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
      question: result.rows[0],
    });
  } catch (error) {
    console.error("Update question error:", error);

    res.status(500).json({
      message: "Could not update question",
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM questions
       WHERE id = $1
         AND quiz_id IN (
           SELECT quizzes.id
           FROM quizzes
           JOIN courses
             ON courses.id = quizzes.course_id
           WHERE courses.instructor_id = $2
         )
       RETURNING id`,
      [req.params.questionId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found or you do not have permission",
      });
    }

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);

    res.status(500).json({
      message: "Could not delete question",
    });
  }
};
const deleteQuiz = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM quizzes
       WHERE id = $1
         AND course_id IN (
           SELECT id
           FROM courses
           WHERE instructor_id = $2
         )
       RETURNING id`,
      [req.params.quizId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Quiz not found or you do not have permission",
      });
    }

    return res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);

    return res.status(500).json({
      message: "Could not delete quiz",
    });
  }
};
module.exports = {
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
};