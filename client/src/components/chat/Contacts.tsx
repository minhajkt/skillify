import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUserEnrolledCourses } from "../../api/enrollmentApi";
import { useNavigate, useParams } from "react-router-dom";
import ChatComponent from "./ChatComponent"; 
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useUnreadMessages } from "./useUnreadMessage";

const ChatContainer = styled(Box)({
  display: "flex",
  height: "100vh",
});

const ContactsList = styled(Box)(({ theme }) => ({
  width: "30%",
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const ContactItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  backgroundColor: isSelected ? theme.palette.action.selected : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Contacts = () => {
  const [myTutors, setMyTutors] = useState<[]>([]);
  const navigate = useNavigate();
  const { tutorId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user)
  const unreadCounts = useUnreadMessages(user?._id)

  useEffect(() => {
    const getMyTutors = async () => {
      const tutorsName = await fetchUserEnrolledCourses();
      setMyTutors(tutorsName);
    };
    getMyTutors();
  }, []);

  const handleChatClick = (tutorId: string) => {
    navigate(`/messages/${tutorId}`);
  };

  return (
    <Box>
      <ChatContainer>
        <ContactsList sx={{ bgcolor: "#f2f2f2" }}>
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component={"img"}
              src="/images/skillify-high-resolution-logo__1_-removebg-preview - Copy.png"
              alt="Skillify Logo"
              onClick={() => {
                navigate("/home");
              }}
              sx={{
                height: { xs: "20px", md: "20px" },
                width: { xs: "100px", md: "100px" },
                paddingLeft: { xs: "0rem", md: "1rem" },
                paddingRight: { xs: "0rem", md: "6rem" },
                cursor: "pointer",
              }}
            ></Box>
            <Typography variant="h6">Your Tutors</Typography>
          </Box>
          <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
            {myTutors.map((tutor, index) => (
              <ContactItem
                key={index}
                isSelected={tutorId === tutor.courseId.createdBy._id}
                onClick={() => handleChatClick(tutor.courseId.createdBy._id)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar>
                    {tutor.courseId.createdBy.name[0].toUpperCase()}
                  </Avatar>
                  {unreadCounts[tutor.courseId.createdBy._id] > 0 && (
                    <Badge
                      badgeContent={unreadCounts[tutor.courseId.createdBy._id]}
                      color="primary"
                      // sx={{
                      //   position: "absolute",
                      //   top: -5,
                      //   right: -5,
                      // }}
                    />
                  )}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">
                      {tutor.courseId.createdBy.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tutor.courseId.title}
                    </Typography>
                  </Box>
                </Box>
              </ContactItem>
            ))}
          </Box>
        </ContactsList>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {tutorId ? (
            <ChatComponent />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "url('/images/bgbbg.jpg')",
              }}
            >
              <Typography color="text.secondary">
                Select a tutor to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </ChatContainer>
    </Box>
  );
};

export default Contacts;



