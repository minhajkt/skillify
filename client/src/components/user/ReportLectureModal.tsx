import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { postReport } from "../../api/courseApi";
import { ReportLectureModalProps } from "../../types/types";


const ReportLectureModal: React.FC<ReportLectureModalProps> = ({
  open,
  onClose,
  courseId,
  lectureId,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [reportDescription, setReportDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (!reportDescription.trim()) {
      setErrorMessage("Please enter a description of the issue.");
      return;
    }

    const reportData = {
      courseId,
      lectureId,
      reportDescription,
      userId: user?._id || "",
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await postReport(reportData);
      
      setSuccessMessage("Report submitted successfully!");
      setReportDescription("");
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Failed to submit the report.");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    width: "80%",
    maxWidth: "500px",
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Report an Issue
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Describe the issue"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          {errorMessage && (
            <Typography color="error" variant="caption">
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Report
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={!!successMessage}
        message={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      />
      <Snackbar
        open={!!errorMessage}
        message={errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      />
    </>
  );
};

export default ReportLectureModal;
