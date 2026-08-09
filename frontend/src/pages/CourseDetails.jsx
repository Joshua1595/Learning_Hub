import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getCourseById } from "../services/courseService";
import { enrollCourse } from "../services/enrollmentService";
import {
  getCourseReviews,
  createOrUpdateReview,
  deleteReview,
} from "../services/reviewService";
import { AuthContext } from "../context/AuthContext";

function CourseDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Load course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data?.course || data);
      } catch (error) {
        console.error("Load course error:", error);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // Load reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getCourseReviews(id);
        setReviews(data?.reviews || data || []);
      } catch (error) {
        console.error("Load reviews error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load course reviews."
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // Enroll
  const handleEnroll = async () => {
    if (!course) return;

    setIsEnrolling(true);
    try {
      await enrollCourse(course.id);
      toast.success("Successfully enrolled!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setIsSubmittingReview(true);

      await createOrUpdateReview(course.id, {
        rating,
        comment: comment.trim(),
      });

      toast.success("Review saved successfully!");

      const data = await getCourseReviews(course.id);
      setReviews(data?.reviews || data || []);

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Save review error:", error);
      toast.error(
        error.response?.data?.message || "Could not save your review."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;

    try {
      setDeletingReviewId(reviewId);
      await deleteReview(reviewId);

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error(
        error.response?.data?.message || "Could not delete review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Can the current user delete this review?
  const canDeleteReview = (review) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return (
      review.student_id === user.id ||
      review.user_id === user.id ||
      review.student_email === user.email
    );
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-8 h-5 w-32 rounded bg-white/5" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-96 rounded-2xl bg-white/5" />
              <div className="h-48 rounded-2xl bg-white/5" />
            </div>
            <div className="h-96 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-white">Course Not Found</h1>
          <p className="mt-3 text-slate-400">
            The course you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isFree = course.price === 0 || !course.price;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to all courses
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main course card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  {course.category_name || "General"}
                </span>
                {course.level && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-slate-300">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {course.title}
              </h1>

              {course.instructor_name && (
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                    {course.instructor_name.substring(0, 1).toUpperCase()}
                  </div>
                  <span>
                    by{" "}
                    <span className="font-medium text-slate-200">
                      {course.instructor_name}
                    </span>
                  </span>
                </div>
              )}

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white">
                  About this course
                </h3>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-400">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Course details */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="mb-5 text-lg font-semibold text-white">
                Course details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Skill Level</p>
                    <p className="text-sm capitalize text-slate-400">
                      {course.level || "All levels"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Category</p>
                    <p className="text-sm text-slate-400">
                      {course.category_name || "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Course Reviews</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    See what other students think about this course.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-white">{averageRating}</div>
                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= Math.round(Number(averageRating))
                              ? "text-yellow-400"
                              : "text-slate-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review form */}
              {user ? (
                <form
                  onSubmit={handleSubmitReview}
                  className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    Leave a review
                  </h3>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-medium text-slate-300">
                      Your rating
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-3xl transition ${
                            star <= rating
                              ? "text-yellow-400"
                              : "text-slate-600 hover:text-yellow-300"
                          }`}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="review-comment"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Comment
                    </label>
                    <textarea
                      id="review-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience with this course..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingReview ? "Saving..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
                  <p className="text-sm text-slate-400">
                    Sign in to leave a review.
                  </p>
                  <Link
                    to="/login"
                    className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Reviews list */}
              <div className="mt-8 border-t border-white/10 pt-8">
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-28 animate-pulse rounded-xl bg-white/5"
                      />
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="text-4xl text-slate-600">★</div>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      No reviews yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Be the first student to review this course.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                              {review.student_name?.substring(0, 1).toUpperCase() ||
                                "S"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {review.student_name || "Student"}
                              </p>
                              <div className="mt-0.5 flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={
                                      star <= Number(review.rating)
                                        ? "text-sm text-yellow-400"
                                        : "text-sm text-slate-600"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">
                              {review.created_at
                                ? new Date(review.created_at).toLocaleDateString()
                                : ""}
                            </span>

                            {/* Delete button — only for owner or admin */}
                            {canDeleteReview(review) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(review.id)}
                                disabled={deletingReviewId === review.id}
                                className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingReviewId === review.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="mt-4 text-sm leading-6 text-slate-400">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Enrollment card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="mb-6 text-center">
                <p className="text-sm font-medium text-slate-400">Price</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-white">
                  {isFree ? "Free" : `$${course.price}`}
                </p>
                {isFree && (
                  <p className="mt-1 text-xs text-emerald-400">
                    Full access at no cost
                  </p>
                )}
              </div>

              <div className="mb-6 space-y-3 border-y border-white/10 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Instructor</span>
                  <span className="font-medium text-white">
                    {course.instructor_name || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Level</span>
                  <span className="font-medium capitalize text-white">
                    {course.level || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Category</span>
                  <span className="font-medium text-white">
                    {course.category_name || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Reviews</span>
                  <span className="font-medium text-white">{reviews.length}</span>
                </div>
              </div>

              {user ? (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isEnrolling ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enrolling...
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                  >
                    Sign In to Enroll
                  </Link>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Create an account or sign in to get access
                  </p>
                </div>
              )}

              <p className="mt-5 text-center text-xs text-slate-500">
                Lifetime access · Learn at your own pace
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;