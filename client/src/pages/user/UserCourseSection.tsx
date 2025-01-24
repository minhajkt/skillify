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
} from "@mui/material";
import { getUserCourseDetails } from "../../api/userApi";
import { useParams } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ReportLectureModal from "../../components/user/ReportLectureModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ILectures, ICourse } from "../../types/types"; 

const UserCourseSection = () => {
  const [course, setCourse] = useState<ICourse |null>(null);
  const [error, setError] = useState("");
  const [selectedLecture, setSelectedLecture] = useState<ILectures | null>(null);
const [reportModalOpen, setReportModalOpen] = useState(false);
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
        console.log("usercourse details response is ", courseDetails);
        setCourse(courseDetails);
        setSelectedLecture(courseDetails.lectures[0]);
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
          />
          <Box sx={{ width: "300px", p: 2 }}>
            {course.lectures && course.lectures.length > 0 ? (
              course.lectures.map((lecture) => (
                <Button key={lecture._id}>
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: "black",
                      //   mb:1,
                      pb: 1,
                      borderBottom: "1px solid #AFAFAF",
                      width: "280px",
                      textTransform: "none",
                    }}
                    onClick={() => handleLectureSelect(lecture)}
                  >
                    {lecture.title}
                  </Typography>
                </Button>
              ))
            ) : (
              <Typography>No lecture found</Typography>
            )}
          </Box>
        </Card>



        <Box>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Chat" />
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
          {tab === 1 && (
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
          )}
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
    </Box>
  );
};

export default UserCourseSection;
