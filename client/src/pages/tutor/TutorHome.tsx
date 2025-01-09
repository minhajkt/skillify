import { Box } from "@mui/material";
import Navbar from "../../components/shared/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Footer from "../../components/shared/Footer";
import TutorSecBanner from "../../components/tutor/TutorSecBanner";
import HowToBegin from "../../components/tutor/HowToBegin";
import EndBanner from "../../components/tutor/EndBanner";
import TutorBanner from "../../components/tutor/TutorBanner";

const TutorHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Box>
      {!user ? (
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
