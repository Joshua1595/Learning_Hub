import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuizForStudent, submitQuiz } from "../services/quizService";

function Quiz() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load quiz directly by quizId
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;

      try {
        setLoading(true);
        setResult(null);
        setAnswers({});

        const data = await getQuizForStudent(quizId);

        setQuiz(data.quiz || data);
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Load quiz error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quiz || questions.length === 0) return;

    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(
        `Please answer all ${unanswered.length} remaining question${
          unanswered.length !== 1 ? "s" : ""
        }.`
      );
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })
    );

    try {
      setSubmitting(true);
      const data = await submitQuiz(quiz.id, formattedAnswers);
      setResult(data);

      toast.success(
        data.passed
          ? "Congratulations! You passed the quiz."
          : "Quiz submitted."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit quiz error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-6 h-4 w-32 rounded bg-white/10" />
          <div className="mb-3 h-9 w-72 rounded-lg bg-white/10" />
          <div className="mb-10 h-5 w-48 rounded bg-white/5" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="mb-5 h-40 rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  // Quiz not found / failed to load
  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-bold text-white">Quiz not found</h1>
            <p className="mt-2 text-sm text-slate-400">
              This quiz could not be loaded or does not exist.
            </p>
            <Link
              to="/student/dashboard"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                result.passed ? "bg-emerald-500/15" : "bg-rose-500/15"
              }`}
            >
              {result.passed ? (
                <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <p
              className={`mt-6 text-sm font-semibold uppercase tracking-widest ${
                result.passed ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {result.passed ? "Quiz Passed" : "Quiz Failed"}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white">{quiz.title}</h1>

            <div className="mt-8">
              <p className="text-sm text-slate-400">Your Score</p>
              <p
                className={`mt-2 text-6xl font-bold ${
                  result.passed ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {Number(result.score).toFixed(0)}%
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Passing score: {quiz.passing_score}%
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleRetake}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Retake Quiz
              </button>
              <Link
                to="/student/dashboard"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to="/student/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          Course Quiz
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {quiz.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>Passing score: {quiz.passing_score}%</span>
        </div>

        {questions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">No questions yet</h2>
            <p className="mt-2 text-sm text-slate-400">
              This quiz does not contain any questions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="mb-5 flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-sm font-bold text-indigo-400">
                      {index + 1}
                    </div>
                    <h2 className="pt-1 text-base font-semibold leading-6 text-white">
                      {question.question_text}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(question.options) &&
                      question.options.map((option, optionIndex) => {
                        const optionValue =
                          typeof option === "object"
                            ? option.label ?? option.value ?? option.text
                            : option;
                        const optionText =
                          typeof option === "object"
                            ? option.text ?? option.label ?? option.value
                            : option;
                        const selected = answers[question.id] === optionValue;

                        return (
                          <label
                            key={optionIndex}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                              selected
                                ? "border-indigo-500/60 bg-indigo-500/10"
                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optionValue}
                              checked={selected}
                              onChange={() =>
                                handleAnswerChange(question.id, optionValue)
                              }
                              className="h-4 w-4 accent-indigo-500"
                            />
                            <span className="text-sm text-slate-300">
                              {optionText}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Quiz;