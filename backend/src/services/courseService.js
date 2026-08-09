import api from "./api"; // or whatever your axios instance is called

// ... your existing exports (getCourses, getCourseById, etc.)

export const getCourseLessons = (courseId) => {
  return api.get(`/courses/${courseId}/lessons`).then((res) => res.data);
};