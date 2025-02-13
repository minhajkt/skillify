import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react";
import { fetchAllCourses, fetchTutorById } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/courseApi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { handleAddToWishlist, handleRemoveFromWishlist } from "../../api/wishlistApi";
import { NavbarProps, ICourse, ICategory } from "../../types/types";


const OurCourses = ({ searchQuery }: NavbarProps) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("price"); 
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetchAllCourses();
        // console.log("res is ", response);

        const tutorIds = response.map((course: ICourse) => course.createdBy);
        // console.log("tut id is ", tutorIds);

        const tutors = await Promise.all(
          tutorIds.map((tutorId:string) => fetchTutorById(tutorId))
        );
        // console.log("tut detaisl is ", tutors);

        const coursesWithTutors = response.map((course:ICourse, index: number) => ({
          ...course,
          name: course.title,
          tutor: tutors[index]?.name || "Unknown",
        }));
        // console.log("tut with coursees is ", coursesWithTutors);

        setCourses(coursesWithTutors);
        // console.log(coursesWithTutors);
      } catch (error) {
        console.log("error occured", error);
      }
    };
    getCourses();
  }, []);

  // console.log("Search Query: ", searchQuery);
const filteredBySearch =
  courses && courses.length > 0
    ? courses.filter((course) =>
        course.title?.toLowerCase().includes((searchQuery || "").toLowerCase())
      )
    : [];
      // console.log("Filtered by search:", filteredBySearch);
      // console.log("Search query:", searchQuery);
      // console.log("Courses:", courses);
// console.log("Filtered Courses: ", filteredCourses);

  const filteredByCategory = categoryFilter
    ? filteredBySearch.filter((course) => course.category === categoryFilter)
    : filteredBySearch;

const sortedCourses = filteredByCategory.sort((a, b) => {
  if (sortBy === "price") {
    if (sortOrder === "asc") {
      return a.price - b.price; 
    } else {
      return b.price - a.price; 
    }
  } else if (sortBy === "title") {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title); 
    } else {
      return b.title.localeCompare(a.title); 
    } 
  }
  return 0;
});


  useEffect(() => {
    const getCategories = async() => {
      const response:string[] = await fetchCategories()
      const icons:Record<string, string> = {
        Software: "/images/web.png",
        Business: "/images/datascience.png",
        Accounts: "/images/accounts.png",
      };
      const formattedResponse = response.map((cat) => ({
        name: cat,
        icon: icons[cat]
      }))
      setCategories(formattedResponse)
      // console.log('cat is ca', formattedResponse);
      
    }
    getCategories()
  }, [])



const handleSortChange = (event: SelectChangeEvent<`${string}_${string}`>) => {
  const [field, order] = (event.target.value as string).split("_");
  setSortBy(field); 
  setSortOrder(order); 
};

const [visibleCourses, setVisibleCourses] = useState(4);
  const handleShowMoreCourses = () => {
    setVisibleCourses((prev) => prev + 4);
  };

    useEffect(() => {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get("/api/wishlist"); 
          const wishlistData = Array.isArray(response.data?.courses)
            ? response.data.courses
            : [];
          // console.log('wishllllllll', wishlistData)
          setWishlist(wishlistData); 
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          setWishlist([]);
        }
      };

      fetchWishlist();
    }, []);

    const isCourseInWishlist = (courseId: string) =>
      Array.isArray(wishlist) && wishlist.includes(courseId);

const handleAddToWishlistHandler = async (courseId: string) => {
  try {
    const result = await handleAddToWishlist(courseId);
    setWishlist((prevWishlist) => [...prevWishlist, result.courseId]); 
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

const handleRemoveFromWishlistHandler = async (courseId: string) => {
  try {
    const result = await handleRemoveFromWishlist(courseId);
    setWishlist((prevWishlist) =>
      prevWishlist.filter((id) => id !== result.courseId)
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
};

useEffect(() => {
  // console.log("Wishlist updateddddddddddddddddddddddddd:", wishlist);
}, [wishlist]);

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
      <Box sx={{ display: "flex", direction: "row", justifyContent: "end" }}>
        <FormControl sx={{ width: "120px", fontSize: "0.9rem", mt: 1 }}>
          <InputLabel sx={{ fontSize: "0.9rem" }}>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
            sx={{ fontSize: "0.9rem" }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem
                value={category.name}
                key={category.name}
                sx={{ fontSize: "0.9rem" }}
              >
                {/* <img
                  src={category.icon}
                  alt={category.name}
                  style={{ width: 20, marginRight: 10 }}
                /> */}
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{ width: "120px", fontSize: "0.9rem", mt: 1, mr: 12, ml: 2 }}
        >
          <InputLabel sx={{ fontSize: "0.9rem" }}>Sort By</InputLabel>
          <Select
            value={`${sortBy}_${sortOrder}`}
            onChange={handleSortChange}
            label="Sort By"
            sx={{ fontSize: "0.9rem" }}
          >
            <MenuItem value="price_asc" sx={{ fontSize: "0.9rem" }}>
              Price - Low to High
            </MenuItem>
            <MenuItem value="price_desc" sx={{ fontSize: "0.9rem" }}>
              Price - High to Low
            </MenuItem>
            <MenuItem value="title_asc" sx={{ fontSize: "0.9rem" }}>
              Title - A to Z
            </MenuItem>
            <MenuItem value="title_desc" sx={{ fontSize: "0.9rem" }}>
              Title - Z to A
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
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
          {sortedCourses.slice(0, visibleCourses).map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "start", sm: "center" },
                  justifyContent: "center",
                  ml: { xs: 4, sm: 0 },
                  mb: 2,
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
                    src={
                      typeof course.thumbnail === "string"
                        ? course.thumbnail
                        : undefined
                    }
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2D2F31",
                        paddingLeft: { xs: 1, sm: 2 },
                        // pt: 1,
                        fontSize: { xs: 9, sm: 12, md: "1rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {`${"₹ "}` + course.price || "5000"}
                    </Typography>
                    <Box
                      sx={{
                        color: "#ff4081",
                        cursor: "pointer",
                        "&:hover": { color: "#ff1744" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCourseInWishlist(course._id)) {
                          handleRemoveFromWishlistHandler(course._id);
                        } else {
                          handleAddToWishlistHandler(course._id);
                        }
                      }}
                    >
                      {isCourseInWishlist(course._id) ? (
                        <FavoriteIcon sx={{ pr: 1 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ pr: 1 }} />
                      )}
                    </Box>
                  </Box>
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
};

export default OurCourses


