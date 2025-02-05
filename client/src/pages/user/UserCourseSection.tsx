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
} from "@mui/material";
import { getUserCourseDetails } from "../../api/userApi";
import { useParams } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ReportLectureModal from "../../components/user/ReportLectureModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ILectures, ICourse } from "../../types/types";
import { generateCertificate, getProgress, markLectureCompleted } from "../../api/progressApi";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CircularProgress from "@mui/material/CircularProgress";


const UserCourseSection = () => {
  const [course, setCourse] = useState<ICourse | null>(null);
  const [error, setError] = useState("");
  const [selectedLecture, setSelectedLecture] = useState<ILectures | null>(
    null
  );
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState("You have successfully completed the course. Click on the Get Certificate button to recieve your certificate of completion");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useSelector((state: RootState) => state.auth.user);

  const { courseId } = useParams();

  useEffect(() => {
    const fetchUserCourse = async () => {
      if (!courseId) {
        console.error("Course ID is undefined");
        return;
      }
      try {
        const courseDetails = await getUserCourseDetails(courseId);
        // console.log("usercourse details response is ", courseDetails);
        setCourse(courseDetails);
        setSelectedLecture(courseDetails.lectures[0]);

        const progressDetails = await getProgress(user?._id, courseId)
        console.log('initial fetched progress', progressDetails);
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
    if(selectedLecture) {
      try {
        const updatedProgress = await markLectureCompleted(user?._id, courseId, selectedLecture._id)
        console.log("updated fetched progress", updatedProgress);
        setProgress(updatedProgress);
        const allLecturesCompleted =
          updatedProgress?.completedLecturesDetails.length ===
          course?.lectures.length;
        setCourseCompleted(allLecturesCompleted);
        if (allLecturesCompleted) {
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error marking lecture as completed:", error);
        setError("Failed to update progress");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  const handleGenerateCertificate = async () => {
  try {
    setLoading(true)
    const certificateUrl = await generateCertificate(user?._id, courseId, user?.name, course?.title);
    setProgress({ ...progress, certificateUrl });
  } catch (error) {
    console.error("Error generating certificate:", error);
  }finally {
    setLoading(false)
  }
};

  if (error) return <p>{error}</p>;
  if (!course) return <p>Loading...</p>;

  return (
    <Box>
      <Navbar />
      <Box sx={{ px: 10, py: 5, mt: { xs: "64px", md: "80px" } }}>
        <Stack direction="row" spacing={0}>
          <Box
            sx={{
              bgcolor: "black",
              color: "white",
              py: 2,
              px: 3,
              width: { xs: "70%", md: "72%" },
              textAlign: "center",
            }}
          >
            <Typography variant="h6" fontWeight="semi-bold" textAlign={"left"}>
              {course.title}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#FDFDFD",
              py: 2,
              px: 3,
              flex: 1,
              textAlign: "center",
              borderBottom: "1px solid #AFAFAF",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="semi-bold"
              color="text.primary"
              textAlign={"left"}
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
            sx={{ flex: 1, height: "400px" }}
            controls
            src={selectedLecture?.videoUrl || "default-video-url.mp4"}
            onEnded={handleEnd}
          />
          <Box sx={{ width: "300px", p: 2 }}>
            {course.lectures && course.lectures.length > 0 ? (
              course.lectures.map((lecture, index) => {
                const isCompleted =
                  progress?.completedLecturesDetails?.includes(lecture._id);
                const isLocked =
                  index > 0 &&
                  !progress?.completedLecturesDetails?.includes(
                    course.lectures[index - 1]._id
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
                      <Typography sx={{ flex: 1, textAlign: "left" }}>
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
        <Typography>
          {progress?.completed && !progress?.certificateUrl ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateCertificate}
              disabled={loading}
            >
              {loading? <CircularProgress size={24}/> :  "Get Certificate"}
            </Button>
          ) : progress?.certificateUrl ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (progress?.certificateUrl) {
                  window.open(progress.certificateUrl, "_blank");
                }
              }}
            >
              Download Certificate
            </Button>
          ) : null}
        </Typography>
        <Box>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Overview" />
            {/* <Tab label="Chat" /> */}
          </Tabs>

          {tab === 0 && (
            <Box sx={{ mt: 2, width: "60%" }}>
              <Typography variant="h5">{selectedLecture?.title}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                <LanguageOutlinedIcon fontSize="small" />
                <Typography sx={{ marginLeft: 1 }}>English</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ lineHeight: 2.5 }}
              >
                {selectedLecture?.description}
              </Typography>
            </Box>
          )}
          {/* {tab === 1 && (
            <Box sx={{ mt: 2, width: "60%" }}>
              <Typography variant="h5">Chat</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  lineHeight: 2.5,
                  lineBreak: "auto",
                  visibility: "hidden",
                }}
              >
                This is your chat section. You can now connect with your tutor
                from here and clear all your doubts This is your chat section.
                You can now connect with your tutor from here and clear all your
                doubts
              </Typography>
            </Box>
          )} */}
        </Box>
        <Button
          variant="contained"
          color="warning"
          sx={{ mb: 2 }}
          onClick={() => setReportModalOpen(true)}
        >
          Report an Issue
        </Button>

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
        autoHideDuration={600000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#4caf50",
            color: "white",
            width: "50%",
            height: "100px",
            fontSize: "20px",
            borderRadius: "8px",
            padding: "20px",
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
