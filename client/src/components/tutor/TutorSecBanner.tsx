import { Box, Grid, Typography } from "@mui/material"

const TutorSecBanner = () => {
    const captions = [
        {head:"Teach your way",name: "Publish the course you want, in the way you want, and always have control of your own content.", icon:"/images/sec1.jpg"},
        {head:"Inspire learners",name: "Teach what you know and help learners explore their interests, gain new skills, and advance their careers.", icon:"/images/sec2.jpg"},
        {head:"Get rewarded",name: "Expand your professional network, build your expertise, and earn money on each paid enrollment.", icon:"/images/sec3.jpg"}
    ]
  return (
    <Box
      sx={{
        bgcolor: "#F7F9FA",
        width: "100%",
        paddingLeft: { xs: "0rem", sm: "4rem" },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: {xs:"medium",md:"bold"}, mt: {xs:1,md:2}, textAlign: "center" }}
        >
          So many reasons to start
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 4, md: 0 }} sx={{ padding: 2 }}>
          {captions.map((caption, index) => (
            <Grid item xs={12} sm={4} md={4} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "start", sm: "center" },
                  justifyContent: "center",
                  ml: { xs: 2, md: 0 },
                  borderRadius: "8px",
                  height: "auto",
                  width: { xs: "90%", sm: "80%" },
                  backgroundColor: "#F7F9FA",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  "& .MuiBox-root": {
                    padding: 0,
                    margin: 0,
                  },
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "50%", sm: "100%" },
                    height: { xs: "5rem", sm: "5rem", md: "8rem" },
                    p: 0,
                    m: 0,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    component="img"
                    src={caption.icon}
                    alt={caption.name}
                    sx={{
                      width: { xs: "20%", sm: "30%" },
                      height: { xs: "2rem", sm: "4rem" },
                      marginBottom: 1,
                      position: "relative",
                      top: { xs: "30%", sm: "10%", md: "30%" },
                      left: "35%",
                      mr: 0,
                      objectFit: { sm: "cover" },
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    height: { xs: "5rem", sm: "10rem" },
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: 7, sm: 12, md: "1rem" },
                      fontWeight: "bold",
                      padding: { xs: 1, sm: 2 },
                      textAlign: "center",
                    }}
                  >
                    {caption?.head || "head"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "black",
                      paddingLeft: { xs: 1, sm: 2 },
                      fontSize: { xs: 7, sm: 12, md: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    {caption.name || "name"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default TutorSecBanner