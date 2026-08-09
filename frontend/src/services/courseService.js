import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data.courses;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data.course;
};
export const getCourseLessons = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/lessons`);
  return response.data.lessons;
};
export const publishCourse = async (courseId) => {
  const response = await api.patch(`/courses/${courseId}/publish`);
  return response.data.course;
}
export const getMyCourses = async () => {
  const response = await api.get( "/courses/my-courses" );
  return response.data.courses;

};
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data.message;
}
export const updateCourse = async (courseId, courseData) => {
  const response = await api.patch(`/courses/${courseId}`, courseData);
  return response.data;
};
export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};
export const uploadCourseImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await api.post("/uploads/course-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};