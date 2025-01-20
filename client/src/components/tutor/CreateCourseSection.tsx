// import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Paper,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { createCourse, fetchCategories } from "../../api/courseApi";
import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import Navbar from "../shared/Navbar";

interface AuthState {
  user: User | null;
}

interface RootState {
  auth: AuthState;
}

const CreateCourseSection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const tutor = useSelector((state: RootState) => state.auth.user);
  const tutorId = tutor?._id;

  useEffect(() => {
    if (title !== "" || description !== "" || price !== "" || category !== "") {
      setErrorMessage("");
    }
  }, [title, description, price, category]);

  useEffect(() => {
    const getCategories = async() => {
        const response = await fetchCategories()
        setCategories(response)
    }
    getCategories()
  }, [])

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
      setThumbnail(files[0]);
  }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!title) {
      setErrorMessage("Title is required");
      return;
    } else if (!description) {
      setErrorMessage("Description is required");
      return;
    } else if (!category || category.includes('select')) {
      setErrorMessage("Select a Category");
      return;
    } else if (!price) {
      setErrorMessage("Price is required ");
      return;
    }else if(!thumbnail) {
        setErrorMessage('Thumbnail is required')
        return
    }

    if (!tutorId) {
      setErrorMessage("Tutor ID is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("createdBy", tutorId);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // const courseData = {title, description,category,thumbnail: "default-thumbnail.jpg", price: Number(price), createdBy: tutorId}
    try {
      setStatus("loading");
      const response = await createCourse(formData);
      // console.log("Course created successfully:", response);
      // console.log("responsedata:", response.newCourse);
      const courseId = response?.newCourse?._id;
      // console.log("Course id: ", courseId);
      navigate(`/tutors/add-lecture/${courseId}`);
    } catch (error) {
      setErrorMessage((error as Error).message);
      console.log(error);
    }finally {
        setStatus('')
    }
  };

  return (
    <Box sx={{ minWidth: "90vw", bgcolor: "#f8fafc", p: { xs: 4, md: 8 } }}>
      <Navbar />
      <Box sx={{ maxWidth: "800px", mx: "auto", mt:"54px" }}>
        <Card sx={{ bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{ mb: 2, fontWeight: "bold", color: "#1e293b" }}
            >
              Create New Course
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Share your knowledge by creating a comprehensive course.
            </Typography>

            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {errorMessage && (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#FFF5F5",
                    border: "1px solid #FED7D7",
                    borderRadius: 1,
                  }}
                >
                  <Typography color="error">{errorMessage}</Typography>
                </Paper>
              )}

              <TextField
                fullWidth
                label="Course Title"
                variant="outlined"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ borderRadius: 2 }}
              />

              <TextField
                fullWidth
                label="Course Description"
                placeholder="Describe your course content and learning outcomes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="select" disabled>
                        Select a category
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price"
                    placeholder="Set your course price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Course Thumbnail
                </Typography>
                <Paper
                  variant="outlined"
                  component="label"
                  sx={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "#f8fafc",
                    border: "2px dashed #e2e8f0",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                    },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <Box sx={{ textAlign: "center" }}>
                    {thumbnail ? (
                      <Typography variant="body2" color="text.secondary">
                        File selected
                      </Typography>
                    ) : (
                      <>
                        <UploadIcon
                          sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }}
                        />
                        <Typography color="text.secondary">
                          Click to upload course thumbnail
                        </Typography>
                      </>
                    )}
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleCreateCourse}
                  disabled={status === "loading"}
                  sx={{
                    width: { xs: "100%", md: "auto" },
                    minWidth: { md: 200 },
                    borderRadius: 2,
                    bgcolor: "#2563eb",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                  }}
                >
                  {status === "loading" ? "Loading..." : "Create Course"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>

    // <Box>
    //   <Typography
    //     variant="h3"
    //     sx={{
    //       textAlign: "start",
    //       display: "block",
    //       fontSize: { xs: "1.6rem", sm: "2rem" },
    //       marginTop: { xs: 5, sm: 0, md: 7 },
    //     }}
    //     gutterBottom
    //   >
    //     Create Course
    //   </Typography>
    //   <Typography variant="body1" sx={{ marginTop: 0 }}>
    //     Please fill all the fields to continue
    //   </Typography>

    //   <Box sx={{ minHeight: "20px" }}>
    //     <Typography variant="caption" color="red">
    //       {errorMessage || "\u00A0"}
    //     </Typography>
    //   </Box>

    //   <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
    //     <TextField
    //       label="Title"
    //       variant="outlined"
    //       fullWidth
    //       sx={{ marginTop: 1 }}
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //     />
    //     <TextField
    //       label="Description"
    //       variant="outlined"
    //       fullWidth
    //       multiline
    //       rows={4}
    //       sx={{ marginTop: 1 }}
    //       value={description}
    //       onChange={(e) => setDescription(e.target.value)}
    //     />
    //     <FormControl fullWidth sx={{ marginTop: 1 }}>
    //       <InputLabel>Category</InputLabel>
    //       <Select
    //         label="Category"
    //         value={category}
    //         onChange={(e) => setCategory(e.target.value)}
    //       >
    //         <MenuItem value="select" disabled>
    //           Select a category
    //         </MenuItem>
    //         {categories.map((cat) => (
    //           <MenuItem key={cat} value={cat}>
    //             {cat}
    //           </MenuItem>
    //         ))}
    //       </Select>
    //     </FormControl>

    //     <TextField
    //       label="Price"
    //       variant="outlined"
    //       fullWidth
    //       sx={{ marginTop: 1 }}
    //       value={price}
    //       onChange={(e) => setPrice(e.target.value)}
    //     />

    //     <input
    //       type="file"
    //       accept="image/**"
    //       onChange={handleFileChange}
    //       style={{ marginTop: "1rem", width: "100%" }}
    //     />

    //     <Box display={"flex"} justifyContent={"center"}>
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         sx={{ marginTop: 1, width: "30%" }}
    //         onClick={handleCreateCourse}
    //         disabled={status === "loading"}
    //       >
    //         {status === "loading" ? "Loading" : "Continue"}
    //       </Button>
    //     </Box>
    //   </Box>
    // </Box>
  );
};

export default CreateCourseSection;
