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
import { axiosInstance } from "../../api/axiosInstance";
import { updateCourseApproval } from "../../api/adminApi";

type Lectures = {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  order: number;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  isApproved: string
};

const AdminCourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<{ [key: string]: Lectures }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourseDetails = async () => {
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
      let lecturesArray: Lectures[] = [];

      if (Array.isArray(data)) {
        lecturesArray = data;
      } else if (data.lectures) {
        lecturesArray = data.lectures;
      } else {
        console.error("Unexpected data format:", data);
        return;
      }

      const lectureMap = lecturesArray.reduce(
        (acc: { [key: string]: Lectures }, lecture: Lectures) => {
          acc[lecture._id] = lecture;
          return acc;
        },
        {}
      );

      setLectures((prevLectures) => ({
        ...prevLectures,
        ...lectureMap,
      }));
    } catch (error) {
      console.error("Error fetching lecture details:", error);
    }
  };
const handleApprove = async (courseId: string) => {
  try {
    const updatedCourse = await updateCourseApproval(courseId, "approved");
    console.log('updatde is ', updatedCourse);
    
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

    const handleReject = async (courseId: string) => {
      try {
        const updatedCourse = await updateCourseApproval(courseId, "rejected");
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
                          {lecture.videoUrl ? (
                            <video
                              src={lecture.videoUrl}
                              controls
                              style={{ maxWidth: "200px" }}
                            />
                          ) : (
                            "No video available"
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
        </>
      ) : (
        <Typography>No course data available.</Typography>
      )}
    </Box>
  );
};

export default AdminCourseDetailsPage;

// import React from "react";
// import { Modal, Box, Typography, Button } from "@mui/material";
// import { Visibility as VisibilityIcon } from "@mui/icons-material";

// type Course = {
//   _id: string;
//   title: string;
//   category: string;
//   tutor: string;
//   status: string;
//   isApproved: string;
//   createdBy: string;
//   lectures: string
// };

// type Tutors = {
//   _id: string;
//   name: string;
// };

// type Lectures = {
//     _id: string
//     title: string
// }

// type CourseDetailModalProps = {
//   open: boolean;
//   onClose: () => void;
//   course: Course | null;
//   tutors: { [key: string]: Tutors } | null;
//   lectures: { [key: string]: Lectures } | null;
// };

// const CourseDetailsModal: React.FC<CourseDetailModalProps> = ({
//   open,
//   onClose,
//   course,
//   tutors,
//   lectures

// }) => {
//   const handleClose = () => {
//     onClose();
//   };
//   console.log('tutttt', tutors);

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 400,
//           bgcolor: "#FAFAFA",
//           border: "2px solid #000",
//           borderRadius: 1,
//           padding: 2,
//           boxShadow: 24,
//           maxHeight: "80vh",
//           overflowY: "auto",
//         }}
//       >
//         {course ? (
//           <div>
//             <Typography variant="h6" sx={{ mb: 1 }}>
//               <span
//                 style={{
//                   color: "black",
//                   fontWeight: "bold",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 Name{" "}
//               </span>
//               : {course.title}
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               <span
//                 style={{
//                   color: "black",
//                   fontWeight: "bold",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 Category{" "}
//               </span>
//               : {course.category}
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               <span
//                 style={{
//                   color: "black",
//                   fontWeight: "bold",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 Tutor{" "}
//               </span>
//               :{" "}
//               {tutors[course.createdBy]
//                 ? tutors[course.createdBy].name
//                 : "Loading..."}
//             </Typography>
//             <Typography variant="body2" sx={{ marginTop: 2 }}>
//               <span
//                 style={{
//                   color: "black",
//                   fontWeight: "bold",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 Lectures{" "}
//               </span>
//               :
//             </Typography>

//             {course.lectures && course.lectures.length > 0 ? (
//               course.lectures.map((lectureId) => (
//                 <Box key={lectureId} sx={{ marginTop: 2 }}>
//                   {/* Check if the lecture exists in the lectures prop */}
//                   {lectures && lectures[lectureId] ? (
//                     <div>
//                       <Typography variant="body2">
//                         <span style={{ fontWeight: "bold" }}>
//                           Lecture Title:{" "}
//                         </span>
//                         {lectures[lectureId].title}
//                       </Typography>
//                       <Typography variant="body2">
//                         <span style={{ fontWeight: "bold" }}>
//                           Lecture Description:{" "}
//                         </span>
//                         {lectures[lectureId].description}
//                       </Typography>
//                       <Typography variant="body2">
//                         <span style={{ fontWeight: "bold" }}>
//                           Lecture Description:{" "}
//                         </span>
//                         {lectures[lectureId].videoUrl ? (
//                           <video src={lectures[lectureId].videoUrl}
//                           style={{maxWidth:"200px"}}
//                           />
//                         ) : (
//                           "No video"
//                         )}
//                       </Typography>
//                       {/* Optionally, display more details (like description) */}
//                       {lectures[lectureId].category && (
//                         <Typography variant="body2">
//                           <span style={{ fontWeight: "bold" }}>
//                             Description:{" "}
//                           </span>
//                           {lectures[lectureId].description}
//                         </Typography>
//                       )}
//                     </div>
//                   ) : (
//                     <Typography variant="body2">
//                       Loading lecture details...
//                     </Typography>
//                   )}
//                 </Box>
//               ))
//             ) : (
//               <Typography variant="body2">
//                 No lectures available for this course.
//               </Typography>
//             )}
//           </div>
//         ) : (
//           <Typography>Loading...</Typography>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default CourseDetailsModal;
