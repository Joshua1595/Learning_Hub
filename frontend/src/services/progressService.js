import api from "./api";

export const getCourseProgress = async (courseId) => {
  const response = await api.get(
    `/courses/${courseId}/progress`
  );

  return response.data;
};

export const getLessonProgress = async (courseId) => {
  const response = await api.get(
    `/courses/${courseId}/lesson-progress`
  );

  return response.data;
};

export const markLessonComplete = async (lessonId) => {
  const response = await api.post(
    `/lessons/${lessonId}/complete`
  );

  return response.data;
};

