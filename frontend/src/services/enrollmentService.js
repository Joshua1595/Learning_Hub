import api from "./api";

export const enrollCourse = async (courseId) => {
  const response = await api.post(
    `/courses/${courseId}/enroll`
  );

  return response.data;
};


export const getMyCourses = async () => {
  const response = await api.get(
    "/enrollments/my-courses"
  );

  return response.data.courses;
};


export const completeLesson = async (lessonId) => {
  const response = await api.patch(
    `/lessons/${lessonId}/complete`
  );

  return response.data;
};