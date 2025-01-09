import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createCourse, fetchCategories } from "../../api/courseApi";
import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";

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
    <Box>
      <Typography
        variant="h3"
        sx={{
          textAlign: "start",
          display: "block",
          fontSize: { xs: "1.6rem", sm: "2rem" },
          marginTop: { xs: 5, sm: 0, md: 7 },
        }}
        gutterBottom
      >
        Create Course
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 0 }}>
        Please fill all the fields to continue
      </Typography>

      <Box sx={{ minHeight: "20px" }}>
        <Typography variant="caption" color="red">
          {errorMessage || "\u00A0"}
        </Typography>
      </Box>

      <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ marginTop: 1 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth sx={{ marginTop: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
        {/* <TextField
          label="Category"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/**"
          onChange={handleFileChange}
          style={{ marginTop: "1rem", width: "100%" }}
        />

        <Box display={"flex"} justifyContent={"center"}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1, width: "30%" }}
            onClick={handleCreateCourse}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading" : "Continue"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateCourseSection;
