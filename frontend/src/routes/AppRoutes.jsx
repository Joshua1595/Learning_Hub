import { Routes, Route } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import StudentDashboard from "../pages/StudentDashboard";
import Lesson from "../pages/Lesson";
import ProtectedRoute from "./ProtectedRoute";
import InstructorDashboard from "../pages/InstructorDashboard";
import CreateCourse from "../pages/CreateCourse";
import RoleRoute from "./RoleRoute";
import EditCourse from "../pages/EditCourse";
import InstructorLessons from "../pages/InstructorLessons";
import CreateLesson from "../pages/CreateLesson";
import EditLesson from "../pages/EditLesson";
import InstructorLessonView from "../pages/InstructorLessonView";
import Quiz from "../pages/Quiz";
import InstructorQuiz from "../pages/InstructorQuiz";
import InstructorCreateQuiz from "../pages/InstructorCreateQuiz";
import InstructorCourseQuizzes from "../pages/InstructorCourseQuizzes";
import StudentCourseQuizzes from "../pages/StudentCourseQuizzes";
import AdminDashboard from "../pages/AdminDashboard";


function AppRoutes() {

  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/courses" element={<Courses />}/>
        <Route path="/courses/:id" element={<CourseDetails />}/>
        <Route 
          path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        <Route
          path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
         <Route
            path="/courses/:courseId/lessons"
            element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            }
          />
           <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/create"
            element={
              <RoleRoute allowedRoles={["instructor", "admin"]}>
                <CreateCourse />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/courses/edit/:courseId"
            element={
              <RoleRoute allowedRoles={["instructor", "admin"]}>
                <EditCourse />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId/lessons"
            element={
              <RoleRoute allowedRoles={["instructor", "admin"]}>
                <InstructorLessons />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId/lessons/create"
            element={<CreateLesson />}
          />
          <Route
            path="/instructor/courses/:courseId/lessons/:lessonId/edit"
            element={<EditLesson />}
          />
          <Route
            path="/instructor/courses/:courseId/lessons/:lessonId"
            element={
              <RoleRoute allowedRoles={["instructor", "admin"]}>
                <InstructorLessonView />
              </RoleRoute>
            }
          />
          <Route
            path="/courses/:courseId/quiz"
            element={<Quiz />}
          />
           
          <Route
            path="/instructor/quizzes/:quizId"
            element={<InstructorQuiz />}
          />
          <Route
            path="/instructor/courses/:courseId/quiz/create"
            element={<InstructorCreateQuiz />}
          />
          <Route
            path="/instructor/courses/:courseId/quizzes"
            element={
              <RoleRoute allowedRoles={["instructor", "admin"]}>
                <InstructorCourseQuizzes />
              </RoleRoute>
            }
          />
          <Route
            path="/courses/:courseId/quizzes"
            element={
              <ProtectedRoute>
                <StudentCourseQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:quizId"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
        </Route>

    </Routes>
  );
}

export default AppRoutes;