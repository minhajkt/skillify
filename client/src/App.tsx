import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/user/LoginPage";
import Home from "./pages/user/Home";
import SignupPage from "./pages/user/SignupPage";
import ResetPassword from "./pages/ResetPassword";
import TutorLoginPage from "./pages/tutor/TutorLoginPage";
import TutorSignupPage from "./pages/tutor/TutorSignupPage";
import TutorHome from "./pages/tutor/TutorHome";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashBoard from "./components/admin/AdminDashBoard";
import AdminCourse from "./components/admin/AdminCourse";
import AdminTutor from "./components/admin/AdminTutor";
import AdminStudent from "./components/admin/AdminStudent";
import AdminTutorRequest from "./components/admin/AdminTutorRequest";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CreateCoursePage from "./pages/tutor/CreateCoursePage";
import AddLecturePage from "./pages/tutor/AddLecturePage";
import AllCoursePage from "./pages/tutor/AllCoursePage";
import CourseDetailsPage from "./pages/tutor/CourseDetailsPage";
import AdminCourseRequest from "./components/admin/AdminCourseRequest";
import AdminCourseDetailsPage from "./components/admin/AdminCourseDetailsPage";
import UserCourseDetailsPage from "./pages/user/UserCourseDetailsPage";



function App() {

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/tutors/signup" element={<TutorSignupPage />} />
            <Route path="/tutors/login" element={<TutorLoginPage />} />
            <Route path="/tutors/home" element={<TutorHome />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/users/course-details/:courseId" element={<UserCourseDetailsPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to={"dashboard"} />} />
              <Route path="dashboard" element={<AdminDashBoard />} />
              <Route path="courses" element={<AdminCourse />} />
              <Route path="tutors" element={<AdminTutor />} />
              <Route path="students" element={<AdminStudent />} />
              <Route path="tutor-requests" element={<AdminTutorRequest />} />
              <Route path="course-requests" element={<AdminCourseRequest />} />
              <Route
                path="/admin/course-details/:courseId"
                element={<AdminCourseDetailsPage />}
              />
            </Route>
            <Route
              path="/tutors/create-course"
              element={<CreateCoursePage />}
            />
            <Route
              path="/tutors/add-lecture/:courseId"
              element={<AddLecturePage />}
            />
            <Route path="/tutors/courses" element={<AllCoursePage />} />
            <Route
              path="/tutors/courses/:courseId"
              element={<CourseDetailsPage />}
            />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;