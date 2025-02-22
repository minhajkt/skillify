import { Box } from "@mui/material";
import Contacts from "./Contacts";
import ChatComponent from "./ChatComponent";
import { useParams } from "react-router-dom";

const ChatLayout = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Contacts />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
        }}
      >
        {tutorId ? (
          <ChatComponent />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#888",
            }}
          >
            Select a contact to start chatting
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatLayout;
