import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCourseQuizzes } from "../services/quizService";

function StudentCourseQuizzes() {
  const { courseId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, [courseId]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getCourseQuizzes(courseId);
      setQuizzes(data.quizzes || data || []);
    } catch (error) {
      console.error("Load course quizzes error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load quizzes"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-36 rounded bg-white/10 mb-3" />
          <div className="h-9 w-56 rounded-lg bg-white/10 mb-2" />
          <div className="h-5 w-72 rounded bg-white/5 mb-10" />
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-48 rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/student/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Student
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Course Quizzes
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Choose a quiz to test your knowledge
          </p>
        </div>

        {/* Empty state */}
        {quizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">
              No quizzes available
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              This course does not have any quizzes yet.
            </p>
            <Link
              to="/student/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Quiz count */}
            <div className="mb-6">
              <p className="text-sm text-slate-500">
                {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} available
              </p>
            </div>

            {/* Quiz cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                        Quiz {index + 1}
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-white line-clamp-2 group-hover:text-indigo-200 transition-colors">
                        {quiz.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                      Pass: {quiz.passing_score ?? 70}%
                    </span>
                  </div>

                  {/* Optional meta */}
                  {(quiz.questions_count != null || quiz.time_limit) && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {quiz.questions_count != null && (
                        <span>
                          {quiz.questions_count} question
                          {quiz.questions_count !== 1 ? "s" : ""}
                        </span>
                      )}
                      {quiz.time_limit && (
                        <span>· {quiz.time_limit} min</span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/30"
                    >
                      Take Quiz
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentCourseQuizzes;