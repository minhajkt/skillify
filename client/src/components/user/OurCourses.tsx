import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchTutorById } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { fetchCategories, getOurCourses } from "../../api/courseApi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  getWishlist,
  handleAddToWishlist,
  handleRemoveFromWishlist,
} from "../../api/wishlistApi";
import { NavbarProps, ICourse, ICategory } from "../../types/types";

const OurCourses = ({ searchQuery }: NavbarProps) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("price");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const navigate = useNavigate();
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await getOurCourses();

        const tutorIds = response.map((course: ICourse) => course.createdBy);

        const tutors = await Promise.all(
          tutorIds.map((tutorId: string) => fetchTutorById(tutorId))
        );

        const coursesWithTutors = response.map(
          (course: ICourse, index: number) => ({
            ...course,
            name: course.title,
            tutor: tutors[index]?.name || "Unknown",
          })
        );

        setCourses(coursesWithTutors);
      } catch (error) {
        console.error("error occured", error);
      }
    };
    getCourses();
  }, []);

  const filteredBySearch =
    courses && courses.length > 0
      ? courses.filter((course) =>
          course.title
            ?.toLowerCase()
            .includes((searchQuery || "").toLowerCase())
        )
      : [];

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
    const getCategories = async () => {
      const response: string[] = await fetchCategories();
      const icons: Record<string, string> = {
        Software: "/images/web.png",
        Business: "/images/datascience.png",
        Accounts: "/images/accounts.png",
      };
      const formattedResponse = response.map((cat) => ({
        name: cat,
        icon: icons[cat],
      }));
      setCategories(formattedResponse);
    };
    getCategories();
  }, []);

  const handleSortChange = (
    event: SelectChangeEvent<`${string}_${string}`>
  ) => {
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
        const response = await getWishlist()
        const wishlistData:ICourse[] = Array.isArray(response?.courses)
          ? response.courses
          : [];
        setWishlist(wishlistData.map((course:ICourse) => course._id));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, []);
  

  const handleAddToWishlistHandler = async (
    courseId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!wishlist.includes(courseId)) {
      try {
        await handleAddToWishlist(courseId);

        setWishlist((prev) => [...prev, courseId]);

        setSnackbar(true);
        setSnackbarMessage('Course added to Wishlist')
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };

  const handleRemoveFromWishlistHandler = async (
    courseId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (wishlist.includes(courseId)) {
      try {
        await handleRemoveFromWishlist(courseId);

        setWishlist((prev) => prev.filter((id) => id !== courseId));
        setSnackbar(true)
        setSnackbarMessage("Course removed from Wishlist")
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        paddingLeft: { xs: "0rem", sm: "4rem" },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar}
        onClose={() => setSnackbar(false)}
        autoHideDuration={2000}
        message={snackbarMessage}
      />
      <Box sx={{ display: "flex", direction: "row", justifyContent: "end" }}>
        <FormControl sx={{ width: "8rem", fontSize: "0.9rem", mt: 1 }}>
          <InputLabel sx={{ fontSize: { xs: ".7rem", md: "0.9rem" } }}>
            Category
          </InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
            sx={{
              fontSize: { xs: ".7rem", md: "0.9rem" },
              width: { xs: "7rem", md: "8rem" },
            }}
          >
            <MenuItem
              value=""
              sx={{
                fontSize: { xs: ".7rem", md: "0.9rem" },
                mb: { xs: -2, md: 0 },
                mt: { xs: -2, md: 0 },
              }}
            >
              All
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                value={category.name}
                key={category.name}
                sx={{
                  fontSize: { xs: ".7rem", md: "0.9rem" },
                  mb: { xs: -2, md: 0 },
                  mt: { xs: -2, md: 0 },
                }}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            fontSize: { xs: ".7rem", md: "0.9rem" },
            width: "8rem",
            mt: 1,
            mr: { xs: 2, md: 12 },
            ml: { xs: 0, md: 2 },
          }}
        >
          <InputLabel sx={{ fontSize: { xs: ".7rem", md: "0.9rem" } }}>
            Sort By
          </InputLabel>
          <Select
            value={`${sortBy}_${sortOrder}`}
            onChange={handleSortChange}
            label="Sort By"
            sx={{ fontSize: { xs: ".7rem", md: "0.9rem" } }}
          >
            <MenuItem
              value="price_asc"
              sx={{
                fontSize: { xs: ".7rem", md: "0.9rem" },
                mb: { xs: -2, md: 0 },
                mt: { xs: -2, md: 0 },
              }}
            >
              Price - Low to High
            </MenuItem>
            <MenuItem
              value="price_desc"
              sx={{
                fontSize: { xs: ".7rem", md: "0.9rem" },
                mb: { xs: -2, md: 0 },
                mt: { xs: -2, md: 0 },
              }}
            >
              Price - High to Low
            </MenuItem>
            <MenuItem
              value="title_asc"
              sx={{
                fontSize: { xs: ".7rem", md: "0.9rem" },
                mb: { xs: -2, md: 0 },
                mt: { xs: -2, md: 0 },
              }}
            >
              Title - A to Z
            </MenuItem>
            <MenuItem
              value="title_desc"
              sx={{
                fontSize: { xs: ".7rem", md: "0.9rem" },
                mb: { xs: -2, md: 0 },
                mt: { xs: -2, md: 0 },
              }}
            >
              Title - Z to A
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.2rem", md: "1.8rem" },
            mb: { xs: 0, md: 2 },
          }}
          fontWeight={"bold"}
        >
          Our Courses
        </Typography>

        <Grid container spacing={{ xs: 0, sm: 4, md: 0 }} sx={{ padding: 2 }}>
          {sortedCourses.slice(0, visibleCourses).map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "start", sm: "center" },
                  justifyContent: "center",
                  // ml: { xs: 1.5, sm: 0 },
                  mb: 2,
                  borderRadius: "8px",
                  height: "auto",
                  width: { xs: "100%", sm: "80%" },
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
                    height: { xs: "5rem", sm: "10rem" },
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: 10, sm: 12, md: "1rem" },
                      fontWeight: { xs: 600, md: 700 },
                      padding: { xs: 0, sm: 2 },
                      px: { xs: 1, sm: 2 },
                      pt: { xs: 1, sm: 2 },
                    }}
                  >
                    {course?.title || "name"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6A6F73",
                      paddingLeft: { xs: 1, sm: 2 },
                      fontSize: { xs: 10, sm: 12, md: "1rem" },
                    }}
                  >
                    {course.tutor || "Tutor1"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "darkgray",
                      paddingLeft: { xs: 1, sm: 2 },
                      fontSize: { xs: 10, sm: 12, md: "1rem" },
                      // fontWeight: "medium",
                    }}
                  >
                    {course.category}
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
                        fontSize: { xs: 10, sm: 12, md: "1rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {`${"₹ "}` + course.price || "5000"}
                    </Typography>
                    <Box
                      sx={{
                        color: wishlist.includes(course._id)
                          ? "#ff4081"
                          : "initial",
                        cursor: "pointer",
                        "&:hover": { color: "#ff1744" },
                      }}
                      onClick={(e) => {
                        if (wishlist.includes(course._id)) {
                          handleRemoveFromWishlistHandler(course._id, e);
                        } else {
                          handleAddToWishlistHandler(course._id, e);
                        }
                      }}
                    >
                      {wishlist.includes(course._id) ? (
                        <FavoriteIcon
                          sx={{ pr: 1, fontSize: { xs: "1rem", md: "1.5rem" } }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{ pr: 1, fontSize: { xs: "1rem", md: "1.5rem" } }}
                        />
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
        <Box sx={{ marginTop: { xs: -2, md: 0 }, paddingLeft: 2 }}>
          <Button
            variant="outlined"
            onClick={handleShowMoreCourses}
            sx={{
              color: "black",
              fontWeight: "bold",
              borderColor: "black",
              fontSize: { xs: "0.6rem", sm: "1rem" },
              padding: { xs: "4px 10px", sm: "8px 16px" },
              ml: { xs: 0, sm: 0 },
              mb: { xs: 1, md: 0 },
            }}
          >
            Show More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default OurCourses;
