import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
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
          setError("Failed to fetch courses.");
        }
      } catch (error) {
        setError("Failed to fetch courses.");
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
    <Box>
      <Navbar />
      <Typography variant="h4" color="initial" gutterBottom>
        Your Courses
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : courses.length === 0 ? (
        <Typography>No courses found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    {course.isApproved}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleViewCourse(course._id)}>
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
