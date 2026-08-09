import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getInstructorQuiz,
  updateQuiz,
  updateQuestion,
  deleteQuestion,
} from "../services/quizService";

function InstructorQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [quizForm, setQuizForm] = useState({
    title: "",
    passingScore: 60,
  });

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const data = await getInstructorQuiz(quizId);

      setQuiz(data.quiz);
      setQuestions(data.questions || []);

      setQuizForm({
        title: data.quiz.title || "",
        passingScore: data.quiz.passing_score ?? 60,
      });
    } catch (error) {
      console.error("Load instructor quiz error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;

    setQuizForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!quizForm.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    try {
      setSaving(true);

      const data = await updateQuiz(quizId, {
        title: quizForm.title,
        passingScore: Number(quizForm.passingScore),
      });

      setQuiz(data.quiz);

      toast.success("Quiz updated successfully");
    } catch (error) {
      console.error("Update quiz error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update quiz"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const handleOptionChange = (
    questionId,
    optionIndex,
    value
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const updatedOptions = [
          ...(question.options || []),
        ];

        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
  };

  const handleUpdateQuestion = async (question) => {
    try {
      setSaving(true);

      const data = await updateQuestion(question.id, {
        questionText: question.question_text,
        options: question.options,
        correctOption: question.correct_option,
        orderIndex: Number(question.order_index),
      });

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === question.id
            ? data.question
            : item
        )
      );

      toast.success("Question updated successfully");
    } catch (error) {
      console.error("Update question error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update question"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm(
      "Delete this question? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(questionId);

      await deleteQuestion(questionId);

      setQuestions((prev) =>
        prev.filter(
          (question) => question.id !== questionId
        )
      );

      toast.success("Question deleted");
    } catch (error) {
      console.error("Delete question error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete question"
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-white/10" />

          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-white/5" />

          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-60 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-center text-white">
        <h1 className="text-2xl font-bold">
          Quiz not found
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/instructor/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Instructor
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Quiz Management
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your quiz and its questions.
          </p>
        </div>

        {/* Quiz information */}
        <form
          onSubmit={handleUpdateQuiz}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="text-lg font-semibold">
            Quiz Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Quiz Title
              </label>

              <input
                type="text"
                name="title"
                value={quizForm.title}
                onChange={handleQuizChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Passing Score
              </label>

              <input
                type="number"
                name="passingScore"
                min="0"
                max="100"
                value={quizForm.passingScore}
                onChange={handleQuizChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </form>

        {/* Questions */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Questions
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {questions.length} question
                {questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] py-16 text-center">
              <h3 className="text-lg font-semibold">
                No questions yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Add questions to this quiz.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  {/* Question header */}
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-semibold">
                      Question {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteQuestion(question.id)
                      }
                      disabled={deleting === question.id}
                      className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      {deleting === question.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>

                  {/* Question text */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Question
                    </label>

                    <textarea
                      rows={3}
                      value={question.question_text || ""}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.id,
                          "question_text",
                          e.target.value
                        )
                      }
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Options */}
                  <div className="mt-5">
                    <label className="mb-3 block text-sm text-slate-300">
                      Options
                    </label>

                    <div className="space-y-3">
                      {(question.options || []).map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-semibold text-slate-400">
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Correct option */}
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Correct Option
                      </label>

                      <input
                        type="text"
                        value={question.correct_option || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "correct_option",
                            e.target.value
                          )
                        }
                        placeholder="Example: A"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Order
                      </label>

                      <input
                        type="number"
                        value={question.order_index || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "order_index",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Save question */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuestion(question)
                      }
                      disabled={saving}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : "Save Question"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorQuiz;
