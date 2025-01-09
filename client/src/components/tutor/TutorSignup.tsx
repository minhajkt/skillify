import React from "react";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { signupTutor } from "../../api/authApi";
import { Link } from "react-router-dom";
import SignupOTPModal from "../shared/SignupOTPModal";

const TutorSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [certificates, setCertificates] = useState<FileList | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (
      name !== "" ||
      email !== "" ||
      password !== "" ||
      confirmPassword !== "" ||
      bio !== "" ||
      certificates
    ) {
      setErrorMessage("");
    }
  }, [name, email, password, confirmPassword, bio, certificates]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    // if (!name || !email || !password || !confirmPassword) {
    //   setErrorMessage("All fields except bio and certificates are required!");
    //   return;
    // }

    // if(!bio) {
    //    setErrorMessage("Please provide a description of you");
    //    return;
    // }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      setStatus("loading");

      const userData = await signupTutor(
        name,
        email,
        password,
        confirmPassword,
        bio || "",
        certificates
      );

      if (userData) {
        // setOpenSnackbar(true);
        setEmailForOtp(email);
        setIsOtpModalOpen(true);
      }
      setErrorMessage("");
      setStatus("idle");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setStatus("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCertificates(files);
    }
  };

  return (
    <Box>
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        <SignupOTPModal
          open={isOtpModalOpen}
          handleClose={() => setIsOtpModalOpen(false)}
          email={emailForOtp}
        />
        {/* <Snackbar
          open={openSnackbar}
          message="Your Request is under Review. We will get back to you within 24 hours"
          autoHideDuration={600000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "500px", position: "absolute" }}
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
        /> */}

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#2563EB",
            color: "white",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            px: 18,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            textAlign="start"
            gutterBottom
          >
            Welcome to our community
          </Typography>
          <Typography variant="h6" textAlign="start" sx={{ marginBottom: 4 }}>
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>{" "}
            provides you with an exceptional platform to share your knowledge
            and expertise. You can teach at your own pace and connect with
            learners from around the globe—all from the comfort of your space.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            marginLeft: { xs: 7, sm: 0 },
          }}
        >
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
            Join Skillify
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 0 }}>
            Sign up to start your amazing teaching journey <br />
            with{" "}
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>
          </Typography>

          <Box sx={{ minHeight: "20px" }}>
            <Typography variant="caption" color="red">
              {errorMessage || "\u00A0"}
            </Typography>
          </Box>

          <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              sx={{ marginTop: 1 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              sx={{ marginTop: 1 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ marginTop: 1 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ marginTop: 1 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TextField
              label="Bio"
              variant="outlined"
              type="text"
              fullWidth
              sx={{ marginTop: 1 }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              multiple
              style={{ marginTop: "1rem" }}
            />

            <Box display={"flex"} justifyContent={"center"}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "30%" }}
                onClick={handleSignup}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Signing up" : "Sign up"}
              </Button>
            </Box>

            <Typography variant="body2" textAlign="center" marginTop={1}>
              Already have an account?{" "}
              <Link
                to="/tutors/login"
                style={{ textDecoration: "none", color: "#1e90ff" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TutorSignup;
