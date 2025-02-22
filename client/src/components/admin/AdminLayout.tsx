/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Book as CourseIcon,
  Person as TutorIcon,
  School as StudentIcon,
  Assignment as RequestIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      // await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f0f0f0",
        mt: { xs: "64px", md: "80px" },
      }}
    >
      <Navbar />
      <IconButton
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 15,
          right: 50,
          zIndex: 1300,
        }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 200,
          },
        }}
      >
        <List>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/dashboard")
              setMobileOpen(false)
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/courses")
              setMobileOpen(false)
            }}
          >
            <ListItemIcon>
              <CourseIcon />
            </ListItemIcon>
            <ListItemText
              primary="Courses"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/tutors")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <TutorIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tutors"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/students")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <StudentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Students"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/tutor-requests")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <RequestIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tutor Requests"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/course-requests")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <RequestIcon />
            </ListItemIcon>
            <ListItemText
              primary="Course Requests"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/pending-payments")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Payments Pending"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {navigate("/admin/payments-history")
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Payment History"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => {handleLogout()
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>
      <Paper
        sx={{
          width: { xs: 0, sm: 200, md: 240 }, 
          p: { xs: 0, sm: 2 },
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          bgcolor: "#FAFAFA",
        }}
      >
        <List>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/courses")}
          >
            <ListItemIcon>
              <CourseIcon />
            </ListItemIcon>
            <ListItemText
              primary="Courses"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/tutors")}
          >
            <ListItemIcon>
              <TutorIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tutors"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/students")}
          >
            <ListItemIcon>
              <StudentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Students"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/tutor-requests")}
          >
            <ListItemIcon>
              <RequestIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tutor Requests"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/course-requests")}
          >
            <ListItemIcon>
              <RequestIcon />
            </ListItemIcon>
            <ListItemText
              primary="Course Requests"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          {/* <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/course-complaints")}
          >
            <ListItemIcon>
              <RequestIcon />
            </ListItemIcon>
            <ListItemText
              primary="Course Complaints"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem> */}
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/pending-payments")}
          >
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Payments Pending"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => navigate("/admin/payments-history")}
          >
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Payment History"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            component="li"
            onClick={() => handleLogout()}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                },
              }}
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ flex: 1, p: 3, bgcolor: "#ffffff" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
