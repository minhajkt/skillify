import { Box } from "@mui/material";
import Contacts from "./Contacts";
import ChatComponent from "./ChatComponent";
import { useParams } from "react-router-dom";

const ChatLayout = () => {
  const { tutorId } = useParams<{ tutorId: string }>();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Panel: Contacts */}
      <Box
        sx={{
          width: "30%", // Adjust width of the left panel
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Contacts />
      </Box>

      {/* Right Panel: Chat */}
      <Box
        sx={{
          flex: 1, // Take up remaining space
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Display ChatComponent only when tutorId is selected */}
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
