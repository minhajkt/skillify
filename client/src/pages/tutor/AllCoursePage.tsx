import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,

} from "@mui/material";
import { fetchTutorCourses } from "../../api/tutorApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";

const AllCoursePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchTutorCourses()
        console.log('response iss ', response);
        
    if (Array.isArray(response) || response.length > 0) {
      setCourses(Object.values(response));
        } else {
          setError("No courses are created.");
        }
      } catch (error) {
        // setError("You have no active courses");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourse = (courseId: string) => {
    navigate(`/tutors/courses/${courseId}`)
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f5f7fa",
        minWidth: "80vw",
        mx: 15,
      }}
    >
      <Navbar />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "#1a237e",
          mb: 4,
          borderBottom: "3px solid #1a237e",
          pb: 1,
          display: "inline-block",
        }}
      >
        Your Courses
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          color="error"
          sx={{
            p: 2,
            bgcolor: "#ffebee",
            borderRadius: 1,
          }}
        >
          {error}
        </Typography>
      ) : courses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            bgcolor: "#f9f9f9",
            p: 4,
            borderRadius: "12px",
            boxShadow: 2,

            // maxWidth: 500,
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
            No Courses Created Yet!
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            It looks like you haven't created any courses. Start creating
            courses to begin your teaching journey with us.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/tutors/create-course")}
            sx={{
              // background: "linear-gradient(45deg, #6a11cb, #2575fc)",
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
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course._id}
                  sx={{
                    "&:hover": {
                      bgcolor: "#f8f9fa",
                      transition: "background-color 0.2s",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{course.title}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        display: "inline-block",
                        // bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {course.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        display: "inline-block",
                        // bgcolor: course.isApproved ? "#e8f5e9" : "#fff3e0",
                        color:
                          course.isApproved === "approved"
                            ? "#2e7d32"
                            : "#ed6c02",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {course.isApproved}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewCourse(course._id)}
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      View Course
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllCoursePage;
