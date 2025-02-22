import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchCourseRequests, fetchTutors } from "../../api/adminApi";
// import { axiosInstance } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {ICourse, ILectures, ITutor} from '../../types/types'



const AdminCourseRequest = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [tutors, setTutors] = useState<{ [key: string]: ITutor }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lectures, setLectures] = useState<{ [key: string]: ILectures }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate(); 
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  useEffect(() => {
    const getCourseRequests = async () => {
      setLoading(true);
      try {
        const fetchedCourse = await fetchCourseRequests();
        // console.log('fffffffffffffffffffffffffffffff', fetchedCourse);
        
        setCourses(fetchedCourse);

        const fetchedTutors = await fetchTutors();
        const tutorsById: { [key: string]: ITutor } = {};

        fetchedTutors.forEach((tutor: ITutor) => {
          tutorsById[tutor._id] = tutor;
        });

        setTutors(tutorsById);
      } catch (error) {
        setError("Failed to fetch tutor requests.");
      } finally {
        setLoading(false);
      }
    };

    getCourseRequests();
  }, []);


  const handleOpenModal = (course: ICourse) => {
    navigate(`/admin/course-details/${course._id}`);
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: { xs: 0, md: 2 }, width: { xs: "108%", md: "70vw" } }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: { xs: 1, md: 3 },
          fontSize: { xs: 18, md: 24 },
          fontWeight: "bold",
          ml: { xs: -2.2, md: 0 },
        }}
      >
        Course Requests
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ bgcolor: "#FAFAFA", ml: { xs: -2.2, md: 0 } }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Status
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Total Lectures
              </TableCell>
              {/* <TableCell>Actions</TableCell> */}
              <TableCell
                sx={{ display: { xs: "none", md: "table-cell" } }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No course requests Pending
                </TableCell>
              </TableRow>
            ) : (
              courses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((course) => (
                  <TableRow
                    key={course._id}
                    onClick={
                      isSmallScreen ? () => handleOpenModal(course) : undefined
                    }
                  >
                    <TableCell>
                      {course.draftVersion?.title || course.title}
                    </TableCell>
                    <TableCell>
                      {course.draftVersion?.category || course.category}
                    </TableCell>
                    <TableCell>
                      {course.draftVersion?.price || course.price}
                    </TableCell>
                    <TableCell>
                      {tutors[course.createdBy]
                        ? tutors[course.createdBy].name
                        : "Loading..."}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <span
                        style={{
                          color:
                            course.isApproved === "approved"
                              ? "green"
                              : course.isApproved === "rejected"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {course.isApproved === "approved"
                          ? "Approved"
                          : course.isApproved === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={{ pl: 8, display: { xs: "none", md: "table-cell" } }}
                    >
                      {course.lectures?.length}
                    </TableCell>

                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenModal(course)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};

export default AdminCourseRequest;
