import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyCourses, publishCourse, deleteCourse } from "../services/courseService";

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getMyCourses();
      setCourses(Array.isArray(data) ? data : data?.courses || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId) => {
    setActionLoading(courseId);
    try {
      await publishCourse(courseId);
      toast.success("Course published successfully");
      await loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not publish course");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setActionLoading(courseId);
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted");
      await loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete course");
    } finally {
      setActionLoading(null);
    }
  };

  const published = courses.filter((c) => c.status === "published").length;
  const drafts = courses.filter((c) => c.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10 mb-3" />
          <div className="h-9 w-72 rounded-lg bg-white/10 mb-10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Instructor Panel
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Courses
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Create, manage, and publish your courses
            </p>
          </div>

          <Link
            to="/instructor/courses/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Course
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Courses
            </p>
            <p className="mt-1 text-3xl font-bold text-white">{courses.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Published
            </p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{published}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Drafts
            </p>
            <p className="mt-1 text-3xl font-bold text-amber-400">{drafts}</p>
          </div>
        </div>

        {/* Empty state */}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <svg className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No courses yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Create your first course and start teaching students worldwide.
            </p>
            <Link
              to="/instructor/courses/create"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => {
              const isPublished = course.status === "published";
              const isActing = actionLoading === course.id;

              return (
                <div
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.05]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-900">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
                        <span className="text-3xl font-bold text-indigo-300/40">
                          {course.title?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute top-3 right-3 rounded-lg px-2.5 py-1 text-xs font-semibold capitalize backdrop-blur-md ${
                        isPublished
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-2 text-lg font-semibold text-white">
                      {course.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {course.level && (
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 capitalize">
                          {course.level}
                        </span>
                      )}
                      {course.category_name && (
                        <span className="text-indigo-400">{course.category_name}</span>
                      )}
                      <span className="font-medium text-slate-300">
                        {course.price === 0 || !course.price ? "Free" : `$${course.price}`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Link
                        to={`/instructor/courses/edit/${course.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                      >
                        Edit
                      </Link>

                      <Link
                        to={`/instructor/courses/${course.id}/lessons`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                      >
                        Lessons
                      </Link>

                      {/* Manage Quiz */}
                      <Link
                        to={`/instructor/courses/${course.id}/quizzes`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200"
                      >
                        Manage Quizzes
                      </Link>
                      {!isPublished && (
                        <button
                          onClick={() => handlePublish(course.id)}
                          disabled={isActing}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/25 disabled:opacity-50"
                        >
                          {isActing ? "..." : "Publish"}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={isActing}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
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

export default InstructorDashboard;