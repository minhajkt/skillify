/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { googleSignIn, signupUser } from "../../api/authApi";
import { Box, Grid, Typography, TextField, Button, } from "@mui/material";
import SignupOTPModal from "../shared/SignupOTPModal";
import { Formik, Form, Field } from "formik";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { SignupSchema } from "../../schemas/schemas";


const Signup = () => {
  const navigate = useNavigate()
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [otpSent, setOtpSent] = useState(false);
  

    const handleGoogleSuccess = async (
      credentialResponse: CredentialResponse
    ) => {
      try {
        if (credentialResponse.credential) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const userData = await googleSignIn(credentialResponse.credential);
          navigate("/home");
        }
      } catch (error) {
        setErrorMessage("Your account is temporarily suspended");
      }
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSignup = async (values: any) => {
    try {
      const { name, email, password, confirmPassword } = values;
      setStatus("loading");
      const userData = await signupUser(name, email, password, confirmPassword);
      if (userData) {
        setEmailForOtp(email);
        setIsOtpModalOpen(true);
        setOtpSent(true)
      }
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      if(error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  };

  return (
    <Box>
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        <SignupOTPModal
          open={isOtpModalOpen}
          handleClose={() => setIsOtpModalOpen(false)}
          email={emailForOtp}
          setOtpSent={setOtpSent}
          otpSent={otpSent}
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
            // marginLeft: { xs: 7, sm: 0 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "start",
              display: "block",
              fontSize: { xs: "1.6rem", sm: "2rem" },
              pt: 4,
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
          <Box sx={{ minHeight: "20px" }}>
            <Typography variant="caption" color="red">
              {errorMessage || "\u00A0"}
            </Typography>
          </Box>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
            validateOnMount={true}
          >
            {({ isSubmitting, touched, errors, isValid }) => (
              <Form>
                <Box component="div" sx={{ width: "100%", maxWidth: 400 }}>
                  <Field
                    name="name"
                    as={TextField}
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    sx={{
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name ? errors.name : " "}
                  />

                  <Field
                    name="email"
                    as={TextField}
                    label="Email address"
                    variant="outlined"
                    fullWidth
                    sx={{
                      marginTop: 0,
                      marginBottom: 0,
                    }}
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
                      touched.password && errors.password
                        ? errors.password
                        : " "
                    }
                  />

                  <Field
                    name="confirmPassword"
                    as={TextField}
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    sx={{
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : " "
                    }
                  />

                  <Box display={"flex"} justifyContent={"center"}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 1, width: "30%" }}
                      type="submit"
                      disabled={isSubmitting || !isValid || status === "loading"}
                    >
                      {isSubmitting || status === "loading"
                        ? "Signing up..."
                        : "Sign up"}
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
              </Form>
            )}
          </Formik>

          <Typography variant="subtitle2" marginTop={1}>
            <span style={{ color: "grey" }}>--------- </span>Or{" "}
            <span style={{ color: "grey" }}>--------- </span>
          </Typography>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            theme="outline"
            shape="pill"
            size="large"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
