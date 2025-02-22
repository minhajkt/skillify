import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        bgcolor: "#e0e0e0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" color="initial" fontWeight={"semi-bold"}>
        404
      </Typography>
      <Typography variant="h6" color="initial">
        Oops! Page not Found
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ mt: 2 }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default NotFoundPage;
