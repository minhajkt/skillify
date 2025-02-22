import { useState } from "react";
import {
  Button,
  TextField,
  Avatar,
  CircularProgress,
  Box,
  Typography,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { axiosInstance } from "../../api/axiosInstance";
import {User, updateUser } from "../../store/authSlice";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ProfileModal = ({ user, onClose }: ProfileModalProps) => {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    if (photo) {
      formData.append("profilePhoto", photo);
    }

    try {
      const response = await axiosInstance.put(
        `/users/update-user/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(updateUser(response.data));
      setSuccessSnackbar(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        p: { xs: 0, md: 4 },
        width: "100%",
        maxWidth: 480,
        mx: { xs: 0, md: "auto" },
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="600"
        // mb={3}
        sx={{
          color: "black",
          textAlign: "center",
          mb: { xs: 1, md: 3 },
          mt: { xs: 1, md: 0 },
        }}
      >
        Profile
      </Typography>

      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ mb: { xs: 1, md: 3 } }}
      />

      <Box
        display="flex"
        alignItems="center"
        gap={3}
        p={2}
        borderRadius={1}
        sx={{ mb: { xs: 1, md: 4 } }}
      >
        <Avatar
          src={photo ? URL.createObjectURL(photo) : user?.profilePhoto}
          sx={{
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            border: 2,
            borderColor: "primary.main",
          }}
        />
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="profile-photo-input"
          />
          <label htmlFor="profile-photo-input">
            <Button
              variant="contained"
              component="span"
              sx={{
                textTransform: "none",
                px: { xs: 1, md: 3 },
              }}
            >
              Change Photo
            </Button>
          </label>
        </Box>
      </Box>

      {error && (
        <Typography color="error" mb={2} fontSize="0.875rem">
          {error}
        </Typography>
      )}

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="contained"
          onClick={handleSaveProfile}
          disabled={isLoading}
          sx={{
            flex: { md: 1 },
            py: { md: 1.5 },
            height: { xs: "2rem", md: "auto" },
            width: { xs: "10rem", md: "auto" },
            mx:{xs:1.5,md:0},
            mb:{xs:2,md:0}
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            flex: { md: 1 },
            py: { md: 1.5 },
            height: { xs: "2rem", md: "auto" },
            width: { xs: "10rem", md: "auto" },
          }}
        >
          Cancel
        </Button>
        <Snackbar
          open={successSnackbar}
          onClose={() => setSuccessSnackbar(false)}
          autoHideDuration={2000}
          message="Profile updated successfully!"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ zIndex: 3000 }}
        />
      </Box>
    </Box>
  );
};

export default ProfileModal;
