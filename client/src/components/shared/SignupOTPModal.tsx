import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const SignupOTPModal = ({
  open,
  handleClose,
  email,
}: {
  open: boolean;
  handleClose: () => void;
  email: string;
}) => {
  const [OTP, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setStatus("loading");
      const { data } = await axiosInstance.post("/users/verify-otp", {
        email,
        otp: OTP,
      });
      // console.log("data is ", data);

      console.log("Verfication Success");
      const userRole = data.user.role;
      console.log("user role is ", userRole);

      setSuccessMessage("Verfication Success. Redirecting to login...");
      setStatus("idle");
      setErrorMessage("");
      setTimeout(() => {
        handleClose();
        if (userRole === "user") {
          navigate("/login");
        } else {
          setOpenSnackbar(true);
          // navigate('/tutors/login')
        }
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        (error instanceof AxiosError && error.response?.data?.message) ||
        (error instanceof AxiosError && error.response?.data?.error) ||
        "An unexpected errror occured";
      setErrorMessage(errorMsg);
      console.log("error is", errorMsg);

      setStatus("idle");
    }
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        message="Your Request is under Review. We will get back to you within 24 hours"
        autoHideDuration={600000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "500px", position: "absolute", top: "50%" }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {
              setOpenSnackbar(false);
              navigate("/tutors/login");
            }}
            sx={{
              position: "relative",
              right: "-6px",
              top: "-60px",
              zIndex: 1000,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        }
      />
      <Modal
        open={open}
        // onClose={handleClose}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          "& .MuiModal-backdrop": {
            bgcolor: "white",
          },
        }}
      >
        <Box sx={{ border: "none", outline: "none" }}>
          <Typography variant="h5" textAlign={"center"} gutterBottom>
            Enter the OTP Sent to your email{" "}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            sx={{ mb: 2, mt: 2 }}
            label="OTP"
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
              if (e.target.value !== "") {
                setErrorMessage("");
              }
            }}
          />
          <Box sx={{ mb: 2, height: "10px" }}>
            {errorMessage && (
              <Typography variant="caption" sx={{ color: "red" }}>
                {errorMessage}
              </Typography>
            )}

            {successMessage && (
              <Typography
                variant="caption"
                sx={{ color: "green", display: "flex", alignItems: "center" }}
              >
                {successMessage} <CircularProgress size={14} />
              </Typography>
            )}
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              color="primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Confirming..." : "Verify"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SignupOTPModal;

