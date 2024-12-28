
import { AppBar, Avatar, Box, Button, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { useEffect, useState } from "react";
// import { logoutUser } from "../api/authApi";
import { logout } from "../store/authSlice";
const Navbar = () => {
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)
  console.log('tokn ies', token);
  console.log('user is ', user);

  const dispatch = useDispatch()
  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE1(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorE1(null)
  }
  useEffect(() => {
    console.log("Current Redux state:", store.getState());
  }, []);
    const handleLogout = async() => {
        try {
            // await logoutUser();
            dispatch(logout())
            console.log('logged out');
            navigate('/login')
            
        } catch (error) {
            console.log(error);
        }
    }

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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          // display="flex"
          // alignItems="center"
          component={"img"}
          src="/images/skillify-high-resolution-logo__1_-removebg-preview - Copy.png"
          alt="Skillify Logo"
          onClick={() =>navigate("/home")}
          
          style={
            {
              // height: "26px",
              // width: "120px",
              // paddingLeft: "3rem",
              // marginRight: "8px",
            }
          }
          sx={{
            height: { xs: "20px", md: "26px" },
            width: { xs: "100px", md: "120px" },
            paddingLeft: { xs: "0rem", md: "3rem" },
            cursor:"pointer"
          }}
        ></Box>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            borderRadius: "24px",
            backgroundColor: "#f9f9f9",
            width: "50%",
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "24px",
            },
            "& .MuiInputBase-input::placeholder": {
              fontSize: { xs: "small", md: "medium" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ height: { xs: "15px", md: "40px" } }} />
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="body2"
            color="black"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              display: { xs: "none", md: "block" },
            }}
          >
            Teach on Skillify
          </Typography>
          <Typography
            variant="body2"
            color="black"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              display: { xs: "none", md: "block" },
            }}
          >
            Explore Courses
          </Typography>

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
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <IconButton
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
                  <Box ml={1} display="flex" flexDirection="column">
                    <MenuItem
                      sx={{
                        fontWeight: { xs: "medium", md: "bold" },
                        fontSize: { xs: "small", md: "medium" },
                        mb: 0,
                        pb: 0,
                        pl: 0.5,
                      }}
                    >
                      {user?.name}
                    </MenuItem>
                    <MenuItem sx={{ pt: 0, pl: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontSize: { xs: "small", md: "medium" } }}
                      >
                        {user?.email}
                      </Typography>
                    </MenuItem>
                  </Box>
                </Box>
                <hr style={{ border: "1px solid #ECF2F0," }} />

                <MenuItem
                  onClick={() => navigate("/profile")}
                  sx={{ fontSize: { xs: "small", md: "medium" } }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("#")}
                  sx={{ fontSize: { xs: "small", md: "medium" } }}
                >
                  My Learning
                </MenuItem>
                <hr style={{ border: "1px solid #ECF2F0," }} />
                <MenuItem
                  onClick={() => navigate("#")}
                  sx={{ fontSize: { xs: "small", md: "medium" } }}
                >
                  Teach on Skillify
                </MenuItem>
                <hr style={{ border: "1px solid #ECF2F0," }} />
                <MenuItem
                  onClick={() => handleLogout()}
                  sx={{ fontSize: { xs: "small", md: "medium" } }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box display={"flex"} justifyContent="center" alignItems="center">
              <Button
                variant="outlined"
                sx={{ color: "black", margin: 0, borderColor: "black",  }}
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "black",
                  display:{xs:"none", sm:'block'}, 
                  "&:hover": { backgroundColor: "#333" },
                }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar