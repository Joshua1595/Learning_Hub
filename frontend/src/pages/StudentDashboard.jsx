import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses } from "../services/enrollmentService";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getMyCourses();
        setCourses(data || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 h-24 animate-pulse rounded-2xl bg-white/5" />

          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Student Dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Learning
            </h1>

            <p className="mt-2 text-base text-slate-400">
              Welcome back — pick up exactly where you left off.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            Browse Catalog
          </Link>
        </div>

        {/* Stats strip */}
        {courses.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Enrolled */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Enrolled
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {courses.length}
              </p>
            </div>

            {/* In Progress */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                In Progress
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {courses.filter((c) => {
                  const total = c.total_lessons || 0;
                  const completed = c.completed_lessons || 0;

                  return total > 0 && completed < total;
                }).length}
              </p>
            </div>

            {/* Completed */}
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:col-span-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {courses.filter((c) => {
                  const total = c.total_lessons || 0;
                  const completed = c.completed_lessons || 0;

                  return total > 0 && completed >= total;
                }).length}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg
                className="h-7 w-7 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-white">
              No courses enrolled yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Explore our catalog and start your learning journey today.
            </p>

            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const total = course.total_lessons || 0;
              const completed = course.completed_lessons || 0;

              const progressPercent =
                total > 0
                  ? Math.min(
                      Math.round((completed / total) * 100),
                      100
                    )
                  : 0;

              const isCompleted =
                total > 0 && completed >= total;

              return (
                <div
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:bg-white/[0.05]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
                        <span className="text-3xl font-bold text-indigo-300/60">
                          {course.title
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Level badge */}
                    <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs font-semibold capitalize text-white backdrop-blur-md">
                      {course.level}
                    </span>

                    {/* Completed badge */}
                    {isCompleted && (
                      <span className="absolute left-3 top-3 rounded-lg bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="min-h-[3.5rem] line-clamp-2 text-lg font-semibold text-white">
                      {course.title}
                    </h2>

                    {/* Progress */}
                    <div className="mt-auto pt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {progressPercent}% complete
                        </span>

                        <span className="font-medium text-slate-300">
                          {completed}/{total} lessons
                        </span>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-indigo-500 to-violet-500"
                          }`}
                          style={{
                            width: `${progressPercent}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-2">
                      {/* Continue Learning */}
                      <Link
                        to={`/courses/${course.id}/lessons`}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                          isCompleted
                            ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
                        }`}
                      >
                        {isCompleted
                          ? "Review Course"
                          : "Continue Learning"}

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

                      {/* Take Quiz - shows ALL quizzes */}
                      <Link
                        to={`/courses/${course.id}/quizzes`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200"
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414V19a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414"
                          />
                        </svg>

                        Take Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

