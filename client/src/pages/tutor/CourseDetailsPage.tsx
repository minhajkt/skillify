/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Paper,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import { fetchTutorCourseDetails } from "../../api/tutorApi";
import Navbar from "../../components/shared/Navbar";
import { getComplaints } from "../../api/courseApi";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


const [open, setOpen] = useState(false);
  const navigate = useNavigate()


    useEffect(() => {
      const getReports = async () => {
        try {
          await getComplaints(); 
        } catch (error) {
          setError("Error occurred");
        }
      };
  
      getReports();
    }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if(!courseId) {
        setError('Course id is missing')
        setLoading(false)
        return
      }
      try {
        const response = await fetchTutorCourseDetails(courseId);

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
        px: { xs: 0, md: 46 },
        py: 3,
        backgroundColor: "#f8fafc",
      }}
    >
      <Navbar />

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#334155" }}
                >
                  Course Details
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#334155" }}
                >
                  Information
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, width: "200px" }}>
                Title
              </TableCell>
              <TableCell>
                {course.draftVersion?.title || course.title}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Thumbnail</TableCell>
              <TableCell>
                <img
                  src={course.draftVersion?.thumbnail || course.thumbnail}
                  style={{
                    height: "150px",
                    width: "250px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Category</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    display: "inline-block",
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  {course.draftVersion?.category || course.category}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Description</TableCell>
              <TableCell>
                <Tooltip title={course.description}>
                  <Typography
                    noWrap
                    onClick={() => setOpen(true)}
                    style={{
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    }}
                  >
                    {course.draftVersion?.description || course.description}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Price</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#047857",
                  }}
                >
                  ₹ {course.draftVersion?.price || course.price}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Status</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    display: "inline-block",
                    backgroundColor:
                      course.isApproved === "approved" ? "#dcfce7" : "#fff1f2",
                    color:
                      course.isApproved === "approved" ? "#166534" : "#be123c",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  {course.isApproved}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Lectures Count</TableCell>
              <TableCell>
                <Typography
                  sx={{
                    display: "inline-block",
                    backgroundColor: "#f1f5f9",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  {lectures.length}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          {course.draftVersion?.description || course.description}
        </DialogContent>
      </Dialog>

      <Box sx={{ marginTop: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#334155",
            borderBottom: "2px solid #cbd5e1",
            pb: 1,
            mb: 3,
            pl:{xs:1,md:0},
            
          }}
        >
          Lectures:
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#334155" }}
                  >
                    {!isSmallScreen? 'Order' : 'S'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#334155" }}
                  >
                    Title
                  </Typography>
                </TableCell>
                {!isSmallScreen && (
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#334155" }}
                  >
                    Description
                  </Typography>
                </TableCell>
                )}
                {!isSmallScreen && (
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#334155" }}
                  >
                    Duration
                  </Typography>
                </TableCell>
                )}
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#334155" }}
                  >
                    Video
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectures.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "#64748b",
                    }}
                  >
                    No lectures found for this course.
                  </TableCell>
                </TableRow>
              ) : course.draftVersion?.lectures &&
                course.draftVersion.lectures.length > 0 ? (
                course.draftVersion.lectures.map(
                  (lecture: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      }}
                    >
                      <TableCell>{lecture.order}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {lecture.title}
                      </TableCell>
                      {!isSmallScreen && (
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
                      )}
                      {!isSmallScreen && (
                      <TableCell>
                        <Typography
                          sx={{
                            display: "inline-block",
                            backgroundColor: "#f1f5f9",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.875rem",
                          }}
                        >
                          {lecture.duration}
                        </Typography>
                      </TableCell>
                      )}
                      <TableCell>
                        {lecture.videoUrl ? (
                          <video
                            src={lecture.videoUrl}
                            controls
                            style={{
                              maxWidth: "200px",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.875rem",
                              fontStyle: "italic",
                            }}
                          >
                            No video available
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                lectures.map((lecture: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <TableCell>{lecture.order}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {lecture.title}
                    </TableCell>
                    {!isSmallScreen && (
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
                    )} 
                    {!isSmallScreen && (
                    <TableCell>
                      <Typography
                        sx={{
                          display: "inline-block",
                          backgroundColor: "#f1f5f9",
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.875rem",
                        }}
                      >
                        {lecture.duration}
                      </Typography>
                    </TableCell>
                    )}
                    <TableCell>
                      {lecture.videoUrl ? (
                        <video
                          src={lecture.videoUrl}
                          controls
                          style={{
                            maxWidth: "200px",
                            borderRadius: "8px",
                          }}
                          
                        />
                      ) : (
                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "0.875rem",
                            fontStyle: "italic",
                          }}
                        >
                          No video available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {course.isApproved !== "pending" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/tutor/edit-course/${courseId}`)}
          sx={{
            marginTop: 1,
            ml:{xs:1,md:0}
          }}
        >
          Edit Course
        </Button>
      )}
    </Box>
  );
};

export default CourseDetailsPage;
