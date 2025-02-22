import { Box, Typography } from "@mui/material";

const partners = [
  {
    name: "Dell",
    logo: "/images/delll.png",
    position: { top: "30%", left: "10%" },
  },
  {
    name: "Bosch",
    logo: "/images/bs.png",
    position: { top: "30%", left: "40%" },
  },
  {
    name: "Infosys",
    logo: "/images/inf.png",
    position: { top: "30%", left: "70%" },
  },
  {
    name: "Wipro",
    logo: "/images/wip.png",
    position: { top: "70%", left: "10%" },
  },
  {
    name: "Deloitte",
    logo: "/images/deloitte.png",
    position: { top: "70%", left: "40%" },
  },
  {
    name: "Paytm",
    logo: "/images/pyt.png",
    position: { top: "70%", left: "70%" },
  },
];

const HiringPartners = () => {
  return (
    <Box>
      <Box
        sx={{
          mt: { xs: 1, md: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#F7F9FA",
          position: "relative",
        }}
      >
        <Box>
          <Box
            sx={{
              mt: { xs: 1, md: 3 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb:{xs:2, md:0}
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" }, mb: {xs:1,md:3} }}
              fontWeight={"bold"}
            >
              Our Hiring Partners
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "60vw",
                height: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/worldmap.webp"
                alt="World Map"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />

              {partners.map((partner, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    top: partner.position.top,
                    left: partner.position.left,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    width: { xs: "40px", sm: "80px", md: "120px" },
                    height: { xs: "20px", sm: "40px", md: "50px" },
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: { xs: "6px 8px", sm: "8px 12px" },
                  }}
                >
                  <Box
                    component={"img"}
                    src={partner.logo}
                    sx={{
                      width: { xs: "3rem", sm: "6rem", md: "9rem" },
                      height: "auto",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HiringPartners;
