/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
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
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = async () => {
    try {
      // await logoutUser();
      dispatch(logout());
      console.log("logged out");
      navigate("/login");
    } catch (error) {
      console.log(error);
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
      <Paper
        sx={{
          width: { xs: 150, sm: 200, md: 240 },
          p: { xs: 1, sm: 2 },
          display: "flex",
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
          <ListItem
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
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Payments"
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
