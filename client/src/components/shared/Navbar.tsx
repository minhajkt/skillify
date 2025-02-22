/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState, store } from "../../store/store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../store/authSlice";
import ProfileModal from "./ProfileModal";
import { socket } from "../../utils/socket";
import { fetchStudentById, fetchTutorById } from "../../api/adminApi";
import Notification from "../chat/Notification";
import { logoutUser } from "../../api/authApi";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface Message {
  senderId: string;
  recipientId: string;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const { tutorId, studentId } = useParams<{
    tutorId?: string;
    studentId?: string;
  }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSenderId, setNotificationSenderId] = useState<
    string | null
  >(null);
  const senderId = user?._id;
  const isTutor = user?.role === "tutor";
  const recipientId = isTutor ? studentId : tutorId;
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [notificationSenderRole, setNotificationSenderRole] = useState<
    "tutor" | "user" | null
  >(null);

  const dispatch = useDispatch();
  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE1(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorE1(null);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await persistor.flush();
      persistor.purge();
      await logoutUser();

      localStorage.setItem("logoutSuccess", "true");
      if (user?.role === "tutor") {
        navigate("/tutors/login");
      } else if (user?.role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const handleReceiveMessage = async (msg: Message) => {
      if (msg.senderId !== user._id && msg.recipientId === user._id) {
        try {
          let senderData;
          if (user.role === "tutor") {
            senderData = await fetchStudentById(msg.senderId);

            setNotificationSenderRole("user");
          } else {
            senderData = await fetchTutorById(msg.senderId);
            setNotificationSenderRole("tutor");
          }

          setNotificationSenderId(msg.senderId);
          setNotificationMessage(
            `New message from ${senderData?.name || "Someone"}`
          );
          setOpenNotification(true);
        } catch (error) {
          console.error("Failed to fetch sender details:", error);
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user]);

  const handleNotificationClose = () => {
    setOpenNotification(false);
  };

  const handleNotificationClick = () => {
    if (notificationSenderId) {
      if (user?.role === "user") {
        navigate(`/messages/${notificationSenderId}`);
      } else {
        navigate(`/tutors/contacts/${notificationSenderId}`);
      }
      setOpenNotification(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        height: { xs: "64px", md: "80px" },
        padding: "8px",
        bgcolor: "white",
        zIndex: 1000,
      }}
    >
      <Notification
        open={openNotification}
        message={notificationMessage}
        onClose={handleNotificationClose}
        onClick={handleNotificationClick}
      />
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          component={"img"}
          src="/images/skillify-high-resolution-logo__1_-removebg-preview - Copy.png"
          alt="Skillify Logo"
          onClick={() => {
            if (user?.role === "user" || !user) {
              navigate("/home");
            } else if (user?.role === "tutor") {
              navigate("/tutors/home");
            } else if (user?.role === "admin") {
              navigate("/admin/dashboard");
            }
          }}
          sx={{
            height: { xs: "14px", md: "26px" },
            width: { xs: "70px", md: "120px" },
            paddingLeft: { xs: "0rem", md: "3rem" },
            ml: { xs: -2, md: 0 },
            cursor: "pointer",
            mr: { xs: 1, md: 0 },
          }}
        ></Box>
        {user?.role !== "admin" && user?.role !== "tutor" ? (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={onSearchChange}
            sx={{
              borderRadius: "24px",
              backgroundColor: "#f9f9f9",
              width: { xs: "33%", md: "50%" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "24px",
              },
              "& .MuiInputBase-input::placeholder": {
                fontSize: { xs: "small", md: "medium" },
              },
              mr: { xs: 1, md: 0 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      height: { xs: 0, md: "40px" },
                      ml: { xs: -2.5, md: 0 },
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Box></Box>
        )}

        <Box display="flex" alignItems="center" gap={2}>
          {!user && (
            <Typography
              variant="body2"
              color="black"
              sx={{
                cursor: "pointer",
                fontWeight: { xs: 400, md: 500 },
                fontSize: { xs: 10, md: 14 },
                display: { xs: "block", md: "block" },
                textAlign: "center",
              }}
              component={Link}
              to="/tutors/home"
            >
              Teach on Skillify
            </Typography>
          )}
          {user?.role === "user" || !user ? (
            <Typography
              variant="body2"
              color="black"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                display: { xs: "none", md: "block" },
              }}
            ></Typography>
          ) : null}

          {token ? (
            <Box>
              <IconButton
                onClick={handleOpenMenu}
                sx={{
                  height: { xs: "1.5rem", md: "2.5rem" },
                  width: { xs: "1.5rem", md: "2.5rem" },
                }}
              >
                <Avatar
                  src={user?.profilePhoto || ""}
                  sx={{
                    height: { xs: "1.5rem", md: "2.5rem" },
                    width: { xs: "1.5rem", md: "2.5rem" },
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorE1}
                open={Boolean(anchorE1)}
                onClose={handleCloseMenu}
                sx={{
                  mt: 1,
                  ml: { xs: 1, md: 0 },
                  "& .MuiPaper-root": {
                    borderRadius: "5px",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <IconButton
                    sx={{
                      height: { xs: "1.8rem", md: "2.5rem" },
                      width: { xs: "1.8rem", md: "2.5rem" },
                    }}
                  >
                    <Avatar
                      src={user?.profilePhoto || ""}
                      sx={{
                        height: { xs: "1.8rem", md: "2.5rem" },
                        width: { xs: "1.8rem", md: "2.5rem" },
                        mt: { xs: -2, md: 0 },
                        ml: 1,
                      }}
                    />
                  </IconButton>
                  <Box ml={1} display="flex" flexDirection="column">
                    <MenuItem
                      sx={{
                        fontWeight: { xs: "medium", md: "bold" },
                        fontSize: { xs: "small", md: "medium" },
                        mb: { xs: -3, md: 0 },
                        mt: { xs: -2, md: 0 },
                        pb: 0,
                        pl: 0.5,
                      }}
                    >
                      {user?.name}
                    </MenuItem>
                    <MenuItem sx={{ pt: 0, pl: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: { xs: 0, md: 1 },
                          fontSize: { xs: "small", md: "medium" },
                        }}
                      >
                        {user?.email}
                      </Typography>
                    </MenuItem>
                  </Box>
                </Box>
                <Box
                  component="hr"
                  sx={{ border: "1px solid #ECF2F0,", mt: { xs: 0, md: 0 } }}
                ></Box>

                <MenuItem
                  onClick={handleOpenModal}
                  sx={{
                    fontSize: { xs: "small", md: "medium" },
                    mt: { xs: -2, md: 0 },
                  }}
                >
                  Profile
                </MenuItem>
                {user?.role === "user" ? (
                  <MenuItem
                    onClick={() => navigate("/users/my-courses")}
                    sx={{
                      fontSize: { xs: "small", md: "medium" },
                      mt: { xs: -3, md: 0 },
                    }}
                  >
                    My Learning
                  </MenuItem>
                ) : user?.role === "tutor" ? (
                  <MenuItem
                    onClick={() => navigate("/tutors/courses")}
                    sx={{
                      fontSize: { xs: "small", md: "medium" },
                      mt: { xs: -3, md: 0 },
                    }}
                  >
                    My Courses
                  </MenuItem>
                ) : null}
                <Box
                  component="hr"
                  sx={{ border: "1px solid #ECF2F0,", mt: { xs: -1, md: 0 } }}
                ></Box>
                {user?.role === "user" ? (
                  <>
                    <MenuItem
                      onClick={() => navigate("/messages")}
                      sx={{
                        fontSize: { xs: "small", md: "medium" },
                        mt: { xs: -2, md: 0 },
                      }}
                    >
                      Messages
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate("/wishlist")}
                      sx={{
                        fontSize: { xs: "small", md: "medium" },
                        mt: { xs: -3, md: 0 },
                      }}
                    >
                      Wishlist
                    </MenuItem>
                  </>
                ) : user?.role === "tutor" ? (
                  <>
                    <MenuItem
                      onClick={() => navigate("/tutors/create-course")}
                      sx={{
                        fontSize: { xs: "small", md: "medium" },
                        mt: { xs: -2, md: 0 },
                      }}
                    >
                      Create Course
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate("/tutors/contacts")}
                      sx={{
                        fontSize: { xs: "small", md: "medium" },
                        mt: { xs: -3, md: 0 },
                      }}
                    >
                      Messages
                    </MenuItem>
                  </>
                ) : null}
                {user?.role === "tutor" ? (
                  <MenuItem
                    onClick={() => navigate("/tutors/payment/:tutorId")}
                    sx={{
                      fontSize: { xs: "small", md: "medium" },
                      mt: { xs: -3, md: 0 },
                    }}
                  >
                    Payments
                  </MenuItem>
                ) : null}
                <Box
                  component="hr"
                  sx={{ border: "1px solid #ECF2F0,", mt: { xs: -1, md: 0 } }}
                ></Box>
                <MenuItem
                  onClick={() => handleLogout()}
                  sx={{
                    fontSize: { xs: "small", md: "medium" },
                    mt: { xs: -2, md: 0 },
                    mb: { xs: -2, md: 0 },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box display={"flex"} justifyContent="center" alignItems="center">
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  margin: 0,
                  borderColor: "black",
                  px: { xs: 0, md: 2 },
                  fontSize: { xs: 10, md: 14 },
                  ml: { xs: -1, md: 0 },
                }}
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "black",
                  // display: { xs: "block" },
                  "&:hover": { backgroundColor: "#333" },
                  ml: { xs: 1, md: 2 },
                  mr: { xs: -2, md: 0 },
                  px: { xs: 0, md: 2 },
                  fontSize: { xs: 10, md: 14 },
                }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
      {modalOpen && user && (
        <ProfileModal user={user} onClose={handleCloseModal} />
      )}
    </AppBar>
  );
};

export default Navbar;
