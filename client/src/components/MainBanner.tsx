import { Avatar, Box, Typography } from "@mui/material"
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import { useEffect } from "react";
// import Cookies from "js-cookie";

const MainBanner = ({ sx }: { sx?: object }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("user from redux", user);

  //     useEffect(() => {
  //   const token = Cookies.get("authToken");
  //   if (token) {
  //     console.log("Token found:", token);
  //     // Perform any logic, e.g., fetching user data with the token
  //   } else {
  //     console.log("No token found to");
  //   }
  // }, []);
  return (
    <Box
      sx={{
        ...sx,
        width: "100%",
        margin: "0 auto",
        bgcolor: "yellow",
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
          mt: { xs: 8, md: 9 },
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
          bgcolor: "palegoldenrod",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/banner1.jpg)",
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
              Learning that gets You
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{
                pl: 2,
                fontSize: { md: "0.9rem", lg: "1.1rem" },
              }}
            >
              Skills for your present and your future. Get started with us.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "#2667D1",
            height: { xs: 50, md: 80 },
            mt: 0,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ height: { xs: "25px", md: "40px" }, width: { xs: "25px", md: "40px" } }}>
              <img
                src="/images/skill.png"
                style={{ height: "100%", width: "100%" }}
                alt="Skill Icon"
              />
            </Box>
            <Typography
              sx={{ color: "white", display: { xs: "none", sm: "block" }, fontSize:{sm:'.7rem', md:"1rem"} }}
            >
              Learn The <br /> Essential Skills
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ height: { xs: "25px", md: "40px" }, width: { xs: "25px", md: "40px" } }}>
              <img
                src="/images/master.png"
                style={{ height: "100%", width: "100%" }}
                alt="Skill Icon"
              />
            </Box>
            <Typography
              sx={{ color: "white", display: { xs: "none", sm: "block" }, fontSize:{sm:'.7rem', md:"1rem"}  }}
            >
              Master at <br />
              Different Areas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ height: { xs: "25px", md: "40px" }, width: { xs: "25px", md: "40px" } }}>
              <img
                src="/images/grow.png"
                style={{ height: "100%", width: "100%" }}
                alt="Skill Icon"
              />
            </Box>
            <Typography
              sx={{ color: "white", display: { xs: "none", sm: "block" }, fontSize:{sm:'.7rem', md:"1rem"}  }}
            >
              Get Ready For The
              <br /> Next Career
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ height: { xs: "25px", md: "40px" }, width: { xs: "25px", md: "40px" } }}>
              <img
                src="/images/certification.png"
                style={{ height: "100%", width: "100%" }}
                alt="Skill Icon"
              />
            </Box>
            <Typography
              sx={{ color: "white", display: { xs: "none", sm: "block" }, fontSize:{sm:'.7rem', md:"1rem"}  }}
            >
              Earn Certificates <br />
              And Degrees
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainBanner


{/* <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        bgcolor: "yellow",
        mt: 0,
        pt: "50px",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{ bgcolor: "white", width: "90%", m: "0 auto" }}
      >
        <Box sx={{ m: 3, mb: 3 }}>
          <Avatar
            sx={{
              height: { xs: "30px", md: "60px" },
              width: { xs: "30px", md: "60px" },
              mt: 0,
            }}
            src={user?.profilePhoto || ""}
          />
        </Box>
        <Typography
          sx={{ fontSize: { xs: "0.5rem", md: "1.5rem" } }}
          fontWeight={"bold"}
        >
          Welcome Back, {user?.name || "user"}
        </Typography>
      </Box> */}
      {/* <Box
        sx={{
          display: { xs: "block", md: "none" },
          backgroundImage: "url(/images/banner1.jpg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition:"center",
          width: "100%",
          height: "213px",
          margin: "0 auto",
          mt:2, 
        }}
      /> */}

      {/* <Box
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: "url(/images/banner1.jpg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "413px",
          margin: "0 auto",
        }}
      > */}
      {/* <Box
        sx={{
          backgroundImage: "url(/images/banner1.jpg)",
          backgroundSize: { xs: "contain", md: "cover" },
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: { xs: "213px", md: "413px" },
          margin: "0 auto",
          mt: { xs: 2, md: 0 },
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
            fontWeight={"bold"}
            sx={{ p: 2, fontSize: { md: "1rem", lg: "1.5rem" } }}
          >
            Learning that gets You
          </Typography>

          <Typography
            variant="body1"
            fontWeight={"medium"}
            sx={{ pl: 2, fontSize: { md: "0.9rem", lg: "1.1rem" } }}
          >
            Skills for your present and your future. Get started with us.
          </Typography>
          {/* </Box> */}
    //     </Box>
    //   </Box>

    //   <Box
    //     sx={{
    //       width: "100%",
    //       ml: 0,
    //       bgcolor: "#2667D1",
    //       height: { xs: 50, md: 80 },
    //       mt: { xs: 2, md: 10 },
    //     }}
    //   ></Box>
    // </Box> */}