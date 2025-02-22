/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardMedia,
  Button,
  Divider,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { getUserCourseDetails } from "../../api/userApi";
import { useParams } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ReportLectureModal from "../../components/user/ReportLectureModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ILectures, ICourse, IProgress } from "../../types/types";
import { generateCertificate, getProgress, markLectureCompleted } from "../../api/progressApi";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosInstance } from "../../api/axiosInstance";


const UserCourseSection = () => {
  const [course, setCourse] = useState<ICourse | null>(null);
  const [error, setError] = useState("");
  const [selectedLecture, setSelectedLecture] = useState<ILectures | null>(
    null
  );
  const [progress, setProgress] = useState<IProgress | null>(null); 
  const [loading, setLoading] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState("You have successfully completed the course. Click on the Get Certificate button to recieve your certificate of completion");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token)
  

  const { courseId } = useParams();

  useEffect(() => {
    const fetchUserCourse = async () => {
      if (!courseId) {
        console.error("Course ID is undefined");
        return;
      }
      if (!user?._id) {
        console.error("User ID is undefined");
        return;
      }
      try {
        const courseDetails = await getUserCourseDetails(courseId);
        setCourse(courseDetails);
        setSelectedLecture(courseDetails.lectures[0]);

        const progressDetails = await getProgress(user?._id, courseId)
        setProgress(progressDetails);
        const allLecturesCompleted = progressDetails?.completedLecturesDetails.length === courseDetails.lectures.length;
        setCourseCompleted(allLecturesCompleted)
      } catch (error) {
        setError((error as Error).message || "An unexpected error occurred");
      }
    };
    if (courseId) {
      fetchUserCourse();
    } else {
      setError("Course ID is missing");
    }
  }, [courseId]);

  const handleLectureSelect = (lecture: ILectures) => {
    setSelectedLecture(lecture);
  };

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleEnd = async() => {
    if(!user?._id) return setError("User ID is missing");
    if (!courseId) return setError("Course Id is missing");
    
    if(selectedLecture) {
      try {
        const updatedProgress = await markLectureCompleted(user?._id, courseId, selectedLecture._id)
        setProgress(updatedProgress);
        const allLecturesCompleted =
          updatedProgress?.completedLecturesDetails.length ===
          course?.lectures?.length;
        setCourseCompleted(allLecturesCompleted);
        if (allLecturesCompleted) {
          setOpenSnackbar(true);
        }
      } catch (error) {
        setError("Failed to update progress");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  const handleGenerateCertificate = async () => {
  try {
    if (!user?._id) return setError("User ID is missing");
    if (!courseId) return setError("Course Id is missing");
    if (!course?.title) return setError("Course title is missing");

    setLoading(true);
    const certificateId = await generateCertificate(user?._id, courseId, user?.name, course?.title);
    setProgress({
      ...progress,certificateId,}); 
  } catch (error) {
    console.error("Error generating certificate:", error);
  } finally {
    setLoading(false);
  }
};



const handleDownloadCertificate = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get("/progress/download-certificate", {
      params: { certificateId: progress?.certificateId },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    setError("Error downloading certificate");
  } finally {
    setLoading(false);
  }
};

  if (!course) return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Skeleton variant="rectangular" width="100%" height={400} />
      <Skeleton width="60%" />
      <Skeleton width="80%" />
    </Box>
  );

  


 return (
   <Box>
     <Navbar />
     <Box
       sx={{
         px: { xs: 0, sm: 5, md: 10 },
         py: 5,
         mt: { xs: "20px", md: "42px" },
       }}
     >
       <Stack direction={{ xs: "column", sm: "row" }} spacing={0}>
         <Box
           sx={{
             bgcolor: "black",
             color: "white",
             py: { xs: 1, md: 2 },
             px: { xs: 1, md: 3 },
             width: { xs: "100%", sm: "70%", md: "72%" },
             textAlign: "center",
           }}
         >
           <Typography
             variant="h6"
             fontWeight="semi-bold"
             textAlign="left"
             sx={{ fontSize: { xs: 16, md: 20 } }}
           >
             {course.title}
           </Typography>
         </Box>

         <Box
           sx={{
             bgcolor: "#FDFDFD",
             display: { xs: "none", md: "block" },
             py: { xs: 1, md: 2 },
             px: { xs: 1, md: 3 },
             flex: 1,
             textAlign: "center",
             borderBottom: "1px solid #AFAFAF",
             width: { xs: "100%", sm: "auto" },
           }}
         >
           <Typography
             variant="h6"
             fontWeight="semi-bold"
             color="text.primary"
             textAlign="left"
             sx={{ fontSize: { xs: 16, md: 20 } }}
           >
             Course Content
           </Typography>
         </Box>
       </Stack>

       <Card
         sx={{
           display: "flex",
           flexDirection: { xs: "column", md: "row" },
           mb: 3,
         }}
       >
         <CardMedia
           component="video"
           sx={{
             flex: 1,
             height: { xs: "250px", sm: "300px", md: "400px" },
           }}
           controls
           src={selectedLecture?.videoUrl || "default-video-url.mp4"}
           onEnded={handleEnd}
         />
         <Box
           sx={{
             bgcolor: "#FDFDFD",
             display: { xs: "block", md: "none" },
             py: { xs: 1, md: 2 },
             px: { xs: 1, md: 3 },
             flex: 1,
             textAlign: "center",
             borderBottom: "1px solid #AFAFAF",
             width: { xs: "100%", sm: "auto" },
           }}
         >
           <Typography
             variant="h6"
             fontWeight="semi-bold"
             color="text.primary"
             textAlign="left"
             sx={{ fontSize: { xs: 16, md: 20 }, pl: 1 }}
           >
             Course Content
           </Typography>
         </Box>
         <Box
           sx={{
             width: { xs: "100%", md: "300px" },
             p: { md: 2 },
           }}
         >
           {course.lectures && course.lectures.length > 0 ? (
             course.lectures.map((lecture, index) => {
               const isCompleted = progress?.completedLecturesDetails?.includes(
                 lecture._id
               );
               const isLocked =
                 index > 0 &&
                 course?.lectures?.[index - 1] &&
                 !progress?.completedLecturesDetails?.includes(
                   course?.lectures?.[index - 1]._id
                 );
               return (
                 <Button
                   key={lecture._id}
                   onClick={() => handleLectureSelect(lecture)}
                   disabled={isLocked}
                   sx={{
                     justifyContent: "flex-start",
                     width: "100%",
                     textTransform: "none",
                     color: "black",
                     borderBottom: "1px solid #AFAFAF",
                     padding: "8px 12px",
                   }}
                 >
                   <Box
                     sx={{
                       display: "flex",
                       alignItems: "center",
                       gap: 1,
                       width: "100%",
                     }}
                   >
                     {isCompleted ? (
                       <CheckBoxIcon fontSize="small" color="success" />
                     ) : (
                       <CheckBoxOutlineBlankIcon />
                     )}
                     <Typography
                       sx={{
                         flex: 1,
                         textAlign: "left",
                         fontSize: { xs: "14px", sm: "16px" },
                       }}
                     >
                       {lecture.title}
                     </Typography>
                   </Box>
                 </Button>
               );
             })
           ) : (
             <Typography>No lecture found</Typography>
           )}
         </Box>
       </Card>

       <Box sx={{ mb: { md: 3 } }}>
         <Typography>
           {progress?.completed && !progress?.certificateId ? (
             <Button
               variant="contained"
               color="primary"
               onClick={handleGenerateCertificate}
               disabled={loading}
               sx={{ width: { xs: "100%", sm: "auto" } }}
             >
               {loading ? <CircularProgress size={24} /> : "Get Certificate"}
             </Button>
           ) : progress?.certificateId ? (
             <Button
               variant="contained"
               color="success"
               onClick={handleDownloadCertificate}
               sx={{ width: { xs: "100%", sm: "auto" } }}
             >
               {loading ? (
                 <CircularProgress size={24} />
               ) : (
                 "Download Certificate"
               )}
             </Button>
           ) : null}
         </Typography>
       </Box>

       <Box>
         <Tabs
           value={tab}
           onChange={handleTabChange}
           sx={{
             "& .MuiTab-root": {
               fontSize: { xs: "14px", sm: "16px" },
             },
           }}
         >
           <Tab label="Overview" />
         </Tabs>

         {tab === 0 && (
           <Box
             sx={{
               mt: 2,
               width: { xs: "100%", sm: "80%", md: "60%" },
             }}
           >
             <Typography
               variant="h5"
               sx={{
                 fontSize: { xs: "1.1rem", sm: "1.5rem" },
                 pl: { xs: 1, md: 0 },
               }}
             >
               {selectedLecture?.title}
             </Typography>
             <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
               <LanguageOutlinedIcon
                 fontSize="small"
                 sx={{ pl: { xs: 1, md: 0 } }}
               />
               <Typography
                 sx={{ marginLeft: 1, fontSize: { xs: "14px", sm: "16px" } }}
               >
                 English
               </Typography>
             </Box>
             <Divider sx={{ my: 2 }} />
             <Typography
               variant="body2"
               color="textSecondary"
               sx={{
                 lineHeight: 2,
                 fontSize: { xs: "14px", sm: "16px" },
                 pl: { xs: 1, md: 0 },
               }}
             >
               {selectedLecture?.description}
             </Typography>
           </Box>
         )}
       </Box>

       {courseId && selectedLecture?._id && (
         <ReportLectureModal
           open={reportModalOpen}
           onClose={() => setReportModalOpen(false)}
           courseId={courseId}
           lectureId={selectedLecture?._id}
         />
       )}
     </Box>

     <Snackbar
       open={openSnackbar}
       autoHideDuration={60000}
       onClose={handleCloseSnackbar}
       anchorOrigin={{ vertical: "top", horizontal: "center" }}
       sx={{
         "& .MuiSnackbarContent-root": {
           backgroundColor: "#4caf50",
           color: "white",
           width: { xs: "90%", sm: "70%", md: "50%" },
           height: { xs: "80px", md: "100px" },
           fontSize: { xs: "16px", md: "20px" },
           borderRadius: "8px",
           padding: { xs: "15px", md: "20px" },
         },
       }}
     >
       <Alert
         onClose={handleCloseSnackbar}
         severity="success"
         sx={{ width: "100%" }}
       >
         {snackbarMessage}
       </Alert>
     </Snackbar>
   </Box>
 );
};

export default UserCourseSection;
