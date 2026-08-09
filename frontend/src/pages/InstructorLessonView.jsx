import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getInstructorLessonById } from "../services/lessonService";

function InstructorLessonView() {
  const { courseId, lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await getInstructorLessonById(courseId, lessonId);
        setLesson(data.lesson || data);
      } catch (error) {
        console.error("Load instructor lesson error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load lesson"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [courseId, lessonId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 w-28 rounded bg-white/10 mb-4" />
            <div className="h-4 w-36 rounded bg-white/10 mb-2" />
            <div className="h-8 w-72 rounded-lg bg-white/10" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-6 flex gap-3">
            <div className="h-8 w-20 rounded-lg bg-white/10" />
            <div className="h-8 w-24 rounded-lg bg-white/10" />
          </div>
          <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/10" />
        </div>
      </div>
    );
  }

  // Not found
  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <svg className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Lesson not found</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          This lesson could not be loaded or may have been removed.
        </p>
        <Link
          to={`/instructor/courses/${courseId}/lessons`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
        >
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Link
              to={`/instructor/courses/${courseId}/lessons`}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Lessons
            </Link>

            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Instructor Preview
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {lesson.title}
            </h1>
          </div>

          <Link
            to={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
            Edit Lesson
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Meta badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold capitalize text-slate-300">
            {lesson.content_type || "Lesson"}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
            Order #{lesson.order_index}
          </span>
          {lesson.is_preview && (
            <span className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-400">
              Preview enabled
            </span>
          )}
        </div>

        {/* Content player / viewer */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {/* VIDEO */}
          {lesson.content_type === "video" && lesson.content_url && (
            <div className="aspect-video w-full bg-black">
              <video
                key={lesson.id}
                controls
                className="h-full w-full"
                src={lesson.content_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* TEXT */}
          {lesson.content_type === "text" && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {lesson.content || (
                  <span className="text-slate-500 italic">No text content yet.</span>
                )}
              </div>
            </div>
          )}

          {/* FILE */}
          {lesson.content_type === "file" && lesson.content_url && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15">
                <svg
                  className="h-8 w-8 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">{lesson.title}</h2>
              <p className="mt-2 text-sm text-slate-500">Downloadable resource</p>
              <a
                href={lesson.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Open File
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          )}

          {/* Empty content */}
          {!lesson.content_url && !lesson.content && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm text-slate-500">
                No content available for this lesson yet.
              </p>
              <Link
                to={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Add lesson content
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Lesson details card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Lesson details
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                {lesson.title}
              </h2>
              {lesson.course_title && (
                <p className="mt-2 text-sm text-slate-400">
                  Course:{" "}
                  <span className="text-slate-300">{lesson.course_title}</span>
                </p>
              )}
            </div>

            <Link
              to={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Edit
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorLessonView;