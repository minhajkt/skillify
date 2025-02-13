/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Chip,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";


import { useEffect, useState } from "react";
import { fetchCourseDetails } from "../../api/courseApi";
import { useLocation, useParams } from "react-router-dom";
import { getTutorById } from "../../api/userApi";
import Navbar from "../../components/shared/Navbar";
import { getLecturesByCourseId } from "../../api/lectureApi";
import CheckoutButton from "../../components/user/CheckoutButton";
import ReviewComponent from "../../components/user/ReviewComponent";
import { fetchUserEnrolledCourses } from "../../api/enrollmentApi";
import { ILectures, ICourse,ITutor } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UserCourseDetailsPage = () => {
  const [course, setCourse] = useState<ICourse>();
  const { courseId } = useParams();
  const [tutor, setTutor] = useState<ITutor>()
  const [lectures, setLectures] = useState<ILectures[]>([])
  const [totalHours, setTotalHours] = useState('')
  // const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
      const location = useLocation();
      const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
      const user = useSelector((state: RootState) => state.auth.user)
      

          useEffect(() => {
            if (
              new URLSearchParams(location.search).get("cancelled") === "true"
            ) {
              setShowSuccessSnackbar(true);
              console.log("snacbar set to true", showSuccessSnackbar);
            }
          }, [location.search]);

  useEffect(() => {
    const getCourseDetails = async () => {
      if (!courseId) {
        console.error("Course ID is undefined");
        return; 
      }
      try {
        const data = await fetchCourseDetails(courseId);
        console.log(data);
        
        // const tutorIds
        setCourse(data);

        const tutorData = await getTutorById(data.createdBy)
        // console.log(tutorData.user);
        setTutor(tutorData.user)

        const lectureData = await getLecturesByCourseId(courseId)
        // console.log('lect deatials ', lectures);
        setLectures(lectureData.lectures)
        // console.log("lecturedta.lectures", lectureData.lectures);
        const totalDuration = lectureData.lectures.reduce(
          (sum:number, lecture:ILectures) => sum + lecture.duration,
          0
        );
        setTotalHours((totalDuration / 60).toFixed(1))
        // console.log("Total Duration:", totalHours);

        if(user) {
          const enrolledCourses = await fetchUserEnrolledCourses();
          // console.log("Enrolled Courses:", enrolledCourses);
      if (Array.isArray(enrolledCourses)) {
        const courseEnrolled = enrolledCourses.some(
          (enrolledCourse) =>
            enrolledCourse.courseId && enrolledCourse.courseId._id === courseId
        );
        setIsEnrolled(courseEnrolled);
  
      } else {
        console.error(
          "Unexpected response format for enrolled courses:",
          enrolledCourses
        );
        setIsEnrolled(false);
      }   
      console.log("Is enrolled:", isEnrolled);

        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    getCourseDetails();
  }, [courseId]);

  if (!course) {
    return <Box>Loading...</Box>;
  }


  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        width: "100vw",
        py: 4,
        // pr: 0,
      }}
    >
      <Navbar />

      <Box
        sx={{
          bgcolor: "#1a1a1a",
          color: "white",
          pb: 6,
          mb: 4,
          mt: { xs: "64px", md: "80px" },
        }}
      >
        <Grid container spacing={4} maxWidth="lg" mx="auto">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={"bold"}
              gutterBottom
            >
              {course.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {course.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
              <Rating value={averageRating} readOnly precision={0.5} />
              <Typography variant="body2">({totalReviews} ratings)</Typography>
            </Box>
            <Typography variant="body2">
              Course Created by: {tutor?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
              <LanguageOutlinedIcon fontSize="small" />
              <Typography sx={{ marginLeft: 1 }}>English</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4} maxWidth="lg" mx="auto">
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={"medium"} gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {course.description}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={"medium"} gutterBottom>
                Course Content
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {lectures.length} lectures
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AccessTimeOutlinedIcon fontSize="small" sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {totalHours} Hours
                </Typography>
              </Box>
              {lectures?.map((lecture, index) => (
                <Typography key={lecture._id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ lineHeight: 3 }}
                  >
                    <DoneAllIcon />
                    {lecture.title}
                  </Box>
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 24 }}>
            <CardContent>
              <Box sx={{ width: "100%", height: 200, mb: 2 }}>
                <img
                  src={
                      typeof course.thumbnail === "string"
                        ? course.thumbnail
                        : undefined
                    }
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Typography sx={{ fontWeight: "medium", lineHeight: 2 }}>
                {course.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "regular", lineHeight: 2 }}>
                  {course.rating}
                  {5}
                </Typography>
                <Chip
                  label={course.category}
                  variant="outlined"
                  sx={{ fontSize: "12px" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                  ₹ {course.price}
                </Typography>
                <Chip
                  label={`${course.lectures?.length || 0} lectures`}
                  variant="outlined"
                  sx={{ fontSize: "12px" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography sx={{ fontSize: "14px", lineHeight: 2 }}>
                  Created By :{" "}
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {" "}
                    {tutor?.name}
                  </span>
                </Typography>
                <Chip
                  label="English"
                  variant="outlined"
                  sx={{ fontSize: "12px" }}
                />
              </Box>
              <CheckoutButton disabled={isEnrolled} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
              <Snackbar
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert severity="warning">
                  Your Payment was cancelled
                </Alert>
              </Snackbar>
              {courseId && (
                <ReviewComponent
                  courseId={courseId}
                  setAverageRating={setAverageRating}
                  setTotalReviews={setTotalReviews}
                />
              )}
    </Box>
  );
};

export default UserCourseDetailsPage;


