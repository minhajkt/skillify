/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, Chip, Snackbar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Favorite as FavoriteIcon, Close } from '@mui/icons-material';
import { axiosInstance } from "../../api/axiosInstance";
import Navbar from "../shared/Navbar";
import { handleRemoveFromWishlist } from "../../api/wishlistApi";
import { ICourseForDisplay } from "../../types/types";

const Wishlist = () => {
  const [wishlistCourses, setWishlistCourses] = useState<ICourseForDisplay[]>([]);
  const [snackbar, setSnackbar] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/wishlist");

        const wishlistData = Array.isArray(response.data?.courses)
          ? response.data.courses
          : [];
        setWishlistCourses(wishlistData);
      } catch (error) {
        setError("Error fetching wishlist");
        setWishlistCourses([]);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (courseId: string) => {
    try {
      await handleRemoveFromWishlist(courseId);
      setWishlistCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId))
      setSnackbar(true)
    } catch (error) {
      setError("Failed to remove from wishlist");
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/users/course-details/${courseId}`);
  };

  return (
    <Box
      sx={{
        width: { xs: "110%", md: "100vw" },
        pt: { xs: 1, md: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ml: { xs: -2, md: 0 },
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar}
        onClose={() => setSnackbar(false)}
        message="Course Removed from the Wishlist"
        autoHideDuration={2000}
      />
      <Navbar />
      <Typography
        variant="h4"
        sx={{
          marginBottom: { xs: 2, md: 4 },
          fontWeight: 700,
          color: "#1a237e",
          textAlign: { xs: "center", md: "left" },
          borderBottom: "3px solid #1a237e",
          paddingBottom: { md: 1 },
          display: "inline-block",
          mt: "64px",
          fontSize: { xs: 24, md: 34 },
        }}
      >
        My Wishlist
      </Typography>

      {wishlistCourses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 2, md: 8 },
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <FavoriteIcon
            sx={{ fontSize: { xs: 30, md: 60 }, color: "#9e9e9e", mb: 2 }}
          />
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ fontSize: { xs: 20, md: 24 } }}
            gutterBottom
          >
            Your wishlist is empty
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: { xs: 2, md: 3 }, fontSize: { xs: 14, md: 16 } }}
          >
            Explore courses and add your favorites here!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: { xs: 2, md: 4 },
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
            width: { xs: "90%", md: "100%" },
            // mx: "auto",
            ml: { xs: -4, md: 0 },
          }}
        >
          {wishlistCourses.map((course: any) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={course._id}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  width: { xs: "100%", sm: "90%", md: "100%" },
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
                    cursor: "pointer",
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

                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.1rem" },
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
                      mb: {xs:1,md:2},
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1a237e",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", md: "1.2rem" },
                      }}
                    >
                      ₹{course.price}
                    </Typography>
                    <Chip
                      label="Wishlist"
                      size="small"
                      icon={
                        <FavoriteIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                      }
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
                      py: { xs: 0.8, md: 1 },
                      fontSize: { xs: "0.875rem", md: "0.9rem" },
                    }}
                    onClick={() => handleRemove(course._id)}
                    startIcon={
                      <FavoriteIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
                    }
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
