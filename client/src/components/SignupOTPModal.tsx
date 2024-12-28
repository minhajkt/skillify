import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


const SignupOTPModal = ({
  open,
  handleClose,
  email
}: {
  open: boolean;
  handleClose: () => void;
  email: string
}) => {
  const [OTP, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      setStatus("loading");
      await axiosInstance.post("/users/verify-otp", {email, otp:OTP});
      console.log("Verfication Success");
      setSuccessMessage("Verfication Success. Redirecting to login...");
      setStatus("idle");
      setErrorMessage("");
      setTimeout(() => {
        handleClose();
        navigate('/login')
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

export default SignupOTPModal