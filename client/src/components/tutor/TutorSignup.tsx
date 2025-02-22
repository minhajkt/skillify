import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signupTutor } from "../../api/authApi";
import { Link } from "react-router-dom";
import SignupOTPModal from "../shared/SignupOTPModal";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { ITutorSignupValues } from "../../types/types";
import { TutorSignupSchema } from "../../schemas/schemas";

const TutorSignup = () => {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSignup = async (
    values: ITutorSignupValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { setSubmitting, setErrors }: FormikHelpers<ITutorSignupValues>
  ) => {
    try {
      const { name, email, password, confirmPassword, bio, certificates } =
        values;

      const userData = await signupTutor(
        name,
        email,
        password,
        confirmPassword,
        bio,
        certificates
      );

      if (userData) {
        setEmailForOtp(email);
        setIsOtpModalOpen(true);
        setOtpSent(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setGeneralError(error.message);
      }
    } finally {
      setSubmitting(false);
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
            Sign up to start your amazing teaching journey <br />
            with{" "}
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              Skillify
            </span>
          </Typography>
          {generalError && (
            <Typography variant="caption" color="error">
              {generalError}
            </Typography>
          )}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              bio: "",
              certificates: null as FileList | null,
            }}
            validationSchema={TutorSignupSchema}
            onSubmit={handleSignup}
            validateOnMount={true}
          >
            {({ errors, touched, setFieldValue, isSubmitting, isValid }) => (
              <Form>
                <Box sx={{ width: "100%", maxWidth: 400 }}>
                  <Field
                    name="name"
                    as={TextField}
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    sx={{
                      marginTop: 0,
                      marginBottom: "0",
                    }}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name ? errors.name : " "}
                  />
                  <Field
                    name="email"
                    as={TextField}
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    sx={{
                      marginTop: 0,
                      marginBottom: "0",
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
                      marginBottom: "0",
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
                      marginBottom: "0",
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
                  <Field
                    name="bio"
                    as={TextField}
                    label="Bio"
                    variant="outlined"
                    // multiline
                    fullwidth
                    sx={{
                      marginTop: 0,
                      marginBottom: "0",
                    }}
                    rows={2}
                    fullWidth
                    error={touched.bio && Boolean(errors.bio)}
                    helperText={touched.bio && errors.bio ? errors.bio : " "}
                  />
                  <input
                    name="certificates"
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) =>
                      setFieldValue("certificates", e.target.files)
                    }
                  />
                  {touched.certificates && errors.certificates && (
                    <Typography variant="caption" color="error">
                      {errors.certificates}
                    </Typography>
                  )}

                  <Box display={"flex"} justifyContent={"center"}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 1, width: "30%" }}
                      type="submit"
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "..." : "Sign up"}
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
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TutorSignup;
