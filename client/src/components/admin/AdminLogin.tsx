import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/authApi";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import ForgotPasswordModal from "../shared/ForgotPasswordModal";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (email !== "" || password !== "") {
      setErrorMessage(null);
    }
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const userData = await loginAdmin(email, password);
      if (userData) {
        navigate("/admin");
      }
      console.log("userData is ", userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in logging in", error);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occured");
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
          alignItems="center"
          textAlign="start"
          gutterBottom
          sx={{ paddingTop: 25 }}
        >
          Skillify Admin Login
        </Typography>
        <Typography
          variant="h6"
          textAlign="start"
          sx={{ marginBottom: 4, color: "#2563EB" }}
        >
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
          Skillify Admin Login
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
            Log in to continue to dashboard <br /> of{" "}
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminLogin;
