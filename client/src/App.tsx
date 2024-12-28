import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import ResetPassword from "./pages/ResetPassword";

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<div>Welcome to the app</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
