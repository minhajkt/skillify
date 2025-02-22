import { useEffect, useState } from "react";
import { loginUser, googleSignIn } from "../../api/authApi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import ForgotPasswordModal from "../shared/ForgotPasswordModal";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Formik, Form, Field } from "formik";
import { LoginSchema } from "../../schemas/schemas";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("logoutSuccess") === "true") {
      setOpenSnackbar(true);
      localStorage.removeItem("logoutSuccess");
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to={"/home"} />;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setErrorMessage(null);
    try {
      const { email, password } = values;
      const userData = await loginUser(email, password);
      if (userData) {
        localStorage.setItem("loginSuccess", "true");
        navigate("/home");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (credentialResponse.credential) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userData = await googleSignIn(credentialResponse.credential);
        navigate("/home");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Your account is temporarily suspended");
    }
  };

  return (
    <Grid container sx={{ height: "100vh", width: "100%" }}>
      <Snackbar
        open={openSnackbar}
        message="Logout successful!"
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 2000 }}
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
        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
          Welcome to our community
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ marginBottom: 4 }}>
          <span style={{ color: "#999999", fontWeight: "bold" }}>Skillify</span>{" "}
          provides you with an exceptional option to learn and upskill without
          any problems. You can learn at your own pace from your comfort zone.
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
        }}
      >
        <Typography variant="h3" gutterBottom>
          Skillify Login
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Log in to continue your learning process <br /> with{" "}
          <span style={{ color: "#999999", fontWeight: "bold" }}>Skillify</span>
        </Typography>

        <Box sx={{ minHeight: "20px" }}>
          <Typography variant="caption" color="red">
            {errorMessage || "\u00A0"}
          </Typography>
        </Box>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
          validateOnMount={true}
        >
          {({ errors, touched, isSubmitting, isValid }) => (
            <Form>
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email address"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 0, marginBottom: 0 }}
                  error={touched.email && Boolean(errors.email)}
                  helperText={
                    touched.email && errors.email ? errors.email : " "
                  }
                />
                <Field
                  name="password"
                  as={TextField}
                  type="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 0, marginBottom: 0 }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={
                    touched.password && errors.password ? errors.password : " "
                  }
                />

                <Typography
                  variant="body2"
                  textAlign="end"
                  sx={{
                    marginBottom: 1,
                    color: "#1e90ff",
                    cursor: "pointer",
                    fontSize: { xs: 10, md: 14 },
                  }}
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
                    type="submit"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? "..." : "Log In"}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>

        <Typography variant="body2" textAlign="center" marginTop={2}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ textDecoration: "none", color: "#1e90ff" }}
          >
            Create free account
          </Link>
        </Typography>

        <Typography variant="subtitle2" marginTop={2}>
          <span style={{ color: "grey" }}>--------- </span>Or{" "}
          <span style={{ color: "grey" }}>--------- </span>
        </Typography>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage("Google sign in failed")}
          theme="outline"
          shape="pill"
          size="large"
        />
      </Grid>
    </Grid>
  );
};

export default Login;
