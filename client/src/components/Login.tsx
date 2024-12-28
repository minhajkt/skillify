import { useEffect, useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(email !== '' || password !== '') {
        setErrorMessage(null)
    }
  }, [email, password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null)
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        navigate("/home");
      }
      console.log("userData is ", userData);

    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error("Error in logging in", error);
            setErrorMessage(error.message)
        }else {
            setErrorMessage('An unexpected error occured')
        }
    }
  };
  return (
    <Grid container sx={{ height: "100vh", width: "100%" }}>
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
          <span style={{ color: "#999999", fontWeight: "bold" }}>Skillify</span>{" "}
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
          marginLeft:{xs:7, sm:0}
        }}
      >
        <Typography
          variant="h3"
          sx={{ textAlign: "start", display: "block", fontSize:{xs:"1.6rem", sm:"2rem"} }}
          gutterBottom
        >
          Skillify Login
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "start",
            alignItems: "start",
          }}
        >
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Log in to continue your learning process <br /> with{" "}
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>
          </Typography>
        </Box>

        {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}

        <Box sx={{ minHeight: "20px" }}>
          <Typography variant="caption" color="red">
            {errorMessage || "\u00A0"}
          </Typography>
        </Box>

        <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            sx={{ marginTop: 0 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2, marginBottom: 1 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Typography
            variant="body2"
            textAlign="end"
            sx={{ marginBottom: 1, color: "#1e90ff", cursor: "pointer" }}
            onClick={handleOpenModal}
          >
            Forgot password?
          </Typography>

          <ForgotPasswordModal
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
          <Box display={"flex"} justifyContent={"center"}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 1, width: "30%" }}
              onClick={handleLogin}
            >
              Log In
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" marginTop={2}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "#1e90ff" }}
            >
              Create free account
            </Link>
          </Typography>
        </Box>
        <Typography variant="subtitle2" marginTop={2}>
          <span style={{ color: "grey" }}>--------- </span>Or{" "}
          <span style={{ color: "grey" }}>--------- </span>
        </Typography>
        <Button
          variant="outlined"
          startIcon={
            <img
              src="/images/search.png"
              alt="Google logo"
              style={{ height: "20px", width: "20px", paddingLeft:"10px"}}
            />
          }
          sx={{
            maxWidth: 400,
            width: {xs:"10%",sm:"40%"},
            height: "8%",
            marginTop: 1,
            borderRadius: "24px",
            borderColor: "grey",
            bgcolor: "#f0f0f0",
          }}
        >
            <Typography variant="body2" sx={{display:{xs:"none", sm:'block'}}}>
          Sign in with Google
            </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
