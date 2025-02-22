/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategories,
  fetchCourseDetails,
  getComplaints,
  updateCourseDetails,
} from "../../api/courseApi";
import { useSelector } from "react-redux";

import { Formik, Form, Field, FormikHelpers } from "formik";
import Navbar from "../../components/shared/Navbar";
import { EditCourseSchema } from "../../schemas/schemas";
import { IEditCourse } from "../../types/types";


const EditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const tutor = useSelector((state: any) => state.auth.user);
  const tutorId = tutor?._id;

  const navigate = useNavigate();
    useEffect(() => {
      const getReports = async () => {
        try {
          await getComplaints(); 
        } catch (error) {
          setErrorMessage("Error occurred");
        }
      };
  
      getReports();
    }, []);
  

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories();
      setCategories(response);
    };
    const getCourseData = async () => {
      if (courseId) {
        const response = await fetchCourseDetails(courseId);
        setCourse(response);
      }
    };
    getCategories();
    getCourseData();
  }, [courseId]);

  const handleEditCourse = async (
    values: IEditCourse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { setSubmitting, setErrors }: FormikHelpers<IEditCourse>
  ) => {
    setErrorMessage("");
    const { title, description, category, price, thumbnail } = values;
    if(!courseId) {
      setErrorMessage("Course ID is missing")
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

    if (thumbnail && thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      
      setStatus("loading");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await updateCourseDetails(courseId, formData);
      navigate(`/tutor/${courseId}/edit-lecture`);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setStatus("");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minWidth: "100vw", bgcolor: "#f1f5f9", py: { xs: 3, md: 6 } }}>
      <Navbar />

      <Box sx={{ maxWidth: "900px", mx: "auto", mt: 6, px: { xs: 1, md: 0 } }}>
        <Card
          sx={{
            bgcolor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: { xs: 1, md: 2 },
                fontWeight: "bold",
                color: "#1e293b",
                textAlign: "center",
                fontSize: { xs: 20, md: 32 },
              }}
            >
              Edit Course
            </Typography>

            {course && (
              <Formik
                initialValues={{
                  title: course.title,
                  description: course.description,
                  category: course.category,
                  price: course.price,
                  thumbnail: course.thumbnail || null,
                }}
                validationSchema={EditCourseSchema}
                onSubmit={handleEditCourse}
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
                        error={
                          touched.description && Boolean(errors.description)
                        }
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
                              error={
                                touched.category && Boolean(errors.category)
                              }
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {values.thumbnail instanceof File
                                  ? values.thumbnail.name
                                  : typeof values.thumbnail === "string"
                                  ? "Current thumbnail: " +
                                    values.thumbnail.split("/").pop()
                                  : "Current thumbnail"}
                              </Typography>
                            ) : (
                              <UploadIcon
                                sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }}
                              />
                            )}
                          </Box>
                        </Paper>
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
                          px: 5,
                          py: 1.5,
                          borderRadius: 4,
                          bgcolor: "#2563eb",
                          fontWeight: "bold",
                          "&:hover": {
                            bgcolor: "#1e40af",
                          },
                        }}
                      >
                        {status === "loading" ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Update Course"
                        )}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditCourse;
