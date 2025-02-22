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
  CircularProgress,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { createCourse, fetchCategories } from "../../api/courseApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../types/types";
import Navbar from "../shared/Navbar";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { ICreateCourse } from "../../types/types";
import { CreateCourseSchema } from "../../schemas/schemas";
import { tutorRecievable } from "../../api/paymentsApi";

interface AuthState {
  user: IUser | null;
}

interface RootState {
  auth: AuthState;
}

const CreateCourseSection = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const tutor = useSelector((state: RootState) => state.auth.user);
  const tutorId = tutor?._id;
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payments, setPayments] = useState<[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fecthTutorsPayment = async (tutorId: string) => {
      const data = await tutorRecievable(tutorId);
      setPayments(data);
    };
    if (tutorId) {
      fecthTutorsPayment(tutorId);
    }
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories();
      setCategories(response);
    };
    getCategories();
  }, []);

  const navigate = useNavigate();

  const handleCreateCourse = async (
    values: ICreateCourse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { setSubmitting, setErrors }: FormikHelpers<ICreateCourse>
  ) => {
    setErrorMessage("");
    const { title, description, category, price, thumbnail } = values;

    if (!tutorId) {
      setErrorMessage("Tutor ID is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price.toString());
    formData.append("createdBy", tutorId);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setStatus("loading");
      const response = await createCourse(formData);
      const courseId = response?.newCourse?._id;
      navigate(`/tutors/add-lecture/${courseId}`);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setStatus("");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minWidth: "100vw", bgcolor: "#f1f5f9", py: {xs:3,md:6} }}>
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <Box sx={{ maxWidth: "900px", mx: "auto", mt: 6, px: { xs: 1, md: 0 } }}>
        <Card
          sx={{
            bgcolor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 1, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: {xs:1,md:2},
                fontWeight: "bold",
                color: "#1e293b",
                textAlign: "center",
                fontSize:{xs:20,md:32}
              }}
            >
              Create a New Course
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: {xs:2,md:4}, textAlign: "center", 
              fontSize:{xs:12,md:16}
             }}
            >
              Share your knowledge and inspire learners by creating a compelling
              course.
            </Typography>

            <Formik
              initialValues={{
                title: "",
                description: "",
                category: "select",
                price: "",
                thumbnail: null as File | null,
              }}
              validationSchema={CreateCourseSchema}
              onSubmit={handleCreateCourse}
            >
              {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                <Form>
                  {errorMessage && (
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#FFECEC",
                        border: "1px solid #F87171",
                        borderRadius: 2,
                        mb: 3,
                      }}
                    >
                      <Typography color="error">{errorMessage}</Typography>
                    </Paper>
                  )}

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Field
                      name="title"
                      as={TextField}
                      label="Course Title"
                      variant="outlined"
                      fullWidth
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                    />

                    <Field
                      name="description"
                      as={TextField}
                      label="Course Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Field
                            name="category"
                            as={Select}
                            label="Category"
                            error={touched.category && Boolean(errors.category)}
                          >
                            <MenuItem value="select" disabled>
                              Select a category
                            </MenuItem>
                            {categories.map((cat) => (
                              <MenuItem key={cat} value={cat}>
                                {cat}
                              </MenuItem>
                            ))}
                          </Field>
                          {touched.category && errors.category && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 1 }}
                            >
                              {errors.category}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field
                          name="price"
                          as={TextField}
                          type="number"
                          label="Price"
                          variant="outlined"
                          fullWidth
                          error={touched.price && Boolean(errors.price)}
                          helperText={touched.price && errors.price}
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
                          border: "2px dashed #cbd5e1",
                          borderRadius: 4,
                          "&:hover": {
                            bgcolor: "#f1f5f9",
                          },
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            setFieldValue(
                              "thumbnail",
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                          accept="image/*"
                        />
                        <Box sx={{ textAlign: "center" }}>
                          {values.thumbnail ? (
                            <Typography variant="body2" color="text.secondary">
                              {values.thumbnail?.name}
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
                      {touched.thumbnail && errors.thumbnail && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.thumbnail}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 4,
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting || status === "loading"}
                      sx={{
                        px: {xs:2,md:5},
                        py: {xs:1,md:1.5},
                        borderRadius: 4,
                        bgcolor: "#2563eb",
                        fontSize:{xs:12,md:14},
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "#1e40af",
                        },
                      }}
                    >
                      {status === "loading" ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Create Course"
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreateCourseSection;
