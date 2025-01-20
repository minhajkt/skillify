import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUserEnrolledCourses } from "../../api/enrollmentApi";
import { Person } from "@mui/icons-material";
import Navbar from "../../components/shared/Navbar";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewModal from "../../components/user/ReviewModal";
import { addCourseReview, deleteCourseReview, fetchUserReview, updateCourseReview } from "../../api/reviewApi";
import { handleAxiosError } from "../../utils/errorHandler";
import Footer from "../../components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [userReview, setUserReview] = useState(null);
    const location = useLocation();
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
      const [snackbar, setSnackbar] = useState(false);
      const [deleteSnackbar, setDeleteSnackbar] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user._id;

    useEffect(() => {
      if (new URLSearchParams(location.search).get("success") === "true") {
        setShowSuccessSnackbar(true);
        // console.log('snacbar set to true', showSuccessSnackbar);
        
      }
    }, [location.search]);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await fetchUserEnrolledCourses();
        setEnrolledCourses(response);
        console.log('resposne for enrolledcourssssssssssssssssssse', response);
        
      } catch (error) {
        setError("You have no courses enrolled");
      } finally {
        setLoading(false);
      }
    };
    getEnrolledCourses();
  }, []);


useEffect(() => {
  const getUserReview = async () => {
    if (selectedCourse) {
      try {
        // console.log('userrrrrrrrrrrrrrrrrrrrrrrrr', userId);
        
        const response = await fetchUserReview(
          selectedCourse.courseId._id,
          userId
        );
        if (response) {
          setUserReview(response);
          setReviewText(response.reviewText); 
          setRating(response.rating); 
        } else {
          setUserReview(null); 
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }
  };

  getUserReview();
}, [selectedCourse, userId]);

  const handleOpenModal = (course) => {
    
    setSelectedCourse(course);
    console.log('seelcted coures in modal', course);
    
    
    // console.log("selectedCourse.courseId is ", course.courseId._id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourse(null);
    setReviewText("");
    setRating(null);
  };

    const handleSubmitReview = async() => {
      if (rating && reviewText.trim()) {
        console.log("Review data being sentttttttttttttttttttttt:", {
          reviewText,
          rating,
        });


        const reviewData = {
          courseId: selectedCourse.courseId._id,
          rating,
          reviewText
        }
        try {
          let updatedReview;
          if (userReview) {
         updatedReview = await updateCourseReview(selectedCourse.courseId._id, userId, reviewText, rating);
        console.log("Review updated!");
        setSnackbar(true)
        console.log("snackbar updatecouser review open is ", snackbar);

      } else {
         updatedReview = await addCourseReview(reviewData);
        }
        setSnackbar(true);
        console.log('snackbar  addreiview review open is ', snackbar);
        
      setUserReview(updatedReview);
      handleCloseModal();
        } catch (error) {
          throw handleAxiosError(error)
        }
      } else {
        alert("Please provide a rating and review text before submitting.");
      }
    };

      const handleDeleteReview = async () => {
        if (userReview) {
          try {
            await deleteCourseReview(selectedCourse.courseId._id, userId);
            setUserReview(null); 
            setReviewText("");
            setRating(null);
            setDeleteSnackbar(true)
            handleCloseModal();
          } catch (error) {
            console.error("Error deleting review:", error);
          }
        }
      };
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box sx={{ width: "100vw" }}>
      <Box sx={{ px: { xs: 0, md: 25 }, mb: 6, width: "70vw", height: "80vh" }}>
        <Box
          sx={{
            width: "100%",
            p: 3,
            mt: { xs: "64px", md: "80px" },
            bgcolor: "#FAFAFA",
          }}
        >
          <Navbar />
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              My courses
            </Typography>
          </Box>
          <Stack spacing={2}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Card
                  key={course.courseId._id}
                  sx={{
                    display: "flex",
                    height: "150px",
                    "&:hover": {
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 200, objectFit: "cover" }}
                    image={course.courseId.thumbnail}
                    alt={course.courseId.title}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      p: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <CardContent sx={{ flex: "1 0 auto", p: 0 }}>
                      <Typography component="div" variant="h6">
                        {course.courseId.title}
                      </Typography>
                      <Typography component="div" variant="body1">
                        {course.courseId.category}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Person2OutlinedIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {course.courseId.createdBy.name}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pr: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleOpenModal(course)}
                      >
                        Review
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/users/course-section/${course.courseId._id}`
                          )
                        }
                      >
                        Continue Learning
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))
            ) : (
              <Typography>No Enrolled Courses</Typography>
            )}
          </Stack>
        </Box>
        <Snackbar
          open={showSuccessSnackbar}
          onClose={() => setShowSuccessSnackbar(false)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">
            Payment successful! You are now enrolled.
          </Alert>
        </Snackbar>

        <ReviewModal
          open={openModal}
          onClose={handleCloseModal}
          courseTitle={selectedCourse?.courseId.title || ""}
          rating={rating}
          setRating={setRating}
          reviewText={reviewText}
          setReviewText={setReviewText}
          onSubmit={handleSubmitReview}
          onDelete={handleDeleteReview}
          userReview={userReview}
        />
      </Box>
      <Snackbar
        open={snackbar}
        onClose={() => setSnackbar(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="Review submitted successfully!"
      />
      <Snackbar
        open={deleteSnackbar}
        onClose={() => setDeleteSnackbar(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="Review deleted successfully!"
      />
      {/* <Footer /> */}
    </Box>
  );
};

export default MyCourses;
