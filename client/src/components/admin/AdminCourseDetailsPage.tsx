import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { axiosInstance } from "../../api/axiosInstance";
import { updateCourseApproval, updateCourseBlock } from "../../api/adminApi";
import {ICourse , ILectures} from '../../types/types'


const AdminCourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lectures, setLectures] = useState<{ [key: string]: ILectures & { videoLoaded: boolean }}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const fetchCourseDetails = async () => {
    if (!courseId) {
      setError("Course ID is missing");
      return;
    }
    try {
      const response = await axiosInstance.get(`tutor/courses/${courseId}`);
      setCourse(response.data);
      fetchLectureDetails(courseId); 
    } catch (error) {
      setError("Failed to fetch course details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLectureDetails = async (courseId: string) => {
    try {
      const { data } = await axiosInstance.get(`/courses/${courseId}/lectures`);
      let lecturesArray: ILectures[] = [];

      if (Array.isArray(data)) {
        lecturesArray = data;
      } else if (data.lectures) {
        lecturesArray = data.lectures;
      } else {
        console.error("Unexpected data format:", data);
        return;
      }

      const lectureMap = lecturesArray.reduce(
        (acc: { [key: string]: ILectures & { videoLoaded: boolean }}, lecture: ILectures) => {
          acc[lecture._id] = { ...lecture, videoLoaded: false };
          return acc;
        },
        {}
      );

      setLectures(lectureMap);
    } catch (error) {
      console.error("Error fetching lecture details:", error);
    }
  };

  const handleVideoLoad = async (lectureId: string) => {
    try {
      const { data: lecture } = await axiosInstance.get(
        `/lectures/${lectureId}`
      );
      // console.log("Loaded lecture data:", lecture);

      setLectures((prevLectures) => ({
        ...prevLectures,
        [lecture._id]: {
          ...prevLectures[lecture._id],
          videoUrl: lecture.videoUrl,
          videoLoaded: true,
        },
      }));
    } catch (error) {
      console.error("Error loading video:", error);
    }
  };


const handleApprove = async (courseId: string) => {
  try {
    const updatedCourse = await updateCourseApproval(courseId, "approved");
    console.log('updatde is ', updatedCourse);
    setSnackbar({
      open: true,
      message: "Course approved successfully!",
    });
    setCourse((prev) => {
        console.log("Previous course state:", prev);  
      if (prev && prev._id === courseId) {
            console.log('Updating course:', { ...prev, isApproved: "approved" });
        return { ...prev, isApproved: "approved" };
      }
      return prev;
    });
  } catch (error) {
    console.error("Failed to approve course request.", error);
  }
};
const handleBlockToggle = async (courseId: string, newStatus: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedCourse = await updateCourseBlock(courseId, newStatus);
    setSnackbar({
      open: true,
      message: `Course ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully!`,
    });
    setCourse((prev) =>
      prev && prev._id === courseId ? { ...prev, isApproved: newStatus } : prev
    );
  } catch (error) {
    console.error(
      `Failed to ${newStatus === "blocked" ? "block" : "unblock"} the course.`,
      error
    );
  }
};
    const handleReject = async (courseId: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedCourse = await updateCourseApproval(courseId, "rejected");
        setSnackbar({
          open: true,
          message: "Course rejected successfully!",
        });
    setCourse((prev) => {
        // console.log("Previous course state:", prev);  
      if (prev && prev._id === courseId) {
            // console.log('Updating course:', { ...prev, isApproved: "rejected" });
        return { ...prev, isApproved: "rejected" };
      }
      return prev;
    });
      } catch (error) {
        console.error("Failed to reject course request.", error);
      }
    };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      {course ? (
        <>
          <Typography variant="h4" gutterBottom>
            Course Details
          </Typography>

          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>{course.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>{course.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>
                    <Tooltip title={course.description}>
                      <Typography
                        noWrap
                        style={{
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {course.description}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>₹ {course.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{course.isApproved}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" gutterBottom>
              Lectures
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Video</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(lectures).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        No lectures found for this course.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Object.values(lectures).map((lecture, index) => (
                      <TableRow key={index}>
                        <TableCell>{lecture.order}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                        <TableCell>
                          <Tooltip title={lecture.description}>
                            <Typography
                              noWrap
                              style={{
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {lecture.description}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {lecture.videoLoaded ? (
                            <video
                              src={lecture.videoUrl}
                              controls
                              style={{ maxWidth: "200px" }}
                            />
                          ) : (
                            <button
                              onClick={() => handleVideoLoad(lecture._id)}
                            >
                              Load Video
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            {course.isApproved === "pending" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginRight: 2 }}
                  onClick={() => handleApprove(course._id)}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleReject(course._id)}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
          {["approved", "blocked"].includes(course.isApproved) && (
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ marginRight: 2 }}
                onClick={() => handleBlockToggle(course._id, "blocked")}
                disabled={course.isApproved === "blocked"}
              >
                Block
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleBlockToggle(course._id, "approved")}
                disabled={course.isApproved === "approved"}
              >
                Unblock
              </Button>
            </Box>
          )}
          <Snackbar
            open={snackbar.open}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            autoHideDuration={3000}
            message={snackbar.message}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        </>
      ) : (
        <Typography>No course data available.</Typography>
      )}
    </Box>
  );
};

export default AdminCourseDetailsPage;
