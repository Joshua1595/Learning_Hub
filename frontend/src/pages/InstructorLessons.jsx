import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getInstructorCourseLessons } from "../services/lessonService";

function InstructorLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const data = await getInstructorCourseLessons(courseId);
        setLessons(data.lessons || data || []);
      } catch (error) {
        console.error("Load instructor lessons error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load lessons"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-32 rounded bg-white/10 mb-3" />
          <div className="h-9 w-56 rounded-lg bg-white/10 mb-2" />
          <div className="h-5 w-72 rounded bg-white/5 mb-10" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-20 rounded-2xl border border-white/10 bg-white/5"
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
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/instructor/dashboard"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </Link>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Instructor
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Course Lessons
            </h1>
            <p className="mt-2 text-base text-slate-400">
              {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this course
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/instructor/courses/${courseId}/quiz/create`}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
              Create Quiz
            </Link>

            <Link
              to={`/instructor/courses/${courseId}/lessons/create`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Lesson
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No lessons yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Add your first lesson to start building this course.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/instructor/courses/${courseId}/lessons/create`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Create First Lesson
              </Link>
              <Link
                to={`/instructor/courses/${courseId}/quiz/create`}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-6 py-3 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20"
              >
                Create Quiz
              </Link>
            </div>
          </div>
        ) : (
          /* Lessons list */
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:border-indigo-500/20 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-sm font-bold text-indigo-400">
                    {lesson.order_index ?? index + 1}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-white group-hover:text-indigo-200 transition-colors">
                      {lesson.title}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 capitalize">
                        {lesson.content_type || "Lesson"}
                      </span>
                      {lesson.is_preview && (
                        <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-400">
                          Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <Link
                    to={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/instructor/courses/${courseId}/lessons/${lesson.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/20 px-3.5 py-2 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-600/30 hover:text-indigo-200"
                  >
                    View
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorLessons;