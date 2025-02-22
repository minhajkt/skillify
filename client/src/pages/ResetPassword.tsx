import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { AxiosError } from "axios";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const {token} = useParams();
    const navigate = useNavigate()

   const handleSubmit = async() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await axiosInstance.post('/users/reset-password',
                {token : token,
                newPassword : newPassword,
                confirmNewPassword: confirmNewPassword
                })
                setSuccessMessage('Password reset Successful. Redirecting to login ...')
                setTimeout(() =>{
                    navigate('/login')
                }, 2000)
        } catch (error) {
            if(error instanceof AxiosError) {
                const errorMsg =
                  error.response?.data?.message ||
                  error.response?.data?.error ||
                  error.response?.data?.errors[0].msg || error
                setErrorMessage(errorMsg)
            }else {
                console.log("An unexpected error occured",error);
            }
        }
    }
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: 350, md: 400 },
        boxShadow: 24,
        p: {xs:2,md:4},
        borderRadius: 2,
        "& .MuiModal-backdrop": {
          bgcolor: "white",
        },
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
        Reset your Password
      </Typography>
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        label="Enter your new Password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setErrorMessage("");
        }}
      />
      <TextField
        fullWidth
        label="Re enter your new Password"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value);
          setErrorMessage("");
        }}
      />
      <Box>
        <Box sx={{ height: "30px" }}>
          {errorMessage && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errorMessage}
            </Typography>
          )}

          {successMessage && (
            <Typography variant="caption" sx={{ color: "green" }}>
              {successMessage}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={handleSubmit}>
            Reset Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
