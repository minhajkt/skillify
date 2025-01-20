import { Box, Button, IconButton, Paper, Snackbar, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { addLecture } from "../../api/lectureApi";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const AddLecture = () => {
  const [lectures, setLectures] = useState([
    { title: "", description: "", duration: "", order: "", videoFile : null },
  ]);
  const [expandedLectureIndex, setExpandedLectureIndex] = useState<number | null>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [openSnackbar, setOpenSnackbar] = useState(false);  

  const { courseId } = useParams();
  const navigate = useNavigate();


  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedLectures = [...lectures];
    updatedLectures[index] = { ...updatedLectures[index], [field]: value };
    setLectures(updatedLectures);
    if (errorMessage) setErrorMessage("");
  };

  const toggleLectureExpansion = (index: number) => {
  setExpandedLectureIndex((prev) => (prev === index ? null : index));
  };

  const handleAddLectureField = () => {
      const isLastLectureComplete = lectures.every(
        (lecture) =>
          lecture.title &&
          lecture.description &&
          lecture.duration &&
          lecture.order &&
          lecture.videoFile
      );

      if (!isLastLectureComplete) {
        setErrorMessage(
          "Please fill all fields in the previous lecture before adding a new one."
        );
        return;
      }
    setLectures([
      ...lectures,
      { title: "", description: "", duration: "", order: "", videoFile: null },
    ]);
    setExpandedLectureIndex(lectures.length);
  };

  const handleRemoveLectureField = (index: number) => {
    const updatedLectures = lectures.filter((_, idx) => idx !== index);
    setLectures(updatedLectures);
  };

  const handleAddLectures = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!courseId) {
      setErrorMessage("Course ID is missing. Please go back.");
      return;
    }

    // const lecturesData = lectures.map((lecture) => ({
    //   ...lecture,
    //   duration: Number(lecture.duration),
    //   order: Number(lecture.order),
    //   courseId: courseId!,
    // }));

    for (const lecture of lectures) {
      if (!lecture.title) {
        setErrorMessage("Title is required");
        return;
      } else if (!lecture.description) {
        setErrorMessage("Description is required");
        return;
      } else if (!lecture.duration || isNaN(lecture.duration)) {
        setErrorMessage("Duration is required and has to be a number");
        return;
      } else if (!lecture.order || isNaN(lecture.order)) {
        setErrorMessage("Order is required and has to be a number");
        return;
      } else if (!lecture.videoFile) {
        setErrorMessage("Video is required");
        return;
      } 

    }

    try {
      setStatus("loading");

    const formData = new FormData();
    // lectures.forEach((lecture, index) => {
    //   formData.append("title", lecture.title);
    //   formData.append("description", lecture.description);
    //   formData.append("duration", lecture.duration.toString());
    //   formData.append("order", lecture.order.toString());
    //   formData.append("courseId", courseId);
    //   formData.append('videoFile', lecture.videoFile);

    //   console.log(`VideoFile`, lecture.videoFile);

    // });  

    
 

      const lecturesData = lectures.map((lecture) => ({
        title: lecture.title,
        description: lecture.description,
        duration: Number(lecture.duration),
        order: Number(lecture.order),
        courseId: courseId,
      }));

      formData.append("lectures", JSON.stringify(lecturesData));    
      
      lectures.forEach((lecture) => {
        formData.append("videoFiles", lecture.videoFile);
      });    

    
    // lectures.forEach((lecture, index) => {
    //   formData.append("videoFiles", lecture.videoFile);
    // });
        
    // lectures.forEach((lecture, idx) => {
    //   formData.append(`lectures[${idx}][title]`, lecture.title);
    //   formData.append(`lectures[${idx}][description]`, lecture.description);
    //   formData.append(`lectures[${idx}][duration]`, lecture.duration.toString());
    //   formData.append(`lectures[${idx}][order]`, lecture.order.toString());
    //   formData.append(`lectures[${idx}][videoFile]`, lecture.videoFile);
    //   formData.append(`lectures[${idx}][courseId]`, courseId);
    // });      
      
    const response = await addLecture(formData); 
      console.log("Lectures added successfully:", response);
      setOpenSnackbar(true);
    // setTimeout(() => {
    //   navigate(`/tutors/courses`); 
    // }, 20000);
    } catch (error) {
      setErrorMessage((error as Error).message);
      console.error(error);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 4, sm: 6 },mx:45 }}>
      
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

      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.8rem", sm: "2rem" },
          mb: 2,
          color: "#1e293b",
        }}
      >
        Add Lectures
      </Typography>

      <Typography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
        Please fill all the fields to add a lecture to your course.
      </Typography>

      <Box
        component="form"
        sx={{
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
        }}
        onSubmit={handleAddLectures}
      >
        {errorMessage && (
          // <Paper
          //   sx={{
          //     padding: 2,
          //     backgroundColor: "#FFF5F5",
          //     border: "1px solid #FED7D7",
          //     borderRadius: 1,
          //     marginBottom: 2,
          //   }}
          // >
          <Box sx={{ minHeight: "20px" }}>
            <Typography variant="caption" color="error">{errorMessage}</Typography>
          </Box>
          // </Paper>
        )}

        {lectures.map((lecture, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            {expandedLectureIndex !== index ? (
              <Box
                onClick={() => toggleLectureExpansion(index)}
                sx={{
                  cursor: "pointer",
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  marginBottom: 2,
                  backgroundColor: "#f8fafc",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Lecture {index + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Title: {lecture.title || "Not Provided"}
                </Typography>
              </Box>
            ) : (
              <Box>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  value={lecture.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ marginTop: 1 }}
                  value={lecture.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                />
                <TextField
                  label="Duration"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  value={lecture.duration}
                  onChange={(e) =>
                    handleInputChange(index, "duration", e.target.value)
                  }
                />
                <TextField
                  label="Order"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 1 }}
                  value={lecture.order}
                  onChange={(e) =>
                    handleInputChange(index, "order", e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "videoFile",
                      e.target.files?.[0] || null
                    )
                  }
                  style={{ marginTop: "8px", width: "100%" }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveLectureField(index)}
                  sx={{
                    marginTop: 1,
                    width: "100%",
                    borderRadius: 1,
                    fontWeight: "bold",
                  }}
                >
                  Remove Lecture
                </Button>
              </Box>
            )}
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLectureField}
          sx={{
            marginTop: 2,
            width: "100%",
            borderRadius: 2,
            padding: "12px 24px",
            fontWeight: "bold",
          }}
        >
          Add Lecture
        </Button>

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
            onClick={handleAddLectures}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
    // <Box>
    //   <Snackbar
    //     open={openSnackbar}
    //     message="Your Course Request is under Review. We will get back to you within 24 hours"
    //     autoHideDuration={600000}
    //     onClose={() => setOpenSnackbar(false)}
    //     anchorOrigin={{ vertical: "top", horizontal: "center" }}
    //     sx={{ width: "500px", position: "absolute", top: "50%" }}
    //     action={
    //       <IconButton
    //         size="small"
    //         color="inherit"
    //         onClick={() => {
    //           setOpenSnackbar(false);
    //           navigate(`/tutors/courses`);
    //         }}
    //         sx={{
    //           position: "relative",
    //           right: "-6px",
    //           top: "-60px",
    //           zIndex: 1000,
    //           color: "white",
    //         }}
    //       >
    //         <CloseIcon />
    //       </IconButton>
    //     }
    //   />
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
    //     Add Lectures
    //   </Typography>

    //   <Typography variant="body1" sx={{ marginTop: 0 }}>
    //     Please fill all the fields to add a lecture
    //   </Typography>

    //   {/* <Box sx={{ minHeight: "20px" }}>
    //     <Typography variant="caption" color="red">
    //       {errorMessage || "\u00A0"}
    //     </Typography>
    //   </Box> */}

    //   <Box
    //     component="form"
    //     sx={{ width: "100%", maxWidth: 400 }}
    //     onSubmit={handleAddLectures}
    //   >
    //     <Box sx={{ minHeight: "20px" }}>
    //       <Typography variant="caption" color="red">
    //         {errorMessage || "\u00A0"}
    //       </Typography>
    //     </Box>
    //     {lectures.map((lecture, index) => (
    //       <Box key={index} sx={{ marginBottom: 2 }}>
    //         {expandedLectureIndex !== index ? (
    //           <Box
    //             onClick={() => toggleLectureExpansion(index)}
    //             sx={{
    //               cursor: "pointer",
    //               padding: 2,
    //               border: "1px solid #ddd",
    //               borderRadius: "4px",
    //               marginBottom: 2,
    //             }}
    //           >
    //             <Typography variant="h6">Lecture {index + 1}</Typography>
    //             <Typography variant="body1">
    //               Title: {lecture.title || "Not Provided"}
    //             </Typography>
    //             {/* <Typography variant="body1">
    //               Description: {lecture.description || "Not Provided"}
    //             </Typography>
    //             <Typography variant="body1">
    //               Duration: {lecture.duration || "Not Provided"}
    //             </Typography>
    //             <Typography variant="body1">
    //               Order: {lecture.order || "Not Provided"}
    //             </Typography> */}
    //           </Box>
    //         ) : (
    //           // Expanded View
    //           <Box>
    //             <TextField
    //               label="Title"
    //               variant="outlined"
    //               fullWidth
    //               sx={{ marginTop: 1 }}
    //               value={lecture.title}
    //               onChange={(e) =>
    //                 handleInputChange(index, "title", e.target.value)
    //               }
    //             />
    //             <TextField
    //               label="Description"
    //               variant="outlined"
    //               fullWidth
    //               multiline
    //               rows={4}
    //               sx={{ marginTop: 1 }}
    //               value={lecture.description}
    //               onChange={(e) =>
    //                 handleInputChange(index, "description", e.target.value)
    //               }
    //             />
    //             <TextField
    //               label="Duration"
    //               variant="outlined"
    //               fullWidth
    //               sx={{ marginTop: 1 }}
    //               value={lecture.duration}
    //               onChange={(e) =>
    //                 handleInputChange(index, "duration", e.target.value)
    //               }
    //             />
    //             <TextField
    //               label="Order"
    //               variant="outlined"
    //               fullWidth
    //               sx={{ marginTop: 1 }}
    //               value={lecture.order}
    //               onChange={(e) =>
    //                 handleInputChange(index, "order", e.target.value)
    //               }
    //             />
    //             <input
    //               type="file"
    //               accept="video/*"
    //               onChange={(e) =>
    //                 handleInputChange(
    //                   index,
    //                   "videoFile",
    //                   e.target.files?.[0] || null
    //                 )
    //               }
    //             />
    //             <Button
    //               variant="outlined"
    //               color="secondary"
    //               onClick={() => handleRemoveLectureField(index)}
    //               sx={{ marginTop: 1 }}
    //             >
    //               Remove Lecture
    //             </Button>
    //           </Box>
    //         )}
    //       </Box>
    //     ))}

    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={handleAddLectureField}
    //       sx={{ marginTop: 2 }}
    //     >
    //       Add Lecture
    //     </Button>

    //     <Box display={"flex"} justifyContent={"center"}>
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         sx={{ marginTop: 1, width: "30%" }}
    //         onClick={handleAddLectures}
    //         disabled={status === "loading"}
    //       >
    //         {status === "loading" ? "Loading" : "Submit"}
    //       </Button>
    //     </Box>
    //   </Box>
    // </Box>
  );
};

export default AddLecture;
