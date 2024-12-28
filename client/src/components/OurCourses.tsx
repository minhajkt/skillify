import { Box, Button, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react";


const OurCourses = () => {
    const ourCourses = [
      { name: "100 Days of Code: The Complete Python Program", icon: "/images/py.jpg", tutor:"", rating:4.0, price:2500 },
      { name: "The Complete 2025 Web Development Bootcamp", icon: "/images/mern thumb.png", tutor:"", rating:5.0, price:1800 },
      { name: "Basics of Accounting and Taxation", icon: "/images/accc.jpeg", tutor:"", rating:3.8, price:1900 },
      { name: "Learn to Become a Trader in 2025", icon: "/images/stock thumnb.jpg", tutor:"", rating:4.5, price:3000 },
      { name: "100 Days of Code: The Complete Python Program", icon: "/images/py.jpg", tutor:"", rating:4.0, price:2500 },
      { name: "The Complete 2025 Web Development Bootcamp", icon: "/images/mern thumb.png", tutor:"", rating:5.0, price:1800 },
      { name: "Basics of Accounting and Taxation", icon: "/images/accc.jpeg", tutor:"", rating:3.8, price:1900 },
      { name: "Learn to Become a Trader in 2025", icon: "/images/stock thumnb.jpg", tutor:"", rating:4.5, price:3000 },
      { name: "100 Days of Code: The Complete Python Program", icon: "/images/py.jpg", tutor:"", rating:4.0, price:2500 },
      { name: "The Complete 2025 Web Development Bootcamp", icon: "/images/mern thumb.png", tutor:"", rating:5.0, price:1800 },
      { name: "Basics of Accounting and Taxation", icon: "/images/accc.jpeg", tutor:"", rating:3.8, price:1900},
      { name: "Learn to Become a Trader in 2025", icon: "/images/stock thumnb.jpg", tutor:"", rating:4.5, price:3000 },
    
    ];
    const [courses, setCourses] = useState<{name:string,tutor:string, rating:number, price:number ,icon:string}[]>([]);
    // useEffect(() => {
    //   fetch("/api/courses") 
    //     .then((response) => response.json())
    //     .then((data) => setCourses(data))
    //     .catch((error) => console.error("Error fetching courses:", error));
    // }, []);
    useEffect(() => {
      setCourses(ourCourses)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [visibleCourses, setVisibleCourses] = useState(4)
    const handleShowMoreCourses = () => {
        setVisibleCourses(prev => prev + 4)
    }
    return (
      <Box
        sx={{
          bgcolor: "palevioletred",
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
            sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" }, mb: 2 }}
            fontWeight={"bold"}
          >
            Our Courses
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 4, md: 0 }} sx={{ padding: 2 }}>
            {courses.slice(0, visibleCourses).map((course, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    alignItems: { xs: "start", sm: "center" },
                    justifyContent: "center",
                    ml: { xs: 4, sm: 0 },
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
                  onClick={() => console.log("clicked")}
                >
                  <Box
                    sx={{
                      width: { xs: "50%", sm: "100%" },
                      height: { xs: "5rem", sm: "8rem" },
                      p: 0,
                      m: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={course.icon}
                      alt={course.name}
                      sx={{
                        width: { xs: "100%", sm: "100%" },
                        height: { xs: "5rem", sm: "8rem" },
                        marginBottom: 1,
                        mr: 0,
                        objectFit: { sm: "cover" },
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "yellow",
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
                      }}
                      // fontWeight="medium"
                    >
                      {course?.name || "name"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6A6F73",
                        paddingLeft: { xs: 1, sm: 2 },
                        fontSize: { xs: 7, sm: 12, md: "1rem" },
                      }}
                    >
                      {course.tutor || "Tutor1"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4D3105",
                        paddingLeft: { xs: 1, sm: 2 },
                        fontSize: { xs: 7, sm: 12, md: "1rem" },
                        fontWeight: "medium",
                      }}
                    >
                      {course.rating || "5"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2D2F31",
                        paddingLeft: { xs: 1, sm: 2 },
                        pt: 1,
                        fontSize: { xs: 9, sm: 12, md: "1rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {`${"₹ "}` + course.price || "5000"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {visibleCourses < ourCourses.length && (
          <Box sx={{ marginTop: 1, paddingLeft: 2 }}>
            <Button
              variant="outlined"
              onClick={handleShowMoreCourses}
              sx={{
                color: "black",
                fontWeight: "bold",
                borderColor: "black",
                fontSize: { xs: "0.6rem", sm: "1rem" },
                padding: { xs: "4px 10px", sm: "8px 16px" },
                ml: { xs: 4, sm: 0 },
              }}
            >
              Show More
            </Button>
          </Box>
        )}
      </Box>
    );
}

export default OurCourses