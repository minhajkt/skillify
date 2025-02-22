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
  TablePagination,
  useMediaQuery,

} from "@mui/material";
import { fetchTutorCourses } from "../../api/tutorApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";

const AllCoursePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchTutorCourses()
        
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

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 0, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          mt: "64px",
        }}
      >
        <Navbar />

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: { xs: 500, md: 600 },
            fontSize: { xs: 20, md: 30 },
            color: "#1a237e",
            mb: { xs: 2, md: 4 },
            borderBottom: "3px solid #1a237e",
            pb: { xs: 0, md: 1 },
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
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                px: 4,
                py: 1.5,
              }}
            >
              Create Course
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
                  {!isSmallScreen && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Category
                  </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </TableCell>
                  {!isSmallScreen && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow
                      key={course._id}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f8f9fa",
                          transition: "background-color 0.2s",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ fontWeight: 500 }}
                        onClick={() => {
                          if (isSmallScreen) {
                            handleViewCourse(course._id)
                          }
                        }}
                      >
                        {course.draftVersion?.title || course.title}
                      </TableCell>
                      {!isSmallScreen && (
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            display: "inline-block",
                            color: "#1976d2",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.875rem",
                          }}
                        >
                          {course.draftVersion?.category || course.category}
                        </Typography>
                      </TableCell>
                      )}
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            display: "inline-block",
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
                      {!isSmallScreen && (
                      <TableCell sx={{ textAlign: "center" }}>
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
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {courses.length > 0 && (

          <TablePagination
            component="div"
            count={courses.length}
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
        )}
      </Box>
    </Box>
  );
};

export default AllCoursePage;
