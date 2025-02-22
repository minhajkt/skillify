import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyCourses from "./pages/user/MyCourses";
import UserCourseSection from "./pages/user/UserCourseSection";
import Wishlist from "./components/user/Wishlist";
import EditCourse from "./pages/tutor/EditCourse";
import EditLecture from "./pages/tutor/EditLecture";
// import CourseComplaints from "./components/admin/CourseComplaints";
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";
import PendingPayments from "./components/admin/PendingPayments";
import PaymentHistory from "./components/admin/PaymentHistory";
import TutorPayments from "./components/tutor/TutorPayments";
import { socket } from "./utils/socket";
import { useEffect } from "react";
import ChatComponent from "./components/chat/ChatComponent";
import Contacts from "./components/chat/Contacts";
import TutorContacts from "./components/chat/TutorContacts";
import NotFoundPage from "./components/shared/NotFoundPage";

const stripePromise = loadStripe(
  "pk_test_51QfLoJF574cRRlb7gt4W52ZaKOrTVvdRuxGB5nDgXRQhugeedtvDfqKPFTVryX1uBAnthR40zUGYMeyE7baknYkD00Ar4wRwmH"
);

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      // console.log(`Connected to server with ID: ${socket.id}`);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

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
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/tutors/signup" element={<TutorSignupPage />} />
            <Route path="/tutors/login" element={<TutorLoginPage />} />
            <Route path="/tutors/home" element={<TutorHome />} />

            <Route
              path="/tutors/payment/:tutorId"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <TutorPayments />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutor/edit-course/:courseId"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <EditCourse />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutor/:courseId/edit-lecture"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <EditLecture />
                </ProtectedRoutes>
              }
            />

            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/users/course-details/:courseId"
              element={
                <Elements stripe={stripePromise}>
                  <UserCourseDetailsPage />
                </Elements>
              }
            />
            <Route
              path="/users/my-courses"
              element={
                <ProtectedRoutes requiredRole="user">
                  <MyCourses />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/users/course-section/:courseId"
              element={
                <ProtectedRoutes requiredRole="user">
                  <UserCourseSection />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoutes requiredRole="user">
                  <Contacts />
                </ProtectedRoutes>
              }
            >
              <Route path=":tutorId" element={<ChatComponent />} />
            </Route>

            <Route
              path="/tutors/contacts"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <TutorContacts />
                </ProtectedRoutes>
              }
            >
              <Route path=":studentId" element={<ChatComponent />} />
            </Route>
            <Route
              path="/wishlist"
              element={
                <ProtectedRoutes requiredRole="user">
                  <Wishlist />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoutes requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoutes>
              }
            >
              <Route index element={<Navigate to={"dashboard"} />} />
              <Route path="dashboard" element={<AdminDashBoard />} />
              <Route path="courses" element={<AdminCourse />} />
              <Route path="tutors" element={<AdminTutor />} />
              <Route path="students" element={<AdminStudent />} />
              <Route path="tutor-requests" element={<AdminTutorRequest />} />
              <Route path="course-requests" element={<AdminCourseRequest />} />
              {/* <Route path="course-complaints" element={<CourseComplaints />} /> */}
              <Route path="pending-payments" element={<PendingPayments />} />
              <Route path="payments-history" element={<PaymentHistory />} />
              <Route
                path="/admin/course-details/:courseId"
                element={
                  <ProtectedRoutes requiredRole="admin">
                    <AdminCourseDetailsPage />
                  </ProtectedRoutes>
                }
              />
            </Route>
            <Route
              path="/tutors/create-course"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <CreateCoursePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutors/add-lecture/:courseId"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <AddLecturePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutors/courses"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <AllCoursePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutors/courses/:courseId"
              element={
                <ProtectedRoutes requiredRole="tutor">
                  <CourseDetailsPage />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
