import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: { xs: "80px", sm: "130px" },
          bgcolor: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            color: "white",
            fontWeight: "semi-bold",
            fontSize: { xs: "8px", sm: "15px" },
          }}
        >
          Explore About Us
        </Typography>
        <Typography
          sx={{ color: "white", fontSize: { xs: "0.5rem", sm: "0.9rem" } }}
        >
          About Us
        </Typography>
        <Typography
          sx={{ color: "white", fontSize: { xs: "0.5rem", sm: "0.9rem" } }}
        >
          Contact Us
        </Typography>
        <Typography
          sx={{ color: "white", fontSize: { xs: "0.5rem", sm: "0.9rem" } }}
        >
          Teach on Skillify
        </Typography>
        <hr
          style={{
            width: "100%",
            borderBlockColor: "grey",
          }}
        />
      </Box>
      <Box
        sx={{
          bgcolor: "black",
          height: "30px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          component="img"
          src="/images/ski.png"
          sx={{ width: {xs:"4rem",md:"7rem"}, height: {xs:'1.1rem',md:"1.5rem"}, marginLeft: {xs:1,md:5} }}
        ></Box>
        <Typography
          variant="caption"
          sx={{ color: "white", fontSize: { xs: "12px", sm: "16px" } }}
        >
          ©
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", pl: 1, fontSize: { xs: "12px", sm: "16px" } }}
        >
          Skillify, Inc.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer