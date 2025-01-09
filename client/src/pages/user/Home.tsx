import { Box } from "@mui/material";
import Navbar from "../../components/shared/Navbar";
import MainBanner from "../../components/user/MainBanner";
import Category from "../../components/user/Category";
import OurCourses from "../../components/user/OurCourses";
import HiringPartners from "../../components/user/HiringPartners";
import StudentsReview from "../../components/user/StudentsReview";
import Footer from "../../components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const Home = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      setOpenSnackbar(true);
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  return (
    <Box>
      {!token ? (
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />

          <MainBanner
            sx={{
              mt: { xs: "64px", md: "80px" },
            }}
          />
          <Category />
          <OurCourses />
          <HiringPartners />
          <StudentsReview />
          <Footer />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <Snackbar
            open={openSnackbar}
            message="Login successful!"
            autoHideDuration={2000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ zIndex: 2000 }}
          />
          <MainBanner
            sx={{
              mt: { xs: "64px", md: "80px" },
            }}
          />
          <Category />
          <OurCourses />
          <Footer />
        </Box>
      )}
    </Box>
  );
};

export default Home;
