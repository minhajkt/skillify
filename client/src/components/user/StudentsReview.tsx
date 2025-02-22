import { Box, Grid, Typography } from "@mui/material"

    const reviews = [
      { name: "User1", review: "Because of this course I was able to clear my two interviews.Thanks for making such wonderful content.", course: "Python" },
      { name: "User2", review: "This has helped me so much in my career...I joined as a frontend engineer and eventually transitioned to full stack engineer with the help of this course.", course: "Mern" },
      { name: "User1", review: "Today, I am a software developer, and I credit a significant part of my success to the solid foundation laid by this course.", course: "Python" },
      { name: "User2", review: "I would highly recommend this Web Development Bootcamp to anyone interested in pursuing a career in web development or looking to enhance their skills in this field.", course: "Mern" },
    ];
const StudentsReview = () => {
  return (
    <Box
      sx={{
        width: "100%",
        paddingLeft: { xs: "0rem", sm: "4rem" },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box>
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" } }}
            fontWeight={"bold"}
          >
            See what our students have to say
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 1, sm: 1 }} sx={{ padding: 2 }}>
          {reviews.map((review) => (
            <Grid item xs={6} sm={4} md={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "start", sm: "center" },
                  justifyContent: "center",
                  ml: { xs: 0, sm: 0 },
                  borderRadius: "8px",
                  height: {xs:"250px",sm:"auto"},
                  width: { xs: "90%", sm: "90%" },
                  backgroundColor: "#F7F9FA",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  "& .MuiBox-root": {
                    padding: 0,
                    margin: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "50%", sm: "150px", md:"100%" },
                    height: { xs: "5rem", sm: "15rem" },
                    position:"relative",
                  }}
                >
                  <Box position={'relative'}>
                    <img src="/images/q.png" width={"20px"} style={{paddingLeft:"1rem", paddingTop:"1rem", marginBottom:3}}/>
                    <Typography sx={{paddingLeft:{xs:"0.2rem",sm:"1rem"},paddingRight:{xs:"0.2rem",sm:"1rem"}, fontSize:{xs:"8px",sm:"10px",md:"12px"}}}>{review.review}</Typography>
                    <Typography sx={{paddingLeft:{xs:"0.2rem",sm:"1rem"},paddingRight:{xs:"0.2rem",sm:"1rem"}, fontSize:{xs:"10px",sm:"11px",md:"13px"}, fontWeight:"medium", position:"absolute", top:'12rem'}}>{review.name}</Typography>
                    <Typography sx={{paddingLeft:{xs:"0.2rem",sm:"1rem"},paddingRight:{xs:"0.2rem",sm:"1rem"}, fontSize:{xs:"9px",sm:"8px",md:"10px"}, position:"absolute", top:'13rem'}}>{review.course}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default StudentsReview