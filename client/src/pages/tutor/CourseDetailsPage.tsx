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
} from "@mui/material";
import { fetchTutorCourseDetails } from "../../api/tutorApi";
import Navbar from "../../components/shared/Navbar";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetchTutorCourseDetails(courseId);
        console.log("lecture dataa length", response?.data.lectures.length);

        if (response?.data) {
          setCourse(response.data);
          setLectures(response?.data?.lectures || []);
        }
      } catch (error) {
        setError("Failed to fetch course details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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
    <Box
      sx={{
        mt: { xs: "64px", md: "80px" },
      }}
    >
      <Navbar />
      {/* <Typography variant="h4">{course.title}</Typography>
      <Typography variant="h6">Category: {course.category}</Typography>
      <Typography>Description: {course.description}</Typography>
      <Typography>Price: ${course.price}</Typography>
      <Typography>Status: {course.isActive ? "Active" : "Inactive"}</Typography> */}

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Course Details</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Information</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>{course.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>
                <img
                  src={course.thumbnail}
                  style={{ height: "150px", width: "250px" }}
                />
              </TableCell>
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
            <TableRow>
              <TableCell>Lectures Count</TableCell>
              <TableCell>{lectures.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lectures:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Order</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Title</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Duration</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Video</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    No lectures found for this course.
                  </TableCell>
                </TableRow>
              ) : (
                lectures.map((lecture: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{lecture.order}</TableCell>
                    <TableCell>{lecture.title}</TableCell>{" "}
                    <TableCell>
                      {" "}
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
                    <TableCell>{lecture.duration}</TableCell>
                    <TableCell>
                      {lecture.videoUrl ? (
                        <video
                          src={lecture.videoUrl}
                          controls
                          style={{ maxWidth: "200px" }}
                        />
                      ) : (
                        "NO video available"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Edit Course
      </Button>
    </Box>
  );
};

export default CourseDetailsPage;
