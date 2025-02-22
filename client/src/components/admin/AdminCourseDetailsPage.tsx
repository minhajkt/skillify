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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { axiosInstance } from "../../api/axiosInstance";
import { updateCourseApproval, updateCourseBlock, updateCourseEditApproval } from "../../api/adminApi";
import {ICourse , ILectures} from '../../types/types'


const AdminCourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lectures, setLectures] = useState<{ [key: string]: ILectures & { videoLoaded: boolean }}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blockLoad, setBlockLoad] = useState(false)
  const [unblockLoad, setUnblockLoad] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

const [open, setOpen] = useState(false);


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
      if (!course?.draftVersion?.lectures) {
        console.error("Draft version lectures not available");
        return;
      }
      // console.log("available", course?.draftVersion?.lectures);
      const lecture = course.draftVersion.lectures.find(
        (lec) => lec.order === lecture.order
      );
      // console.log("Found lecture:", lecture);

      if (!lecture || !lecture.videoUrl) {
        console.error("Video not found for lecture:", lectureId);
        return;
      }

      setLectures((prevLectures) => {
        // console.log("Previous state before update:", prevLectures);

        return {
          ...prevLectures,
          [lecture._id]: {
            ...lecture, 
            videoLoaded: true,
          },
        };
      });
    } catch (error) {
      console.error("Error loading video:", error);
    }
  };


  // const handleVideoLoad = async (lectureId: string) => {
  //   try {
  //     const { data: lecture } = await axiosInstance.get(
  //       `/lectures/${lectureId}`
  //     );
  //     // console.log("Loaded lecture data:", lecture);

  //     setLectures((prevLectures) => ({
  //       ...prevLectures,
  //       [lecture._id]: {
  //         ...prevLectures[lecture._id],
  //         videoUrl: lecture.videoUrl,
  //         videoLoaded: true,
  //       },
  //     }));
  //   } catch (error) {
  //     console.error("Error loading video:", error);
  //   }
  // };


const handleApprove = async (courseId: string) => {
  try {
    const updatedCourse = await updateCourseApproval(courseId, "approved");
    setSnackbar({
      open: true,
      message: "Course approved successfully!",
    });
    setCourse((prev) => {
      if (prev && prev._id === courseId) {
        return { ...prev, isApproved: "approved" };
      }
      return prev;
    });
  } catch (error) {
    console.error("Failed to approve course request.", error);
  }
};

const handleApproveEdit = async (courseId: string) => {
  try {
    const updatedCourse = await updateCourseEditApproval(courseId, "approved", "approved");
    await fetchCourseDetails()
    setSnackbar({
      open: true,
      message: "Course edit request approved successfully!",
    });
    setCourse((prev) =>
      prev && prev._id === courseId
        ? { ...prev, ...prev.draftVersion, isApproved:"approved",editStatus: "approved", draftVersion: null }
        : prev
    );
  } catch (error) {
    console.error("Failed to approve course edit request.", error);
  }
};

const handleBlockToggle = async (courseId: string, newStatus: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (newStatus === "blocked") {
      setBlockLoad(true);
    } else {
      setUnblockLoad(true);
    }
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
  }finally {
    if (newStatus === "blocked") {
      setBlockLoad(false);
    } else {
      setUnblockLoad(false);
    }
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

    const handleRejectEdit = async (courseId: string) => {
  try {
    const updatedCourse = await updateCourseEditApproval(courseId, "approved", "rejected");
    // console.log("updatde is ", updatedCourse);
    setSnackbar({
      open: true,
      message: "Course edit request rejected!",
    });
    setCourse((prev) =>
      prev && prev._id === courseId
        ? { ...prev, isApproved:"approved", editStatus: "rejected", draftVersion: null }
        : prev
    );
  } catch (error) {
    console.error("Failed to reject course edit request.", error);
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
    <Box sx={{ padding: { xs: 0, md: 2 }, mx: { xs: -3, md: 0 } }}>
      {course ? (
        <>
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 1, md: 3 },
              fontSize: { xs: 18, md: 24 },
              fontWeight: "bold",
              ml: { xs: 1, md: 0 },
            }}
            gutterBottom
          >
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
                  <TableCell>
                    {course.draftVersion?.title || course.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>
                    {course.draftVersion?.category || course.category}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        course.draftVersion?.description || course.description
                      }
                    >
                      <Typography
                        noWrap
                        onClick={() => setOpen(true)}
                        style={{
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {course.draftVersion?.description || course.description}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>
                    ₹ {course.draftVersion?.price || course.price}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{course.isApproved}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ pl: { xs: 1, md: 0 } }} gutterBottom>
              Lectures
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      Order
                    </TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      Description
                    </TableCell>
                    <TableCell>Video</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.draftVersion?.lectures &&
                  Object.values(course.draftVersion.lectures).length > 0
                    ? Object.values(course.draftVersion.lectures).map(
                        (lecture, index) => (
                          <TableRow key={`draft-${index}`}>
                            <TableCell
                              sx={{ display: { xs: "none", md: "table-cell" } }}
                            >
                              {lecture.order}
                            </TableCell>
                            <TableCell>{lecture.title}</TableCell>
                            <TableCell
                              sx={{ display: { xs: "none", md: "table-cell" } }}
                            >
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
                              <video
                                src={lecture.videoUrl}
                                controls
                                style={{ maxWidth: "200px" }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )
                    : Object.values(lectures).map((lecture, index) => (
                        <TableRow key={`final-${index}`}>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            {lecture.order}
                          </TableCell>
                          <TableCell>{lecture.title}</TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
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
                            <video
                              src={lecture.videoUrl}
                              controls
                              style={{ maxWidth: "200px" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Description</DialogTitle>
            <DialogContent>
              {course.draftVersion?.description || course.description}
            </DialogContent>
          </Dialog>

          <Box sx={{ marginTop: 2, ml: { xs: 2, md: 0 } }}>
            {course.isApproved == "pending" && course.editStatus === "null" && (
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

          <Box sx={{ mt: 2, ml: { xs: 2, md: 0 } }}>
            {course.editStatus === "pending" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginRight: 2 }}
                  onClick={() => handleApproveEdit(course._id)}
                >
                  Approve Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRejectEdit(course._id)}
                >
                  Reject Edit
                </Button>
              </>
            )}
          </Box>
          {["approved", "blocked"].includes(course.isApproved) && (
            <Box sx={{ marginTop: 2, ml: { xs: 2, md: 0 } }}>
              <Button
                variant="contained"
                color="error"
                sx={{ marginRight: 2 }}
                onClick={() => handleBlockToggle(course._id, "blocked")}
                disabled={blockLoad || course.isApproved === "blocked"}
              >
                {blockLoad ? <CircularProgress size={20} /> : "Block"}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleBlockToggle(course._id, "approved")}
                disabled={unblockLoad || course.isApproved === "approved"}
              >
                {unblockLoad ? <CircularProgress size={20} /> : "Unblock"}
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
