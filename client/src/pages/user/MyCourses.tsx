/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fetchUserEnrolledCourses } from "../../api/enrollmentApi";
import Navbar from "../../components/shared/Navbar";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewModal from "../../components/user/ReviewModal";
import {
  addCourseReview,
  deleteCourseReview,
  fetchUserReview,
  updateCourseReview,
} from "../../api/reviewApi";
import { handleAxiosError } from "../../utils/errorHandler";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ICourseForDisplay } from "../../types/types";
import { getProgress } from "../../api/progressApi";

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<ICourseForDisplay[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<ICourseForDisplay | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [userReview, setUserReview] = useState(null);
  const location = useLocation();
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [deleteSnackbar, setDeleteSnackbar] = useState(false);
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (new URLSearchParams(location.search).get("success") === "true") {
      setShowSuccessSnackbar(true);
    }
  }, [location.search]);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await fetchUserEnrolledCourses();
        setEnrolledCourses(response);

        const progressMap: Record<string, number> = {};
        await Promise.all(
          response.map(async (course:ICourseForDisplay) => {
            try {
            if (!user?._id) return setError("No user id");
              const progress = await getProgress(
                user?._id,
                course.courseId._id
              );
              progressMap[course.courseId._id] = progress?.progressPercentage;
            } catch (error) {
              // setError("An error occured");
            }
          })
        );
        setProgressData(progressMap);
      } catch (error) {
        // setError("An error occured");
      } finally {
        setLoading(false);
      }
    };
    getEnrolledCourses();
  }, []);

  useEffect(() => {
    const getUserReview = async () => {
      if (selectedCourse && userId) {
        try {
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
          setError("Error fetching review:");
        }
      }
    };

    getUserReview();
  }, [selectedCourse, userId]);

  const handleOpenModal = (course: ICourseForDisplay) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourse(null);
    setReviewText("");
    setRating(null);
  };

  const handleSubmitReview = async () => {
    if (rating && reviewText.trim()) {

      if (!selectedCourse) {
        setError("Selected course is not available.");
        return;
      }

      if (!userId) {
        setError("No UserId found");
        return;
      }

      const reviewData = {
        courseId: selectedCourse?.courseId._id,
        rating,
        reviewText,
      };
      try {
        let updatedReview;
        if (userReview) {
          updatedReview = await updateCourseReview(
            selectedCourse.courseId._id,
            userId,
            reviewText,
            rating
          );
          setSnackbarMessage("Review updated successfully!");
          setSnackbar(true);
        } else {
          updatedReview = await addCourseReview(reviewData);
        }
        setSnackbarMessage("Review submitted successfully!");
        setSnackbar(true);
        setUserReview(updatedReview);
        handleCloseModal();
      } catch (error) {
        throw handleAxiosError(error);
      }
    } else {
      setSnackbarMessage(
        "Please provide a rating and review text before submitting."
      );
      setSnackbar(true)
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedCourse) {
      setError("Selected course is not available.");
      return;
    }

    if (!userId) {
      setError("No UserId found");
      return;
    }

    if (userReview) {
      try {
        await deleteCourseReview(selectedCourse?.courseId._id, userId);
        setUserReview(null);
        setReviewText("");
        setRating(null);
        setDeleteSnackbar(true);
        handleCloseModal();
      } catch (error) {
        setError("Error deleting review");
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Box sx={{ width: "100%", height: "100vh" }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </Box>
    );
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box sx={{ width: "100vw" }}>
      <Box sx={{ px: { xs: 0, md: 25 }, mb: 6, width: "70vw", height: "80vh" }}>
        <Box
          sx={{
            width: { xs: "135%", md: "100%" },
            p: { xs: 1, md: 3 },
            mt: { xs: "64px", md: "80px" },
            bgcolor: "#FAFAFA",
          }}
        >
          <Navbar />
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.8rem" },
                mb: { xs: 1, md: 2 },
                fontWeight: "bold",
              }}
            >
              My courses
            </Typography>
          </Box>
          <Stack spacing={2}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((course) => (
                  <Card
                    key={course.courseId._id}
                    sx={{
                      display: "flex",
                      height: { xs: "100px", md: "160px" },
                      "&:hover": {
                        boxShadow:
                          course.courseId.isApproved === "approved" ? 3 : 0,
                      },
                      opacity:
                        course.courseId.isApproved === "approved" ? 1 : 0.6,
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "120px", md: 220 },
                        objectFit: "cover",
                        height: { xs: "100px", md: "auto" },
                        filter:
                          course.courseId.isApproved === "approved"
                            ? "none"
                            : "grayscale(50%)",
                      }}
                      image={course.courseId.thumbnail}
                      alt={course.courseId.title}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        p: { xs: 0.5, md: 2 },
                        justifyContent: "flex-start",
                        pointerEvents:
                          course.courseId.isApproved === "approved"
                            ? "auto"
                            : "none",
                      }}
                    >
                      <CardContent sx={{ flex: "1 0 auto", p: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            component="div"
                            variant="h6"
                            sx={{
                              fontSize: { xs: 12, md: 20 },
                              lineHeight: { xs: 1.2, md: 1.5 },
                            }}
                          >
                            {course.courseId.title}
                          </Typography>
                          <Typography
                            component="div"
                            variant="body1"
                            sx={{ fontSize: { xs: 9, md: 16 } }}
                          >
                            {course.courseId.category}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: 10, md: 14 } }}
                          >
                            Progress: {progressData[course.courseId._id] || 0}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={progressData[course.courseId._id] || 0}
                            sx={{
                              height: { xs: 5, md: 8 },
                              borderRadius: 4,
                              mt: { xs: 0.3, md: 1 },
                            }}
                          />
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: { xs: 0.3, md: 1 } }}
                        >
                          <Person2OutlinedIcon
                            fontSize="small"
                            sx={{ fontSize: { xs: 14, md: 20 } }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: 10, md: 14 } }}
                          >
                            {course.courseId.createdBy.name}
                          </Typography>
                        </Stack>
                      </CardContent>

                      {course.courseId.isApproved !== "approved" ? (
                        <Box
                          sx={{
                            color: "red",
                            px: 0,
                            py: 0.5,
                            borderRadius: 1,
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <InfoOutlinedIcon
                            sx={{
                              color: "red",
                              fontSize: { xs: 10, md: 14 },
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontSize: { xs: 10, md: 14 }, color: "red" }}
                          >
                            This is course is undergoing updates
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            pr: 0,
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              mt: { xs: 0, md: 1 },
                              fontSize: { xs: "0.7rem", md: "0.8rem" },
                              padding: { xs: "2px 4px", md: "3px 9px" },
                              minWidth: { xs: "auto", md: "64px" },
                            }}
                            onClick={() => handleOpenModal(course)}
                          >
                            Review
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              mt: { xs: 0, md: 1 },
                              fontSize: { xs: "0.7rem", md: "0.8rem" },
                              padding: { xs: "2px 4px", md: "3px 9px" },
                              minWidth: { xs: "auto", md: "64px" },
                            }}
                            onClick={() =>
                              navigate(
                                `/users/course-section/${course.courseId._id}`
                              )
                            }
                          >
                            Continue Learning
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Card>
                ))
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  bgcolor: "#f9f9f9",
                  p: 4,
                  borderRadius: "12px",
                  boxShadow: 2,
                  mx: "auto",
                }}
              >
                <img
                  src="/images/00.png"
                  alt="No courses illustration"
                  style={{
                    maxWidth: "20%",
                    height: "auto",
                    marginBottom: "16px",
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  No Enrolled Courses Yet!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 3 }}
                >
                  It looks like you haven't enrolled in any courses. Start
                  exploring our courses to begin your learning journey.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/home")}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Browse Courses
                </Button>
              </Box>
            )}
          </Stack>
          {enrolledCourses.length > 0 ? (
            <TablePagination
              component="div"
              count={enrolledCourses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                ".MuiTablePagination-root": {
                  fontSize: { xs: "0.75rem", md: ".8rem" }, 
                  padding: { xs: "4px", md: "16px" }, 
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-input": {
                  fontSize: { xs: "0.75rem", md: ".85rem" }, 
                },
                ".MuiTablePagination-actions": {
                  transform: { xs: "scale(0.8)", md: "scale(1)" }, 
                },
              }}
            />
          ) : null}
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
        message={snackbarMessage}
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
