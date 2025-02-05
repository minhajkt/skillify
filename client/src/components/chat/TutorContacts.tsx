import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { getMyStudents } from "../../api/enrollmentApi";
import { useNavigate, useParams } from "react-router-dom";
import ChatComponent from "./ChatComponent";
import styles from "../../myModule.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useUnreadMessages } from "./useUnreadMessage";
// import BadgeComponent from "./BadgeComponent";

const ChatContainer = styled(Box)({
  display: "flex",
  height: "100vh",
});

const ContactsList = styled(Box)(({ theme }) => ({
  width: "40%",
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

const TutorContacts = () => {
  const [myStudents, setMyStudents] = useState<[]>([]);
  const navigate = useNavigate();
  const { studentId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user)
  
  const unreadCounts = useUnreadMessages(user._id)

  useEffect(() => {
    const fetchMyStudents = async () => {
      const students = await getMyStudents();
      setMyStudents(students);
      console.log('fffffffffffffffffffffffffffffffff', students)
    };
    fetchMyStudents();
  }, []);

  const handleChatClick = (studentId: string) => {
    navigate(`/tutors/contacts/${studentId}`);
  };

  return (
    <ChatContainer className={styles.body}>
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
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Your Students
          </Typography>
        </Box>
        <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
          {myStudents.map((student, index) => (
            <ContactItem
              key={index}
              isSelected={studentId === student.student._id}
              onClick={() => handleChatClick(student.student._id)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar>{student.student.name[0].toUpperCase()}</Avatar>
                {unreadCounts[student.student._id] > 0 && (
                  <Box>
                  {/* <Typography>Hello</Typography> */}
                  <Badge
                    badgeContent={unreadCounts[student.student._id]}
                    color="primary"
                    // sx={{
                    //   position: "absolute",
                    //   top: -5,
                    //   right: -5,
                    // }}
                  />
                  </Box>
                )}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">
                    {student.student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {student.courseId.title}
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
          // <Typography>Hello</Typography>
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
              Select a student to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </ChatContainer>
  );
};

export default TutorContacts;


/////////////////////////////////////////////////////

//////////////////////////////////////////////////////

// import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
// import { useEffect, useState } from "react";
// import { getMyStudents } from "../../api/enrollmentApi";
// import { useNavigate, useParams } from "react-router-dom";
// import ChatComponent from "./ChatComponent";
// import styles from "../../myModule.module.css";
// import { socket } from "../../utils/socket";

// const ChatContainer = styled(Box)({
//   display: "flex",
//   height: "100vh",
// });

// const ContactsList = styled(Box)(({ theme }) => ({
//   width: "40%",
//   backgroundColor: theme.palette.background.paper,
//   borderRight: `1px solid ${theme.palette.divider}`,
// }));

// const ContactItem = styled(Box, {
//   shouldForwardProp: (prop) => prop !== "isSelected",
// })<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
//   padding: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   cursor: "pointer",
//   backgroundColor: isSelected ? theme.palette.action.selected : "inherit",
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const TutorContacts = () => {
//   const [myStudents, setMyStudents] = useState<[]>([]);
//   const navigate = useNavigate();
//   const { studentId } = useParams();
//   const [unreadMessageCount, setUnreadMessageCount] = useState<{[key: string]: number}>({})

//   useEffect(() => {
//     const fetchMyStudents = async () => {
//       const students = await getMyStudents();
//       setMyStudents(students);
//       // console.log("fffffffffffffffffffffffffffffffff", students);
//     };
//     fetchMyStudents();
//   }, []);

//   const handleChatClick = (studentId: string) => {
//     navigate(`/tutors/contacts/${studentId}`);
//   };

//   useEffect(() => {
//     socket.on('unread_message_count', (data) => {
//       console.log("Received unread message count data:", data);
//       setUnreadMessageCount(prevCounts => ({
//         ...prevCounts,
//         [data.studentId]: data.unreadMessagesCount
//       }))
//     })
//     return () => {
//       socket.off('unread_message_count')
//     }
//   }, [])

//   // useEffect(() => {
//   //   console.log("Updated unreadMessageCount:", unreadMessageCount);
//   // }, [unreadMessageCount]);

//   return (
//     <ChatContainer className={styles.body}>
//       <ContactsList sx={{ bgcolor: "#f2f2f2" }}>
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: 1,
//             borderColor: "divider",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Box
//             component={"img"}
//             src="/images/skillify-high-resolution-logo__1_-removebg-preview - Copy.png"
//             alt="Skillify Logo"
//             onClick={() => {
//               navigate("/tutors/home");
//             }}
//             sx={{
//               height: { xs: "20px", md: "20px" },
//               width: { xs: "100px", md: "100px" },
//               paddingLeft: { xs: "0rem", md: "1rem" },
//               paddingRight: { xs: "0rem", md: "6rem" },
//               cursor: "pointer",
//             }}
//           ></Box>
//           <Typography variant="h6" sx={{ textAlign: "center" }}>
//             Your Students
//           </Typography>
//         </Box>
//         <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
//           {myStudents.map((student, index) => (
//             <ContactItem
//               key={index}
//               isSelected={studentId === student.student._id}
//               onClick={() => handleChatClick(student.student._id)}
//             >
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Avatar>{student.student.name[0].toUpperCase()}</Avatar>
//                 <Box sx={{ ml: 2 }}>
//                   <Typography variant="subtitle1">
//                     {student.student.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {student.courseId.title}
//                   </Typography>
//                 </Box>
//               </Box>
//               {unreadMessageCount[student.student._id] > 0 && (
//                 // <Typography>Hello{unreadMessageCount[student.student._id]}</Typography>
//                 <Badge
//                   badgeContent={unreadMessageCount[student.student._id]}
//                   color="primary"
//                   // sx={{ position: "relative", top: -30, left: 150 }}
//                 />
//               )}
//             </ContactItem>
//           ))}
//         </Box>
//       </ContactsList>

//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {studentId ? (
//           <ChatComponent />
//         ) : (
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundImage: "url('/images/bgbbg.jpg')",
//             }}
//           >
//             <Typography color="text.secondary">
//               Select a student to start chatting
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </ChatContainer>
//   );
// };

// export default TutorContacts;

/////////////////////////////////////////////////////////////////////////////

// import { Box, Typography, Avatar, styled } from "@mui/material";
// import { useEffect, useState } from "react";
// import { getMyStudents } from "../../api/enrollmentApi";
// import { useNavigate, useParams } from "react-router-dom";
// import ChatComponent from "./ChatComponent";
// import styles from "../../myModule.module.css";

// const ChatContainer = styled(Box)({
//   display: "flex",
//   height: "100vh",
// });

// const ContactsList = styled(Box)(({ theme }) => ({
//   width: "40%",
//   backgroundColor: theme.palette.background.paper,
//   borderRight: `1px solid ${theme.palette.divider}`,
// }));

// const ContactItem = styled(Box, {
//   shouldForwardProp: (prop) => prop !== "isSelected",
// })<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
//   padding: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   cursor: "pointer",
//   backgroundColor: isSelected ? theme.palette.action.selected : "inherit",
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const TutorContacts = () => {
//   const [myStudents, setMyStudents] = useState<[]>([]);
//   const navigate = useNavigate();
//   const { studentId } = useParams();

//   useEffect(() => {
//     const fetchMyStudents = async () => {
//       const students = await getMyStudents();
//       setMyStudents(students);
//       console.log('fffffffffffffffffffffffffffffffff', students)
//     };
//     fetchMyStudents();
//   }, []);

//   const handleChatClick = (studentId: string) => {
//     navigate(`/tutors/contacts/${studentId}`);
//   };

//   return (
//     <ChatContainer className={styles.body}>
//       <ContactsList sx={{ bgcolor: "#f2f2f2" }}>
//         <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display:"flex", alignItems:'center' }}>
//           <Box
//             component={"img"}
//             src="/images/skillify-high-resolution-logo__1_-removebg-preview - Copy.png"
//             alt="Skillify Logo"
//             onClick={() => {
//                 navigate("/tutors/home");
//             }}
//             sx={{
//               height: { xs: "20px", md: "20px" },
//               width: { xs: "100px", md: "100px" },
//               paddingLeft: { xs: "0rem", md: "1rem" },
//               paddingRight: { xs: "0rem", md: "6rem" },
//               cursor: "pointer",
//             }}
//           ></Box>
//           <Typography variant="h6" sx={{ textAlign: "center" }}>
//             Your Students
//           </Typography>
//         </Box>
//         <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
//           {myStudents.map((student, index) => (
//             <ContactItem
//               key={index}
//               isSelected={studentId === student.student._id}
//               onClick={() => handleChatClick(student.student._id)}
//             >
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Avatar>{student.student.name[0].toUpperCase()}</Avatar>
//                 <Box sx={{ ml: 2 }}>
//                   <Typography variant="subtitle1">
//                     {student.student.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {student.courseId.title}
//                   </Typography>
//                 </Box>
//               </Box>
//             </ContactItem>
//           ))}
//         </Box>
//       </ContactsList>

//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {studentId ? (
//           <ChatComponent />
//         ) : (
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundImage: "url('/images/bgbbg.jpg')",
//             }}
//           >
//             <Typography color="text.secondary">
//               Select a student to start chatting
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </ChatContainer>
//   );
// };

// export default TutorContacts;
