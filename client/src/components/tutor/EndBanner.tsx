import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

const EndBanner = () => {
    const navigate = useNavigate()
  return (
    <Box sx={{ bgcolor: "#F7F9FA", width: "100%", height: "150px",pt:5,pb:5 }}>
      <Typography variant="h4"
      sx={{textAlign:"center", fontWeight:"bold"}}>
        Become an instructor today
      </Typography>
      <Typography variant="body1"
      sx={{textAlign:"center",  fontWeight:"medium"}}>
        Join one of the world’s largest online learning <br />
        marketplaces.
      </Typography>
      <Box sx={{display:"flex", justifyContent:"center"}}>
        <Button variant="contained" sx={{mt:2, bgcolor:"black", fontWeight:'bold',display:{sm:'block'}}}
        onClick={() =>navigate("/tutors/login")}>
            Get Started
        </Button>
    </Box>
    </Box>
  );
}

export default EndBanner
