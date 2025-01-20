import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
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
    <Box sx={{ width: "100%", padding: 4, backgroundColor: "#f7f9fa" }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        My Wishlist
      </Typography>
      {wishlistCourses.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Your wishlist is empty.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlistCourses.map((course: any) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                }}
                onClick={() => handleCourseClick(course._id)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  {course.tutor}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#2D2F31", fontWeight: "bold" }}
                >
                  ₹{course.price}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: 2,
                    color: "#ff4081",
                    borderColor: "#ff4081",
                    "&:hover": { borderColor: "#ff1744", color: "#ff1744" },
                  }}
                  startIcon={<FavoriteIcon />}
                >
                  Remove from Wishlist
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Wishlist;
