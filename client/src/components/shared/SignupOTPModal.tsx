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
import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const SignupOTPModal = ({
  open,
  handleClose,
  email,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOtpSent,
  otpSent
}: {
  open: boolean;
  handleClose: () => void;
  email: string;
  setOtpSent:  React.Dispatch<React.SetStateAction<boolean>>;
  otpSent: boolean;
}) => {
  const [OTP, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); 
  const [canResend, setCanResend] = useState(false);

useEffect(() => {
  let interval: NodeJS.Timeout;
  if (otpSent && timer > 0) {
    interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
  } else if(otpSent && timer < 1){
    setCanResend(true);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
}, [timer, otpSent]);

  const handleSubmit = async () => {
    try {
      setStatus("loading");
      const { data } = await axiosInstance.post("/users/verify-otp", {
        email,
        otp: OTP,
      });

      const userRole = data.user.role;

      setSuccessMessage("Verfication Success. Redirecting to login...");
      setStatus("idle");
      setErrorMessage("");
      setTimeout(() => {
        handleClose();
        if (userRole === "user") {
          navigate("/login");
        } else {
          setOpenSnackbar(true);
        }
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        (error instanceof AxiosError && error.response?.data?.message) ||
        (error instanceof AxiosError && error.response?.data?.error) ||
        "An unexpected errror occured";
      setErrorMessage(errorMsg);

      setStatus("idle");
    }
  };

    const handleResendOtp = async () => {
      try {
        setErrorMessage('')
        setCanResend(false); 
        setTimer(60); 
        setSuccessMessage("A new OTP has been sent to your email.");
        await axiosInstance.post("/users/resend-otp", { email }); 
            setTimeout(() => {
              setSuccessMessage("");
            }, 2000);
      } catch (error: unknown) {
        const errorMsg =
          (error instanceof AxiosError && error.response?.data?.message) ||
          "Failed to resend OTP.";
        setErrorMessage(errorMsg);
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
        sx={{ width: {xs:350, md:"500px"}, position: "absolute", top: "50%" }}
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
          position: {md:"absolute"},
          top: {md:"50%"},
          left: {md:"50%"},
          transform: {md:"translate(-50%, -50%)"},
          width: {xs:350,md:400},
          boxShadow: 24,
          p: {xs:2,md:4},
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
          <Box textAlign="center"  sx={{ display: "flex", flexDirection: "column", alignItems: "center",mt:1 }}>
            <Typography variant="caption">Resend OTP in {timer}s</Typography>
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={!canResend}
              sx={{ textTransform: "none", marginTop: 0 }}
            >
              Resend OTP
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SignupOTPModal;

