import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/courseApi";


const Category = () => {
  const token = useSelector((state: RootState) => state.auth.token);


  const [categories, setCategories] = useState<{name:string; icon: string}[]>([])

  useEffect(() => {
    const getCategories = async() => {
      const response: string[] = await fetchCategories()
      
      const icons: Record<string, string> = {
        Software: "/images/web.png",
        Business: "/images/datascience.png",
        Accounts: "/images/accounts.png",
      };
      const formattedResponse = response.map((cat:string) => ({
        name: cat,
        icon: icons[cat]
      }))
      setCategories(formattedResponse)
      
    }
    getCategories()
  }, [])

  return (
    <Box
      sx={{
        width: "100%",
        paddingLeft: { xs: "0rem", sm: "4rem" },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {token ? (
        <Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "1.1rem", md: "1.8rem" },
            ml:{xs:1,md:0},
            fontWeight:{xs:600,md:600}
            }}
            >
              All the skills you need in one place
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: { xs: ".8rem", md: "1rem", color: "#6A6F73" },
             ml:{xs:1,md:0}
             }}
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
              sx={{ fontSize: { xs: "1.2rem", md: "1.8rem", mb: 3 },
            ml:{xs:1,md:0}
             }}
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
                      ml: { xs: 3, sm: 0 },
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
                      sx={{ fontSize: { xs: 10, sm: 12, md: 17 } }}
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
