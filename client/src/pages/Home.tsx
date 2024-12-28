import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import MainBanner from "../components/MainBanner";
import Category from "../components/Category";
import OurCourses from "../components/ourCourses";
import HiringPartners from "../components/HiringPartners";
import StudentsReview from "../components/StudentsReview";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


const Home = () => {
      const token = useSelector((state: RootState) => state.auth.token);
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
