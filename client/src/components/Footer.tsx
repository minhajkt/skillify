import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: {xs:"80px",sm:"130px"},
          bgcolor: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mt: 1, color: "white", fontWeight: "semi-bold", fontSize:{xs:"8px",sm:"15px"} }}
        >
          Explore About Us
        </Typography>
        <Typography sx={{ color: "white", fontSize: {xs:"0.5rem",sm:"0.9rem"} }}>
          About Us
        </Typography>
        <Typography sx={{ color: "white", fontSize: {xs:"0.5rem",sm:"0.9rem"} }}>
          Contact Us
        </Typography>
        <Typography sx={{ color: "white", fontSize: {xs:"0.5rem",sm:"0.9rem"} }}>
          Teach on Skillify
        </Typography>
        <hr
          style={{
            width: "100%",
            borderBlockColor:"grey"
        }}
        />
      </Box>
      <Box 
      sx={{bgcolor:"black", height:"30px", display:"flex", flexDirection:"row"}}>
      <img src="/images/ski.png" style={{width:"7rem", height:"1.5rem", marginLeft:5}} />
      <Typography variant="caption" sx={{color:"white", fontSize:{xs:"14px", sm:"16px"}}}>©</Typography>
      <Typography variant="body2" sx={{color:"white", pl:1, fontSize:{xs:"14px", sm:"16px"}}}>Skillify, Inc.</Typography>
      </Box>
    </Box>
  );
}

export default Footer