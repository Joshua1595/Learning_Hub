import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createQuiz,
  addQuestion,
} from "../services/quizService";

function InstructorCreateQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  const [quizForm, setQuizForm] = useState({
    title: "",
    passingScore: 60,
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctOption: "",
    orderIndex: 1,
  });

  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;

    setQuizForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;

    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm((prev) => {
      const options = [...prev.options];

      options[index] = value;

      return {
        ...prev,
        options,
      };
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!quizForm.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    const passingScore = Number(quizForm.passingScore);

    if (
      Number.isNaN(passingScore) ||
      passingScore < 0 ||
      passingScore > 100
    ) {
      toast.error("Passing score must be between 0 and 100");
      return;
    }

    try {
      setCreatingQuiz(true);

      const data = await createQuiz(courseId, {
        title: quizForm.title,
        passingScore,
      });

      setQuiz(data.quiz);

      toast.success("Quiz created successfully");
    } catch (error) {
      console.error("Create quiz error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create quiz"
      );
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!questionForm.questionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    const cleanedOptions = questionForm.options
      .map((option) => option.trim())
      .filter(Boolean);

    if (cleanedOptions.length < 2) {
      toast.error("At least two options are required");
      return;
    }

    if (!questionForm.correctOption.trim()) {
      toast.error("Correct option is required");
      return;
    }

    if (
      !cleanedOptions.includes(
        questionForm.correctOption.trim()
      )
    ) {
      toast.error(
        "Correct option must match one of the options"
      );
      return;
    }

    try {
      setAddingQuestion(true);

      const data = await addQuestion(quiz.id, {
        questionText: questionForm.questionText.trim(),
        options: cleanedOptions,
        correctOption: questionForm.correctOption.trim(),
        orderIndex: Number(questionForm.orderIndex),
      });

      toast.success("Question added successfully");

      setQuestionForm({
        questionText: "",
        options: ["", "", "", ""],
        correctOption: "",
        orderIndex: Number(questionForm.orderIndex) + 1,
      });

      console.log("Created question:", data.question);
    } catch (error) {
      console.error("Add question error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add question"
      );
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleFinish = () => {
    console.log("QUIZ TO MANAGE:", quiz);
    console.log("QUIZ ID:", quiz.id);
    console.log("COURSE ID:", quiz.course_id);

    navigate(`/instructor/quizzes/${quiz.id}`);
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/instructor/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Instructor
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create Quiz
          </h1>

          <p className="mt-2 text-slate-400">
            Create a quiz and add questions for your students.
          </p>
        </div>

        {/* STEP 1 — CREATE QUIZ */}
        {!quiz ? (
          <form
            onSubmit={handleCreateQuiz}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Create Quiz
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Start by defining the quiz information.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Quiz Title
              </label>

              <input
                type="text"
                name="title"
                value={quizForm.title}
                onChange={handleQuizChange}
                placeholder="e.g. JavaScript Fundamentals Quiz"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
                required
              />
            </div>

            {/* Passing Score */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Passing Score (%)
              </label>

              <input
                type="number"
                name="passingScore"
                value={quizForm.passingScore}
                onChange={handleQuizChange}
                min="0"
                max="100"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
              />

              <p className="mt-1.5 text-xs text-slate-500">
                Students must reach this percentage to pass.
              </p>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={creatingQuiz}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingQuiz
                  ? "Creating..."
                  : "Create Quiz"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Quiz created successfully */}
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Quiz Created
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {quiz.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Passing score: {quiz.passing_score}%
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Manage Quiz
                </button>
              </div>
            </div>

            {/* STEP 2 — ADD QUESTION */}
            <form
              onSubmit={handleAddQuestion}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            >
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  Step 2
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Add Question
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add a multiple-choice question to your quiz.
                </p>
              </div>

              {/* Question */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Question
                </label>

                <textarea
                  name="questionText"
                  value={questionForm.questionText}
                  onChange={handleQuestionChange}
                  rows={4}
                  placeholder="Enter your question..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
                  required
                />
              </div>

              {/* Options */}
              <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Options
                </label>

                <div className="space-y-3">
                  {questionForm.options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Correct option + order */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Correct Option
                  </label>

                  <select
                    name="correctOption"
                    value={questionForm.correctOption}
                    onChange={handleQuestionChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="">
                      Select correct option
                    </option>

                    {questionForm.options
                      .filter((option) => option.trim())
                      .map((option, index) => (
                        <option
                          key={index}
                          value={option}
                        >
                          {String.fromCharCode(
                            65 + index
                          )} — {option}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Question Order
                  </label>

                  <input
                    type="number"
                    name="orderIndex"
                    value={questionForm.orderIndex}
                    onChange={handleQuestionChange}
                    min="1"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Add question */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Finish Later
                </button>

                <button
                  type="submit"
                  disabled={addingQuestion}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingQuestion
                    ? "Adding..."
                    : "Add Question"}
                </button>
              </div>
            </form>

            {/* Continue managing */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleFinish}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                View and manage all questions →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InstructorCreateQuiz;

