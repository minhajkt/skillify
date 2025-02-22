import { Box } from "@mui/material";
import Navbar from "../../components/shared/Navbar";
import MainBanner from "../../components/user/MainBanner";
import Category from "../../components/user/Category";
import OurCourses from "../../components/user/OurCourses";
import HiringPartners from "../../components/user/HiringPartners";
// import StudentsReview from "../../components/user/StudentsReview";
import Footer from "../../components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      setOpenSnackbar(true);
      localStorage.removeItem("loginSuccess");
    }
  }, []);

    if(token) {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user?.role === "tutor") {
        return <Navigate to="/tutors/home" replace />;
      } 
    }

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
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          <MainBanner
            sx={{
              mt: { xs: "64px", md: "80px" },
            }}
          />
          <Category />
          <OurCourses searchQuery={searchQuery} />
          <HiringPartners />
          {/* <StudentsReview /> */}
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
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
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
          <OurCourses searchQuery={searchQuery} />
          <Footer />
        </Box>
      )}
    </Box>
  );
};

export default Home;
