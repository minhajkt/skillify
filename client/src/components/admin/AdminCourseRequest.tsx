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
        console.log("error occured", error);
      } finally {
        setLoading(false);
      }
    };

    getCourseRequests();
  }, []);

  // const fetchLectureDetails = async (courseId: string[]) => {
  //   try {
  //     const { data } = await axiosInstance.get(`/courses/${courseId}/lectures`);
  //     let lecturesArray: Lectures[] = [];
  //     if (Array.isArray(data)) {
  //       lecturesArray = data;
  //     } else if (data.lectures) {
  //       lecturesArray = data.lectures;
  //     } else {
  //       console.error("Unexpected data format:", data);
  //       return;
  //     }
  //     const lectureMap = lecturesArray.reduce(
  //       (acc: { [key: string]: Lectures }, lecture: Lectures) => {
  //         acc[lecture._id] = lecture;
  //         return acc;
  //       },
  //       {}
  //     );

  //     setLectures((prevLectures) => ({
  //       ...prevLectures,
  //       ...lectureMap,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching lecture details:", error);
  //   }
  // };

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
    <Box sx={{ padding: 2, width: "70vw" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Course Requests
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#FAFAFA" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Lectures</TableCell>
              {/* <TableCell>Actions</TableCell> */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No course requests Pending
      </TableCell>
    </TableRow>
  ) :
            (courses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>
                    {tutors[course.createdBy]
                      ? tutors[course.createdBy].name
                      : "Loading..."}
                  </TableCell>
                  <TableCell>
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
                  <TableCell sx={{pl:8}}>{course.lectures?.length}</TableCell>

                  <TableCell>
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
      />
    </Box>
  );
};

export default AdminCourseRequest;
