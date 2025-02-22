import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EndBanner = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        bgcolor: "#F7F9FA",
        width: "100%",
        height: "150px",
        pt: { xs: 1, md: 5 },
        pb: 5,
      }}
    >
      <Typography
        component="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { xs: "1.2rem", md: "2rem" },
        }}
      >
        Become an instructor today
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          fontWeight: "medium",
          fontSize: { xs: 10, md: 16 },
        }}
      >
        Join one of the world’s largest online learning <br />
        marketplaces.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "black",
            fontWeight: "bold",
            display: { sm: "block" },
            px: { xs: 1, md: 3 }, 
            py: { xs: 1, md: 1 }, 
            fontSize: { xs: "0.65rem", md: "0.85rem" }, 
            minWidth: { xs: "80px", md: "120px" },
          }}
          onClick={() => navigate("/tutors/login")}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default EndBanner;
