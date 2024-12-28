import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../api/authApi";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import SignupOTPModal from "./SignupOTPModal";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      confirmPassword !== ""
    ) {
      setErrorMessage("");
    }
  }, [name, email, password, confirmPassword]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        setStatus('loading')
      const userData = await signupUser(name, email, password, confirmPassword);
      if (userData) {
        setEmailForOtp(email);
        setIsOtpModalOpen(true);
      }
      console.log("userData is ", userData);
      setErrorMessage("");
      setStatus('idle')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      console.error("Error in logging in", error);
      setStatus('idle')
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
            provides you with an exceptional option to learn and upskill without
            any problems. You can learn at your own pace from your comfort zone.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "left",
              flexDirection: "column",
            }}
          ></Box>
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
            }}
            gutterBottom
          >
            Join Skillify
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 0 }}>
            Sign up to start your amazing learning journey <br />
            with{" "}
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>{" "}
          </Typography>
          {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}

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
                to="/login"
                style={{ textDecoration: "none", color: "#1e90ff" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
          <Typography variant="subtitle2" marginTop={1}>
            <span style={{ color: "grey" }}>--------- </span>Or{" "}
            <span style={{ color: "grey" }}>--------- </span>
          </Typography>
          <Button
            variant="outlined"
            startIcon={
              <img
                src="/images/search.png"
                alt="Google logo"
                style={{ height: "20px", width: "20px", paddingLeft: "10px" }}
              />
            }
            sx={{
              maxWidth: 400,
              width: { xs: "10%", sm: "40%" },
              height: "8%",
              marginTop: 1,
              borderRadius: "24px",
              borderColor: "grey",
              bgcolor: "#f0f0f0",
            }}
          >
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Sign in with Google
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
