import api from "./api";

// ========================================
// STUDENT
// ========================================

// Get lessons for an enrolled course
export const getCourseLessons = async (courseId) => {
  const response = await api.get(
    `/courses/${courseId}/lessons`
  );

  return response.data;
};

// Get a single lesson
// Backend checks enrollment before returning content
export const getLessonById = async (lessonId) => {
  const response = await api.get(
    `/lessons/${lessonId}`
  );

  return response.data;
};

// ========================================
// INSTRUCTOR
// ========================================

// Get all lessons for instructor's course
export const getInstructorCourseLessons = async (courseId) => {
  const response = await api.get(
    `/instructor/courses/${courseId}/lessons`
  );

  return response.data;
};

// Update lesson
export const updateLesson = async (
  courseId,
  lessonId,
  data
) => {
  const response = await api.put(
    `/courses/${courseId}/lessons/${lessonId}`,
    data
  );

  return response.data;
};

// Get one lesson for instructor
export const getInstructorLessonById = async (
  courseId,
  lessonId
) => {
  const response = await api.get(
    `/instructor/courses/${courseId}/lessons/${lessonId}`
  );

  return response.data;
};