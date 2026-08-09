import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCourseLessons,
  getLessonById,
} from "../services/lessonService";

import {
  getCourseProgress,
  getLessonProgress,
  markLessonComplete,
} from "../services/progressService";

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [lessonProgress, setLessonProgress] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCompleting, setIsCompleting] = useState(false);

  // --------------------------------------------------
  // LOAD COURSE LESSONS + PROGRESS
  // --------------------------------------------------

  const loadCourseData = useCallback(async () => {
    if (!courseId) {
      return {
        courseLessons: [],
        studentLessonProgress: [],
      };
    }

    setLoading(true);
    setError("");

    try {
      const [
        lessonsData,
        courseProgressData,
        lessonProgressData,
      ] = await Promise.all([
        getCourseLessons(courseId),
        getCourseProgress(courseId),
        getLessonProgress(courseId),
      ]);

      const courseLessons =
        lessonsData?.lessons || [];

      const studentLessonProgress =
        lessonProgressData?.progress || [];

      setLessons(courseLessons);
      setProgress(courseProgressData);
      setLessonProgress(studentLessonProgress);

      return {
        courseLessons,
        studentLessonProgress,
      };
    } catch (err) {
      console.error("Load course data error:", err);

      setError(
        err.response?.data?.message ||
          "Could not load course lessons"
      );

      return {
        courseLessons: [],
        studentLessonProgress: [],
      };
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // --------------------------------------------------
  // LOAD COURSE
  // --------------------------------------------------

  useEffect(() => {
    if (!courseId) return;

    const initializePage = async () => {
      const {
        courseLessons,
        studentLessonProgress,
      } = await loadCourseData();

      if (courseLessons.length === 0) {
        return;
      }

      // No lesson in URL → open first incomplete lesson
      if (!lessonId) {
        const firstIncompleteLesson =
          courseLessons.find((item) => {
            const progress =
              studentLessonProgress.find(
                (p) => p.lesson_id === item.id
              );

            return !progress?.is_completed;
          });

        const lessonToOpen =
          firstIncompleteLesson ||
          courseLessons[0];

        navigate(
          `/courses/${courseId}/lessons/${lessonToOpen.id}`,
          { replace: true }
        );

        return;
      }

      // Lesson ID exists → load that lesson
      try {
        const lessonData =
          await getLessonById(lessonId);

        setLesson(
          lessonData?.lesson || null
        );
      } catch (err) {
        console.error("Load lesson error:", err);

        setError(
          err.response?.data?.message ||
            "Could not load lesson"
        );
      }
    };

    initializePage();
  }, [
    courseId,
    lessonId,
    loadCourseData,
    navigate,
  ]);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const isLessonCompleted = (id) => {
    return Boolean(
      lessonProgress.find(
        (p) => p.lesson_id === id
      )?.is_completed
    );
  };

  const currentIndex = lessons.findIndex(
    (l) => l.id === lesson?.id
  );

  const hasPrev = currentIndex > 0;

  const hasNext =
    currentIndex !== -1 &&
    currentIndex < lessons.length - 1;

  const completedCount =
    progress?.completedLessons ??
    lessons.filter((l) =>
      isLessonCompleted(l.id)
    ).length;

  const totalCount =
    progress?.totalLessons ??
    lessons.length;

  const percentage =
    progress?.percentage ??
    (totalCount > 0
      ? Math.round(
          (completedCount / totalCount) * 100
        )
      : 0);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const goToPrev = () => {
    if (!hasPrev) return;

    navigate(
      `/courses/${courseId}/lessons/${
        lessons[currentIndex - 1].id
      }`
    );
  };

  const goToNext = () => {
    if (!hasNext) return;

    navigate(
      `/courses/${courseId}/lessons/${
        lessons[currentIndex + 1].id
      }`
    );
  };

  // --------------------------------------------------
  // MARK COMPLETE
  // --------------------------------------------------

  const handleComplete = async () => {
    if (
      !lesson ||
      isLessonCompleted(lesson.id)
    ) {
      return;
    }

    setIsCompleting(true);

    try {
      await markLessonComplete(lesson.id);

      const [
        courseProgressData,
        lessonProgressData,
      ] = await Promise.all([
        getCourseProgress(courseId),
        getLessonProgress(courseId),
      ]);

      setProgress(courseProgressData);

      setLessonProgress(
        lessonProgressData?.progress ||
          lessonProgressData ||
          []
      );

      toast.success(
        "Lesson marked as complete!"
      );
    } catch (error) {
      console.error(
        "Complete lesson error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark lesson complete"
      );
    } finally {
      setIsCompleting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading lesson...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-white">
            Something went wrong
          </h2>

          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>

          <Link
            to="/student/dashboard"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO LESSONS
  // --------------------------------------------------

  if (lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">
            No lessons available
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This course does not have any lessons yet.
          </p>

          <Link
            to="/student/dashboard"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white lg:flex-row">

      {/* MAIN CONTENT */}

      <div className="flex-1 p-4 sm:p-6 lg:max-h-screen lg:overflow-y-auto lg:p-8">

        {/* Top bar */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
          >
            ← Back to Dashboard
          </Link>

          {/* Progress */}

          <div className="flex items-center gap-3">

            <div
              className="relative h-10 w-10 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(#6366f1 ${percentage}%, #1e293b 0)`,
              }}
            >
              <div className="absolute inset-1.5 flex items-center justify-center rounded-full bg-slate-950">
                <span className="text-[10px] font-bold text-indigo-400">
                  {percentage}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {completedCount} / {totalCount} lessons completed
              </p>

              <p className="text-xs text-slate-500">
                Course Progress
              </p>
            </div>

          </div>
        </div>

        {/* Lesson content */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">

          {lesson?.content_type === "video" &&
            lesson.content_url && (
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

          {lesson?.content_type === "text" && (
            <div className="p-6 sm:p-8">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {lesson.content}
              </div>
            </div>
          )}

          {lesson?.content_type === "file" &&
            lesson.content_url && (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
                <div className="text-5xl">
                  📄
                </div>

                <p className="text-lg font-semibold text-white">
                  {lesson.title}
                </p>

                <a
                  href={lesson.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
                >
                  Download / Open File
                </a>
              </div>
            )}

          {!lesson?.content_url &&
            !lesson?.content && (
              <div className="flex items-center justify-center py-20 text-slate-500">
                No content available for this lesson.
              </div>
            )}

        </div>

        {/* Lesson title */}

        {lesson && (
          <div className="mt-6">

            <div className="mb-2 flex flex-wrap items-center gap-2">

              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>

              {isLessonCompleted(lesson.id) && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  ✓ Completed
                </span>
              )}

            </div>

            <h1 className="text-2xl font-bold text-white">
              {lesson.title}
            </h1>

          </div>
        )}

        {/* Navigation */}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex gap-3">

            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              onClick={goToNext}
              disabled={!hasNext}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 disabled:opacity-40"
            >
              Next →
            </button>

          </div>

          <button
            onClick={handleComplete}
            disabled={
              isCompleting ||
              isLessonCompleted(lesson?.id)
            }
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold ${
              isLessonCompleted(lesson?.id)
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-600 text-white"
            }`}
          >
            {isCompleting
              ? "Saving..."
              : isLessonCompleted(lesson?.id)
              ? "✓ Completed"
              : "Mark as Complete"}
          </button>

        </div>
      </div>

      {/* SIDEBAR */}

      <div className="w-full border-t border-white/10 bg-slate-950/80 lg:w-96 lg:border-l lg:border-t-0">

        <div className="border-b border-white/10 p-5">
          <h2 className="text-sm font-bold text-white">
            Course Curriculum
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        <div className="max-h-[420px] space-y-1 overflow-y-auto p-3 lg:max-h-[calc(100vh-80px)]">

          {lessons.map((item, index) => {

            const completed =
              isLessonCompleted(item.id);

            const isActive =
              lesson?.id === item.id;

            return (
              <Link
                key={item.id}
                to={`/courses/${courseId}/lessons/${item.id}`}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${
                  isActive
                    ? "border-indigo-500/40 bg-indigo-600/15"
                    : "border-transparent hover:bg-white/5"
                }`}
              >

                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    completed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isActive
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className={`truncate text-sm font-medium ${
                      isActive
                        ? "text-indigo-300"
                        : "text-slate-200"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-slate-500">
                    {item.content_type || "Lesson"}
                  </p>

                </div>

              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default LessonPage;