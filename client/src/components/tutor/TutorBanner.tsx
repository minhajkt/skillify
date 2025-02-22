import { useSelector } from "react-redux";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";

const TutorBanner = ({ sx }: { sx?: object }) => {
  const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate()

  return (
    <Box
      sx={{
        ...sx,
        width: "100%",
        margin: "0 auto",
        pt: 0,
        mt: 0,
      }}
    >
      {user ? (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "white",
            width: "90%",
            margin: "0 auto",
            mt: { xs: 8, md: 9 },
            pt: 2,
          }}
        >
          <Avatar
            sx={{
              height: { xs: "30px", md: "60px" },
              width: { xs: "30px", md: "60px" },
              ml: 2,
            }}
            src={user?.profilePhoto || ""}
          />
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "1.5rem" },
              fontWeight: "bold",
              ml: 2,
            }}
          >
            Welcome Back, {user?.name || "user"}
          </Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "white",
            width: "90%",
            margin: "0 auto",
            mt: { xs: 5, md: 8 },
            pt: 2,
          }}
        ></Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          mt: 0,
        }}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/teach.jpg)",
            backgroundSize: { xs: "cover", md: "contain" },
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: { xs: "213px", md: "413px" },
            mt: 0,
          }}
        >
          <Box
            sx={{
              width: "30%",
              height: "30%",
              bgcolor: "white",
              position: "relative",
              top: "20%",
              left: "10%",
              borderRadius: 3,
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                p: 2,
                fontSize: { md: "1rem", lg: "1.5rem" },
              }}
            >
              Come teach with us
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{
                pl: 2,
                fontSize: { md: "0.9rem", lg: "1.1rem" },
              }}
            >
              Become an instructor and change lives — including your own
            </Typography>
          </Box>
          
          <Box sx={{position: "relative", top:"20%", left:{md:"10%"}}}>
            {!user? (
            <Button variant="contained" sx={{mt:3,ml:{xs:4,md:0}, bgcolor:"black", fontWeight:'bold',display:{sm:'block'},fontSize:{xs:10,md:14}}}
            onClick={() =>navigate("/tutors/login")}>
                Get Started
            </Button>
            ) : (
            <Button variant="contained" sx={{mt:3,ml:{xs:4,md:0}, bgcolor:"black", fontWeight:'bold',
              fontSize:{xs:10,md:14}
             }}
            onClick={() =>navigate("/tutors/create-course")}>
                Create Course
            </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TutorBanner