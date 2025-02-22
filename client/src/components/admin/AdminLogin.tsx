import {  useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/authApi";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import ForgotPasswordModal from "../shared/ForgotPasswordModal";
import { Formik, Form, Field } from "formik";
import { LoginSchema } from "../../schemas/schemas";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";



const AdminLogin = () => {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const navigate = useNavigate();


    if (isAuthenticated) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    setErrorMessage(null);
    try {
      const { email, password } = values;
      const userData = await loginAdmin(email, password);
      if (userData) {
        navigate("/admin");
      }
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
          marginLeft: { xs: 0, sm: 0 },
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
                    touched.password && errors.password ? errors.password : ""
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
      </Grid>
    </Grid>
  );
};

export default AdminLogin;
