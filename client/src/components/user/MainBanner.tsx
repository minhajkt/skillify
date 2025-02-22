import { Avatar, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const MainBanner = ({ sx }: { sx?: object }) => {
  const user = useSelector((state: RootState) => state.auth.user);
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
            height: { xs: 40, md: 80 },
            mt: 0,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                height: { xs: "25px", md: "40px" },
                width: { xs: "25px", md: "40px" },
              }}
            >
              <Box
                component="img"
                src="/images/skill.png"
                alt="Skill Icon"
                sx={{
                  width: { xs: "80%", md: "100%" },
                  height: { xs: "80%", md: "100%" },
                }}
              ></Box>
            </Box>
            <Typography
              sx={{
                color: "white",
                display: { xs: "none", sm: "block" },
                fontSize: { sm: ".7rem", md: "1rem" },
              }}
            >
              Learn The <br /> Essential Skills
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                height: { xs: "25px", md: "40px" },
                width: { xs: "25px", md: "40px" },
                pt: { xs: ".2rem" },
              }}
            >
              <Box
                component="img"
                src="/images/master.png"
                alt="Skill Icon"
                sx={{
                  width: { xs: "80%", md: "100%" },
                  height: { xs: "80%", md: "100%" },
                }}
              ></Box>
            </Box>
            <Typography
              sx={{
                color: "white",
                display: { xs: "none", sm: "block" },
                fontSize: { sm: ".7rem", md: "1rem" },
              }}
            >
              Master at <br />
              Different Areas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                height: { xs: "25px", md: "40px" },
                width: { xs: "25px", md: "40px" },
                pt: { xs: ".1rem" },
              }}
            >
              <Box
                component="img"
                src="/images/grow.png"
                alt="Skill Icon"
                sx={{
                  width: { xs: "80%", md: "100%" },
                  height: { xs: "80%", md: "100%" },
                }}
              ></Box>
            </Box>
            <Typography
              sx={{
                color: "white",
                display: { xs: "none", sm: "block" },
                fontSize: { sm: ".7rem", md: "1rem" },
              }}
            >
              Get Ready For The
              <br /> Next Career
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                height: { xs: "25px", md: "40px" },
                width: { xs: "25px", md: "40px" },
              }}
            >
              <Box
                component="img"
                src="/images/certification.png"
                alt="Skill Icon"
                sx={{
                  width: { xs: "80%", md: "100%" },
                  height: { xs: "80%", md: "100%" },
                  pt: { xs: ".2rem" },
                }}
              ></Box>
            </Box>
            <Typography
              sx={{
                color: "white",
                display: { xs: "none", sm: "block" },
                fontSize: { sm: ".7rem", md: "1rem" },
              }}
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

export default MainBanner;
