import { Box, Grid, Typography } from "@mui/material";

const HowToBegin = () => {
  const content = [
    {
      head: "Plan your curriculum",
      name: (
        <>
          You start with your passion and knowledge. Then choose a promising
          topic with the help of our Marketplace Insights tool. <br />
          <br /> The way that you teach — what you bring to it — is up to you.
        </>
      ),
    },
    {
      head: "Record Your Video",
      name: (
        <>
          Use basic tools like a smartphone or a DSLR camera. Add a good
          microphone and you’re ready to start.
          <br />
          <br /> If you don’t like being on camera, just capture your screen.
          Either way, we recommend two hours or more of video for a course.
        </>
      ),
    },
    {
      head: "Launch Your Course",
      name: (
        <>
          Gather your first ratings and reviews by promoting your course through
          social media and your professional networks.
          <br />
          <br /> Your course will be discoverable in our marketplace where you
          earn revenue from each paid enrollment.
        </>
      ),
    },
  ];
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
          sx={{ fontWeight: {xs:'medium',md:"bold"}, mt: 2, textAlign: "left" }}
        >
          How to Begin
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 4, md: 0 }} sx={{ padding: 2 }}>
          {content.map((content, index) => (
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
                  backgroundColor: "#D6D6D6",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  "& .MuiBox-root": {
                    padding: 0.2,
                    margin: 0,
                    borderRadius:'10px'
                  },
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: "130%", md: "100%" },
                    height: { xs: "5rem", sm: "14rem", md: "16rem" },
                    p: 0,
                    m: 0,
                    bgcolor: "#f3f3f3",
                    "& .MuiTypography-root": {
                      padding: { sm: 1, md: 2 },
                      margin: 0,
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: 7, sm: 12, md: "1.5rem" },
                      fontWeight: "bold",
                      padding: { xs: 1, sm: 2 },
                    }}
                  >
                    {content?.head || "head"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "black",
                      paddingLeft: { xs: 1, sm: 2 },
                      fontSize: { xs: 7, sm: 12, md: "0.8rem" },
                      textAlign: "left",
                    }}
                  >
                    {content.name || "name"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HowToBegin;
