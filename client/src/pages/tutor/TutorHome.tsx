import { Box } from "@mui/material";
import Navbar from "../../components/shared/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Footer from "../../components/shared/Footer";
import TutorSecBanner from "../../components/tutor/TutorSecBanner";
import HowToBegin from "../../components/tutor/HowToBegin";
import EndBanner from "../../components/tutor/EndBanner";
import TutorBanner from "../../components/tutor/TutorBanner";
import { Navigate } from "react-router-dom";

const TutorHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "user") {
      return <Navigate to="/home" replace />;
    }
  }

  return (
    <Box>
      {!user ? (
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />
          <TutorBanner
            sx={{
              mt: { xs: "64px", md: "80px" },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            // minHeight: "100vh",
          }}
        >
          <Navbar />
          <TutorBanner
            sx={{
              mt: { xs: "64px", md: "80px" },
            }}
          />
        </Box>
      )}
      <TutorSecBanner />
      <HowToBegin />
      {!user ? <EndBanner /> : <Box />}
      <Footer />
    </Box>
  );
};

export default TutorHome;
