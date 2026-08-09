import api from "./api";

export const getCourseQuizzes = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/quizzes`);
  return response.data;
};

export const getQuizForStudent = async (quizId) => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await api.post(`/quizzes/${quizId}/submit`, {
    answers,
  });

  return response.data;
};
export const getInstructorQuiz = async (quizId) => {
  const response = await api.get(`/instructor/quizzes/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId, quizData) => {
  const response = await api.patch(
    `/instructor/quizzes/${quizId}`,
    quizData
  );

  return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
  const response = await api.patch(
    `/instructor/questions/${questionId}`,
    questionData
  );

  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(
    `/instructor/questions/${questionId}`
  );

  return response.data;
};
export const createQuiz = async (courseId, quizData) => {
  const response = await api.post(
    `/courses/${courseId}/quizzes`,
    quizData
  );

  return response.data;
};

export const addQuestion = async (quizId, questionData) => {
  const response = await api.post(
    `/quizzes/${quizId}/questions`,
    questionData
  );

  return response.data;
};
export const getInstructorCourseQuizzes = async (courseId) => {
  const response = await api.get(
    `/instructor/courses/${courseId}/quizzes`
  );

  return response.data.quizzes;
};
export const deleteQuiz = async (quizId) => {
  const response = await api.delete(
    `/instructor/quizzes/${quizId}`
  );

  return response.data;
};