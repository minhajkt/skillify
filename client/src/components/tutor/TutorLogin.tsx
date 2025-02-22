import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginTutor } from "../../api/authApi";
import ForgotPasswordModal from "../shared/ForgotPasswordModal";
import { Formik, Form, Field } from "formik";
import { LoginSchema } from "../../schemas/schemas";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const TutorLogin = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
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
    return <Navigate to={"/tutors/home"} />;
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { email, password } = values;
      const userData = await loginTutor(email, password);
      if (userData) {
        navigate("/tutors/home");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occured");
      }
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
          provides you with an exceptional platform to share your knowledge and
          expertise.You can teach at your own pace and connect with learners
          from around the globe—all from the comfort of your space.
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
          mt:{xs:-10, md:0}
          // marginLeft: { xs: 7, sm: 0 },
        }}
      >
        <Typography
          variant="h3"
          // sx={{
          //   textAlign: "start",
          //   display: "block",
          //   fontSize: { xs: "1.6rem", sm: "2rem" },
          // }}
          // gutterBottom
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
            Log in to continue your teaching process <br /> with{" "}
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>
          </Typography>
        </Box>

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
                  sx={{
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={
                    touched.password && errors.password ? errors.password : " "
                  }
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
            to="/tutors/signup"
            style={{ textDecoration: "none", color: "#1e90ff" }}
          >
            Create free account
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TutorLogin;
