/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import { axiosInstance } from "../../api/axiosInstance";

const Wishlist = () => {
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/wishlist"); 
        console.log('wishlist ressssss', response);
        
        const wishlistData = Array.isArray(response.data?.courses)
          ? response.data.courses
          : []; 
        console.log("Fetched Wishlist Data: ", wishlistData);
        setWishlistCourses(wishlistData); 
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistCourses([]); 
      }
    };

    fetchWishlist();
  }, []);

  const handleCourseClick = (courseId: string) => {
    navigate(`/users/course-details/${courseId}`);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        padding: { xs: 2, md: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          fontWeight: 700,
          color: "#1a237e",
          textAlign: { xs: "center", md: "left" },
          borderBottom: "3px solid #1a237e",
          paddingBottom: 2,
          display: "inline-block",
        }}
      >
        My Wishlist
      </Typography>

      {wishlistCourses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <FavoriteIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Explore courses and add your favorites here!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 4,
            }}
            onClick={() => navigate("/home")}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: "1200px",
            width: "100%",
            mx: "auto",
          }}
        >
          {wishlistCourses.map((course: any) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  maxWidth: "600px", 
                  width: "100%", 
                  mx: "auto",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "56.25%",
                    backgroundColor: "#f5f5f5",
                    cursor:"pointer"
                  }}
                  onClick={() => handleCourseClick(course._id)}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      mb: 1,
                      height: "3.4em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.title}
                  </Typography>


                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1a237e",
                        fontWeight: 700,
                      }}
                    >
                      ₹{course.price}
                    </Typography>
                    <Chip
                      label="Wishlist"
                      size="small"
                      icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        backgroundColor: "#fce4ec",
                        color: "#c2185b",
                        "& .MuiChip-icon": { color: "#c2185b" },
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      color: "#d32f2f",
                      borderColor: "#d32f2f",
                      "&:hover": {
                        backgroundColor: "#ffebee",
                        borderColor: "#d32f2f",
                      },
                      textTransform: "none",
                      borderRadius: 1.5,
                      py: 1,
                    }}
                    startIcon={<FavoriteIcon />}
                  >
                    Remove from Wishlist
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Wishlist;
