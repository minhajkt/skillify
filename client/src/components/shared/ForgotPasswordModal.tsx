import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { AxiosError } from "axios";

const ForgotPasswordModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    try {
      setStatus("loading");
      await axiosInstance.post("/users/forgot-password", { email });
      setSuccessMessage("Reset link sent to your email");
      setStatus("idle");
      setErrorMessage("");
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        (error instanceof AxiosError && error.response?.data?.message) ||
        "An unexpected errror occured";
      setErrorMessage(errorMsg);
      setStatus("idle");
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 350, md: 400 },
          boxShadow: 24,
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          "& .MuiModal-backdrop": {
            bgcolor: "white",
          },
        }}
      >
        <Box sx={{ border: "none", outline: "none" }}>
          <Typography variant="h5" textAlign={"center"} gutterBottom>
            Reset Password{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your registered email address to recieve a password reset link{" "}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            sx={{ mb: 0 }}
            label="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
              <Typography variant="caption" sx={{ color: "green" }}>
                {successMessage}
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
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;
