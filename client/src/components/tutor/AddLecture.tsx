/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CircularProgress, IconButton, Paper, Snackbar, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { addLecture } from "../../api/lectureApi";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field, FormikHelpers, FieldArray } from "formik";
import { Lecture, FormValues } from "../../types/types";
import {lectureSchema ,formSchema } from "../../schemas/schemas";



const AddLecture = () => {

  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false);  
  const [currentLectureError, setCurrentLectureError] = useState("");

  const { courseId } = useParams();
  const navigate = useNavigate();
const validateCurrentLecture = (lecture: any) => {
  if (
    !lecture.title ||
    !lecture.description ||
    !lecture.duration ||
    !lecture.order ||
    !lecture.videoFile
  ) {
    return "Please fill all the fields before adding a new lecture.";
  }
  return "";
};

  const handleAddLectures = async (values: any) => {
    setIsSubmitting(true)
    setErrorMessage("");
    setCurrentLectureError("");
    if (!courseId) {
      setErrorMessage("Course ID is missing. Please go back.");
      return;
    }
    const currentLectureError = validateCurrentLecture(
      values.lectures[values.lectures.length - 1]
    );
    if (currentLectureError) {
      setCurrentLectureError(currentLectureError);
      return; 
    }
    try {
      setStatus("loading");

    const formData = new FormData();

      const lecturesData = values.lectures.map((lecture:any) => ({
        title: lecture.title,
        description: lecture.description,
        duration: Number(lecture.duration),
        order: Number(lecture.order),
        courseId: courseId,
      }));

      formData.append("lectures", JSON.stringify(lecturesData));    
      
      values.lectures.forEach((lecture:any) => {
        formData.append("videoFiles", lecture.videoFile);
      });       
      
    const response = await addLecture(formData); 
      // console.log("Lectures added successfully:", response);
      setOpenSnackbar(true);

    } catch (error) {
      setErrorMessage((error as Error).message);
      console.error(error);
    } finally {
      setStatus("idle");
      setIsSubmitting(false)
    }
  };

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        minWidth: "100vw",
        bgcolor: "#f8fafc",
        p: { xs: 4, sm: 6 },
        // mx: 45,
      }}
    >
      <Snackbar
        open={openSnackbar}
        message="Your Course Request is under Review. We will get back to you within 24 hours"
        autoHideDuration={600000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: "500px",
          position: "absolute",
          top: "10%",
          zIndex: 9999,
        }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {
              setOpenSnackbar(false);
              navigate(`/tutors/courses`);
            }}
            sx={{
              color: "white",
              position: "relative",
              right: "-6px",
              top: "-4px",
              zIndex: 1000,
            }}
          >
            <CloseIcon />
          </IconButton>
        }
      />

      <Box>
        <Formik<FormValues>
          initialValues={{
            lectures: [
              {
                title: "",
                description: "",
                duration: "",
                order: "",
                videoFile: null,
              },
            ],
          }}
          validationSchema={formSchema}
          onSubmit={handleAddLectures}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            touched,
            errors,
            isSubmitting,
          }) => (
            <Form>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  mx: "auto",
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 4,
                }}
                // onSubmit={handleAddLectures}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.8rem", sm: "2rem" },
                    mb: 2,
                    color: "#1e293b",
                    textAlign: "center",
                  }}
                >
                  Add Lectures
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ color: "#6b7280", mb: 3, textAlign: "center" }}
                >
                  Please fill all the fields to add a lecture to your course.
                </Typography>
                {currentLectureError && (
                  <Box sx={{ minHeight: "20px", color: "error.main", mb: 2 }}>
                    <Typography variant="caption">
                      {currentLectureError}
                    </Typography>
                  </Box>
                )}
                {errorMessage && (
                  <Box sx={{ minHeight: "20px" }}>
                    <Typography variant="caption" color="error">
                      {errorMessage}
                    </Typography>
                  </Box>
                  // </Paper>
                )}

                <FieldArray name="lectures">
                  {({ insert, remove, push }) => (
                    <Box>
                      {values.lectures.map((lecture, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                          <Field
                            name={`lectures[${index}].title`}
                            render={({ field }: any) => (
                              <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  marginTop: 0,
                                  marginBottom: 0,
                                }}
                                {...field}
                                error={
                                  touched.lectures?.[index]?.title &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  Boolean(errors.lectures?.[index]?.title)
                                }
                                helperText={
                                  touched.lectures?.[index]?.title &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  errors.lectures?.[index]?.title
                                    ? errors.lectures?.[index]?.title
                                    : " "
                                }
                              />
                            )}
                          />
                          <Field
                            name={`lectures[${index}].description`}
                            render={({ field }: any) => (
                              <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  marginTop: 0,
                                  marginBottom: 0,
                                }}
                                {...field}
                                error={
                                  touched.lectures?.[index]?.description &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  Boolean(errors.lectures?.[index]?.description)
                                }
                                helperText={
                                  touched.lectures?.[index]?.description &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  errors.lectures?.[index]?.description
                                    ? errors.lectures?.[index]?.description
                                    : " "
                                }
                              />
                            )}
                          />
                          <Field
                            name={`lectures[${index}].duration`}
                            render={({ field }: any) => (
                              <TextField
                                label="Duration"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  marginTop: 1,
                                  marginBottom: 0,
                                }}
                                {...field}
                                error={
                                  touched.lectures?.[index]?.duration &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  Boolean(errors.lectures?.[index]?.duration)
                                }
                                helperText={
                                  touched.lectures?.[index]?.duration &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  errors.lectures?.[index]?.duration
                                    ? errors.lectures?.[index]?.duration
                                    : " "
                                }
                              />
                            )}
                          />
                          <Field
                            name={`lectures[${index}].order`}
                            render={({ field }: any) => (
                              <TextField
                                label="Order"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  marginTop: 0,
                                  marginBottom: 0,
                                }}
                                {...field}
                                error={
                                  touched.lectures?.[index]?.order &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  Boolean(errors.lectures?.[index]?.order)
                                }
                                helperText={
                                  touched.lectures?.[index]?.order &&
                                  typeof errors.lectures?.[index] === "object" &&
                                  errors.lectures?.[index]?.order
                                    ? errors.lectures?.[index]?.order
                                    : " "
                                }
                              />
                            )}
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              setFieldValue(
                                `lectures[${index}].videoFile`,
                                e.target.files?.[0]
                              )
                            }
                            style={{ marginTop: "8px", width: "100%" }}
                          />
                          {touched.lectures?.[index]?.videoFile &&
                          typeof errors.lectures?.[index] === "object" &&
                            errors.lectures?.[index]?.videoFile && (
                              <Typography variant="caption" color="error">
                                {errors.lectures[index].videoFile
                                  ? errors.lectures[index].videoFile
                                  : " "}
                              </Typography>
                            )}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => remove(index)}
                            sx={{
                              marginTop: 0,
                            }}
                          >
                            Remove Lecture
                          </Button>{" "}
                        </Box>
                      ))}
                      <br />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const currentLectureError = validateCurrentLecture(
                            values.lectures[values.lectures.length - 1]
                          );
                          if (currentLectureError) {
                            setCurrentLectureError(currentLectureError);
                          } else {
                            push({
                              title: "",
                              description: "",
                              duration: "",
                              order: "",
                              videoFile: null,
                            });
                          }
                        }}
                        sx={{ marginTop: 2 }}
                      >
                        Add Lecture
                      </Button>
                    </Box>
                  )}
                </FieldArray>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "30%",
                      borderRadius: 2,
                      padding: "12px 24px",
                      fontWeight: "bold",
                    }}
                    // onClick={handleAddLectures}
                    type="submit"
                    disabled={isSubmitting || status === "loading"}
                  >
                    {status === "loading" ? "Loading..." : "Submit"}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
        {isSubmitting && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1301,
            }}
          >
            <CircularProgress sx={{ color: "white" }} size={80} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddLecture;

