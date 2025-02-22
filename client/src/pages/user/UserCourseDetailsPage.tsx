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
  Skeleton,
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
import { ILectures, ICourse, ITutor } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UserCourseDetailsPage = () => {
  const [course, setCourse] = useState<ICourse>();
  const { courseId } = useParams();
  const [tutor, setTutor] = useState<ITutor>();
  const [lectures, setLectures] = useState<ILectures[]>([]);
  const [totalHours, setTotalHours] = useState("");
  // const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const location = useLocation();
  const [error , setError] = useState('')
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("cancelled") === "true") {
      setShowSuccessSnackbar(true);
    }
  }, [location.search]);

  useEffect(() => {
    const getCourseDetails = async () => {
      if (!courseId) {
        setError("Course ID is undefined");
        return;
      }
      try {
        const data = await fetchCourseDetails(courseId);
        setCourse(data);

        const tutorData = await getTutorById(data.createdBy);
        setTutor(tutorData.user);

        const lectureData = await getLecturesByCourseId(courseId);
        setLectures(lectureData.lectures);
        const totalDuration = lectureData.lectures.reduce(
          (sum: number, lecture: ILectures) => sum + lecture.duration,
          0
        );
        setTotalHours((totalDuration / 60).toFixed(1));

        if (user) {
          const enrolledCourses = await fetchUserEnrolledCourses();
          if (Array.isArray(enrolledCourses)) {
            const courseEnrolled = enrolledCourses.some(
              (enrolledCourse) =>
                enrolledCourse.courseId &&
                enrolledCourse.courseId._id === courseId
            );
            setIsEnrolled(courseEnrolled);
          } else {
            setError(
              "Unexpected response format for enrolled courses:");
            setIsEnrolled(false);
          }
        }
      } catch (error) {
        setError("Error fetching course details");
      }
    };

    getCourseDetails();
  }, [courseId]);

  if (!course) {
    return (
      <Box sx={{ width: "100%", height: "100vh" }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        width: "100vw",
        py: { xs: 1, md: 4 },
        // pr: 0,
      }}
    >
      <Navbar />

      <Box
        sx={{
          bgcolor: "#1a1a1a",
          color: "white",
          pb: { xs: 2, md: 6 },
          mb: { xs: 2, md: 4 },
          mt: { xs: "64px", md: "80px" },
          ml: { xs: -3, md: 0 },
        }}
      >
        <Grid
          container
          spacing={4}
          maxWidth={{ xs: "100%", lg: "lg" }}
          mx="auto"
        >
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={"bold"}
              sx={{ fontSize: { xs: 20, md: 34 } }}
              gutterBottom
            >
              {course.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: 12, md: 16 },
              }}
              gutterBottom
            >
              {course.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                my: { xs: 1, md: 2 },
              }}
            >
              <Rating
                value={averageRating}
                readOnly
                precision={0.5}
                sx={{ fontSize: { xs: 18, md: 24 } }}
              />
              <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
                ({totalReviews} ratings)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
              Course Created by: {tutor?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
              <LanguageOutlinedIcon
                fontSize="small"
                sx={{ fontSize: { xs: 16, md: 20 } }}
              />
              <Typography sx={{ marginLeft: 1, fontSize: { xs: 14, md: 16 } }}>
                English
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        spacing={4}
        maxWidth={{ xs: "100%", md: "lg" }}
        mx={{ xs: -2, md: "auto" }}
      >
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight={"medium"}
                gutterBottom
                sx={{ fontSize: { xs: 18, md: 24 } }}
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ fontSize: { xs: 14, md: 16 } }}
              >
                {course.description}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight={"medium"}
                sx={{ fontSize: { xs: 18, md: 24 } }}
                 gutterBottom
              >
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
                    sx={{ lineHeight: {xs:1.6,md:3},
                   fontSize: { xs: 12, md: 16 } 
                  }}
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
                  {course.category}
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
        <Alert severity="warning">Your Payment was cancelled</Alert>
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
