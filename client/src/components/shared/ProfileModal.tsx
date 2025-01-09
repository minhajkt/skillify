import { useState } from "react";
import {
  Button,
  TextField,
  Avatar,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { axiosInstance } from "../../api/axiosInstance";
import { updateUser } from "../../store/authSlice";

interface User {
  _id: string;
  name: string;
  profilePhoto: string;
}

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ProfileModal = ({ user, onClose }: ProfileModalProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  console.log("userdataaaaaa is", token);

  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log("Profile updated:", response.data);
      onClose();
    } catch (err) {
      setError("Failed to update profile");
      console.error("Error updating profile", err);
      console.log("id of user", user._id);
      console.log("res", {
        url: `/users/update-user/${user?._id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        formData,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 4,
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="600"
        mb={3}
        sx={{ color: "black", textAlign: "center" }}
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
        sx={{ mb: 3 }}
      />

      <Box
        display="flex"
        alignItems="center"
        gap={3}
        mb={4}
        p={2}
        // bgcolor="grey.30"
        borderRadius={1}
      >
        <Avatar
          src={photo ? URL.createObjectURL(photo) : user?.profilePhoto}
          sx={{
            width: 80,
            height: 80,
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
                px: 3,
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
            flex: 1,
            py: 1.5,
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            flex: 1,
            py: 1.5,
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>

    // <Box sx={{ bgcolor: "yellow" }}>
    //   <h2>Update Profile</h2>

    //   <TextField
    //     label="Name"
    //     variant="outlined"
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //     fullWidth
    //     margin="normal"
    //   />

    //   <Box display="flex" alignItems="center" gap={2}>
    //     <Avatar
    //       src={photo ? URL.createObjectURL(photo) : user?.profilePhoto}
    //       sx={{ width: 56, height: 56 }}
    //     />
    //     <input
    //       type="file"
    //       accept="image/*"
    //       onChange={handleFileChange}
    //       style={{ display: "none" }}
    //       id="profile-photo-input"
    //     />
    //     <label htmlFor="profile-photo-input">
    //       <Button variant="outlined" component="span">
    //         Change Photo
    //       </Button>
    //     </label>
    //   </Box>

    //   {error && <p style={{ color: "red" }}>{error}</p>}

    //   <Button
    //     variant="contained"
    //     onClick={handleSaveProfile}
    //     disabled={isLoading}
    //     sx={{ marginTop: 2 }}
    //   >
    //     {isLoading ? <CircularProgress size={24} /> : "Save Profile"}
    //   </Button>
    //   <Button variant="outlined" onClick={onClose} sx={{ marginRight: 2, marginTop: 2}}>
    //     Cancel
    //   </Button>
    // </Box>
  );
};

export default ProfileModal;
