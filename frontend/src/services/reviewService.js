import api from "./api";

// Get all reviews for a course
export const getCourseReviews = async (courseId) => {
  const response = await api.get(
    `/courses/${courseId}/reviews`
  );

  return response.data;
};

// Create or update the logged-in student's review
export const createOrUpdateReview = async (
  courseId,
  reviewData
) => {
  const response = await api.post(
    `/courses/${courseId}/reviews`,
    reviewData
  );

  return response.data;
};

// Delete the logged-in student's review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};
