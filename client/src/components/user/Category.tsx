import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/courseApi";
const Category = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  // const categories = [
  //   { name: "Marketing", icon: "/images/marketing.png" },
  //   { name: "Web Development", icon: "/images/web.png" },
  //   { name: "English", icon: "/images/english.png" },
  //   { name: "Accounts", icon: "/images/accounts.png" },
  //   { name: "Web Designing", icon: "/images/design.png" },
  //   { name: "Data Science", icon: "/images/datascience.png" },
  // ];

  const [categories, setCategories] = useState<[]>([])

  useEffect(() => {
    const getCategories = async() => {
      const response = await fetchCategories()
      const icons = {
        Software: "/images/web.png",
        Business: "/images/datascience.png",
        Accounts: "/images/accounts.png",
      };
      const formattedResponse = response.map((cat) => ({
        name: cat,
        icon: icons[cat]
      }))
      setCategories(formattedResponse)
      console.log('cat is ca', formattedResponse);
      
    }
    getCategories()
  }, [])

  return (
    <Box
      sx={{
        // bgcolor: "palegreen",
        width: "100%",
        paddingLeft: { xs: "0rem", sm: "4rem" },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {token ? (
        <Box>
          {/* <Box sx={{ mt: 3, mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" }, mb: 2 }}
              fontWeight={"bold"}
            >
              Continue your journey
            </Typography>
            <Box
              sx={{
                width: "600px",
                height: "100px",
                bgcolor: "#F7F9FA",
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
              }}
              onClick={() => console.log("clicked")}
            >
              <Box
                sx={{
                  width: "25%",
                  height: "100px",
                  bgcolor: "#8CB9F3",
                  display: "flex",
                  justifyContent: "center",
                  //   alignItems: "center",
                }}
              >
                <InsertDriveFileIcon
                  sx={{ width: "80px", height: "80px", mt: 1 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    pl: 2,
                    fontSize: { xs: "12px", sm: "16px" },
                    fontWeight: "medium",
                    color: "#6A6F73",
                  }}
                >
                  100 Days of Code: The Complete Python Program
                </Typography>
                <Typography
                  sx={{
                    p: 2,
                    fontSize: { xs: "12px", sm: "16px" },
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  1. Introuduction To Python
                </Typography>
              </Box>
            </Box>
          </Box> */}
        </Box>
      ) : (
        <Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" } }}
              fontWeight={"bold"}
            >
              All the skills you need in one place
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: { xs: ".8rem", md: "1rem", color: "#6A6F73" } }}
            >
              From critical skills to technical topics,{" "}
              <span style={{ color: "#999999", fontWeight: "bold" }}>
                Skillify
              </span>{" "}
              supports your <br />
              professional development.
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "1.2rem", md: "1.8rem", mb: 3 } }}
              fontWeight={"bold"}
            >
              Top Categories
            </Typography>

            <Grid container spacing={{ xs: 1, sm: 4 }} sx={{ padding: 2 }}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: { xs: 4, sm: 0 },
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: { xs: 1, sm: 2 },
                      height: "50%",
                      width: "80%",
                      backgroundColor: "#F7F9FA",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={category.icon}
                      alt={category.name}
                      sx={{
                        width: { xs: "20px", sm: "30px", md: "40px" },
                        height: { xs: "20px", sm: "30px", md: "40px" },
                        marginBottom: 1,
                        mr: 2,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: 7, sm: 12, md: 17 } }}
                      fontWeight="medium"
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Category;
