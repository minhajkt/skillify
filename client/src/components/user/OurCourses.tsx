import { Box, Button, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { fetchAllCourses, fetchTutorById } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { fetchCourseDetails } from "../../api/courseApi";
import { handleAxiosError } from "../../utils/errorHandler";


const OurCourses = () => {

    const [courses, setCourses] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
      const getCourses = async() => {
        try {
          const response = await fetchAllCourses()
          console.log('res is ', response);
          
          const tutorIds = response.map((course) => course.createdBy);
          console.log("tut id is ", tutorIds);

          const tutors = await Promise.all(
            tutorIds.map((tutorId) => fetchTutorById(tutorId))
          );
          console.log("tut detaisl is ", tutors);

        const coursesWithTutors = response.map((course, index) => ({
          ...course,
          name: course.title,
          tutor: tutors[index]?.name || "Unknown",
        }));          
          console.log("tut with coursees is ", coursesWithTutors);

          setCourses(coursesWithTutors);
          // console.log(coursesWithTutors);
        } catch (error) {
          console.log("error occured", error);
          
        }
        
      }
      getCourses()
    }, []);


    const [visibleCourses, setVisibleCourses] = useState(4)
    const handleShowMoreCourses = () => {
        setVisibleCourses(prev => prev + 4)
    }
    return (
      <Box
        sx={{
          // bgcolor: "#F7F9FA",
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
                    mb:2,
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
                  onClick={() => navigate(`/users/course-details/${course._id}`)}
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
                      src={course.thumbnail}
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
                      // bgcolor: "yellow",
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
                      {course?.title || "name"}
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

        {visibleCourses < courses.length && (
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