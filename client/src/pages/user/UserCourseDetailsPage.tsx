import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  Stack,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";


import { useEffect, useState } from "react";
import { fetchCourseDetails } from "../../api/courseApi";
import { useParams } from "react-router-dom";
import { getTutorById } from "../../api/userApi";
import Navbar from "../../components/shared/Navbar";
import { getLecturesByCourseId } from "../../api/lectureApi";
import { AccessTime, ExpandMore, PlayCircleOutline } from "@mui/icons-material";

const UserCourseDetailsPage = () => {
  const [course, setCourse] = useState("");
  const { courseId } = useParams();
  const [tutor, setTutor] = useState('')
  const [lectures, setLectures] = useState([])
  const [totalHours, setTotalHours] = useState('')

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        console.log(data);
        
        // const tutorIds
        setCourse(data);

        const tutorData = await getTutorById(data.createdBy)
        // console.log(tutorData.user);
        setTutor(tutorData.user)

        const lectureData = await getLecturesByCourseId(courseId)
        // console.log('lect deatials ', lectures);
        setLectures(lectureData.lectures)
        console.log("lecturedta.lectures", lectureData.lectures);
        const totalDuration = lectureData.lectures.reduce(
          (sum, lecture) => sum + lecture.duration,
          0
        );
        setTotalHours((totalDuration / 60).toFixed(1))
        // console.log("Total Duration:", totalHours);
        
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    getCourseDetails();
  }, [courseId]);

  if (!course) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        width: "100vw",
        py: 4,
        // pr: 0,
      }}
    >
      <Navbar />
      {/* Hero Section */}

      <Box
        sx={{
          bgcolor: "#1a1a1a",
          color: "white",
          pb: 6,
          mb: 4,
          mt: { xs: "64px", md: "80px" },
        }}
      >
        <Grid container spacing={4} maxWidth="lg" mx="auto">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={"bold"}
              gutterBottom
            >
              {course.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {course.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
              {/* <Rating value={4} readOnly precision={0.5} />
              <Typography variant="body2">(1,691 ratings)</Typography> */}
            </Box>
            <Typography variant="body2">
              Course Created by: {tutor.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
              <LanguageOutlinedIcon fontSize="small" />
              <Typography sx={{ marginLeft: 1 }}>English</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4} maxWidth="lg" mx="auto">
        {/* Left Column - Course Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={"medium"} gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {course.description}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={"medium"} gutterBottom>
                Course Content
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {lectures.length} lectures
              </Typography>
              <Box sx={{display:"flex", alignItems:"center", gap:1.5}}>
                <AccessTimeOutlinedIcon fontSize="small" sx={{mb:2}}/>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {totalHours} Hours
              </Typography>
              </Box>
              {lectures?.map((lecture, index) => (
                <Typography key={lecture._id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ lineHeight: 3 }}
                  >
                    <DoneAllIcon />
                    {lecture.title}
                  </Box>
                </Typography>
                // <Accordion key={lecture._id}>
                //   <AccordionSummary expandIcon={<ExpandMore />}>
                //     <Stack
                //       direction="row"
                //       spacing={2}
                //       alignItems="center"
                //       width="100%"
                //     >
                //       <Typography variant="subtitle1">
                //         {index + 1}. {lecture.title}
                //       </Typography>
                //       <Typography
                //         variant="body2"
                //         color="text.secondary"
                //         sx={{ ml: "auto" }}
                //       >
                //         <AccessTime
                //           sx={{
                //             fontSize: 16,
                //             verticalAlign: "middle",
                //             mr: 0.5,
                //           }}
                //         />
                //         {lecture.duration} min
                //       </Typography>
                //     </Stack>
                //   </AccordionSummary>
                //   <AccordionDetails>
                //     <Typography
                //       variant="body2"
                //       color="text.secondary"
                //       paragraph
                //     >
                //       {lecture.description}
                //     </Typography>
                //     {lecture.videoUrl && (
                //       <Button
                //         startIcon={<PlayCircleOutline />}
                //         variant="outlined"
                //         size="small"
                //       >
                //         Watch Preview
                //       </Button>
                //     )}
                //   </AccordionDetails>
                // </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Course Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 24 }}>
            <CardContent>
              <Box sx={{ width: "100%", height: 200, mb: 2 }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Typography sx={{ fontWeight: "medium", lineHeight: 2 }}>
                {course.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "regular", lineHeight: 2 }}>
                  {course.rating}
                  {5}
                </Typography>
                <Chip label={course.category} variant="outlined" sx={{fontSize:"12px"}}/>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                  ₹ {course.price}
                </Typography>
                <Chip
                  label={`${course.lectures?.length || 0} lectures`}
                  variant="outlined"
                  sx={{fontSize:"12px"}}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb:1
                }}
              >
                <Typography sx={{ fontSize: "14px", lineHeight: 2 }}>
                  Created By :{" "}
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {" "}
                    {tutor.name}
                  </span>
                </Typography>
                <Chip label="English" variant="outlined" sx={{fontSize:"12px"}}/>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1a1a1a",
                  "&:hover": { bgcolor: "#333" },
                  py: 1.5,
                  mb: 0,
                }}
              >
                ENROLL NOW
              </Button>
              {/* <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={course.category} variant="outlined" />
                <Chip
                  label={`${course.lectures?.length || 0} lectures`}
                  variant="outlined"
                />
                <Chip label="English" variant="outlined" />
              </Stack> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserCourseDetailsPage;
