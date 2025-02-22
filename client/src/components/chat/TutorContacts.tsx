import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { getMyStudents } from "../../api/enrollmentApi";
import { useNavigate, useParams } from "react-router-dom";
import ChatComponent from "./ChatComponent";
import styles from "../../myModule.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useUnreadMessages } from "./useUnreadMessage";
import { IUser, MyStudent } from "../../types/types";

const ChatContainer = styled(Box)({
  display: "flex",
  height: "100vh",
});

const ContactsList = styled(Box)(({ theme }) => ({
  width: "30%",
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    display: "block",
  },
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

const TutorContacts = () => {
  const [myStudents, setMyStudents] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const { studentId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);

  const unreadCounts = useUnreadMessages(user?._id ?? "");

  useEffect(() => {
    const fetchMyStudents = async () => {
      const students = await getMyStudents();
      const uniqueStudents = Array.from(
        new Map(
          students.map((entry: MyStudent) => [
            entry?.student?._id,
            entry.student,
          ])
        ).values()
      ) as IUser[];
      setMyStudents(uniqueStudents);
    };
    fetchMyStudents();
  }, []);

  const handleChatClick = (studentId: string) => {
    navigate(`/tutors/contacts/${studentId}`);
  };

  return (
    <ChatContainer className={styles.body}>
      <ContactsList
        sx={{
          bgcolor: "#f2f2f2",
          display: { xs: studentId ? "none" : "block", md: "block" },
        }}
      >
        {/* <ContactsList sx={{ bgcolor: "#f2f2f2" }}> */}
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
              navigate("/tutors/home");
            }}
            sx={{
              height: { xs: "20px", md: "20px" },
              width: { xs: "100px", md: "100px" },
              paddingLeft: { xs: "0rem", md: "1rem" },
              paddingRight: { xs: "0rem", md: "6rem" },
              cursor: "pointer",
            }}
          ></Box>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", ml: { xs: 3, md: 0 } }}
          >
            Your Students
          </Typography>
        </Box>
        <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
          {myStudents.map((student, index) => (
            <ContactItem
              key={index}
              isSelected={studentId === student?._id}
              onClick={() => student?._id && handleChatClick(student._id)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar>{student?.name[0].toUpperCase()}</Avatar>
                {student?._id && unreadCounts[student._id] > 0 && (
                  <Box>
                    <Badge
                      badgeContent={unreadCounts[student._id]}
                      color="primary"
                    />
                  </Box>
                )}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">{student?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {student.courseId?.title}
                  </Typography>
                </Box>
              </Box>
            </ContactItem>
          ))}
        </Box>
      </ContactsList>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {studentId ? (
          <ChatComponent />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "url('/images/bgbbg.jpg')",
            }}
          >
            <Typography color="text.secondary">
              Select a student to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </ChatContainer>
  );
};

export default TutorContacts;
