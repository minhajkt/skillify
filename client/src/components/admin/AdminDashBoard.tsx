import { Box, Card, CardContent, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material"
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { enrolledStudents, getCourseStrength, getTotalRevenue } from "../../api/enrollmentApi";
import { getCourseCount } from "../../api/courseApi";
import { getTutorCount } from "../../api/tutorApi";


// const courseStrength = [
//   { name: "MERN Stack", value: 10 },
//   { name: "Python", value: 8 },
//   { name: "Communication", value: 5 },
//   { name: "Accounts", value: 2 },
// ];



const AdminDashBoard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentStrength, setStudentStregnth] = useState<number>(0)
  const [courseCount, setCourseCount] = useState<number>(0)
  const [tutorCount, setTutorCount] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [courseStrength, setCourseSterngth] = useState<{name: string; value: string}[]>([])
  useEffect(() => {
    const fetchTotalStrength = async() => {
      const response = await enrolledStudents();
      setStudentStregnth(response)
      
    }
    fetchTotalStrength()
  }, [])

  useEffect(() => {
    const fetchCourseCount = async () => {
      const count = await getCourseCount()
      setCourseCount(count)
    }
    fetchCourseCount()
  }, [])

  useEffect(() => {
    const fetchTutorCount = async() => {
      const count = await getTutorCount()
      setTutorCount(count)
    }
    fetchTutorCount()
  }, [])

  useEffect(() => {
    const fetchTotalRevenue = async() => {
      const totalRevenue = await getTotalRevenue()
      setTotalRevenue(totalRevenue)
    }
    fetchTotalRevenue()
  }, [])

  useEffect(() => {
    const fetchCourseStrength = async () => {
      const courseStrength = await getCourseStrength()
      setCourseSterngth(courseStrength)
      
    }
    fetchCourseStrength()
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        // minHeight: "100vh",
        bgcolor: "#ff",
        // mt: { xs: "64px", md: "10px" },
      }}
    >
      <Box sx={{ flex: 1, p: 3, bgcolor: "" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, bgcolor: "" }}>
          <StatsCard
            title="Total Number of Enrollments"
            value={studentStrength}
          />
          <StatsCard
            title="Total Number of Courses available"
            value={courseCount}
          />
          <StatsCard
            title="Total Number of Instructors joined"
            value={tutorCount}
          />
          <StatsCard
            title="Total Revenue Generated in sales"
            value={`₹ ${totalRevenue}`}
          />
        </Box>
        <Card sx={{ flex: 2, p: 2, bgcolor: "#FAFAFA" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight={"bold"}>
              Sales Report
            </Typography>
            <Box>
              <IconButton size="small">
                <ExportIcon />
              </IconButton>
              Export PDF
            </Box>
          </Box>
          <Typography>Section for sales report</Typography>
          {/* <LineChart width={800} height={300} data={salesData}> */}
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          {/* <XAxis dataKey="month" /> */}
          {/* <YAxis /> */}
          {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
          {/* </LineChart> */}
        </Card>
        <Card sx={{ flex: 1, p: 2, bgcolor: "#FAFAFA", mt: 3 }}>
          <Typography variant="h6" fontWeight={"bold"} sx={{ mb: 2 }}>
            Course Strength
          </Typography>
          <List>
            {courseStrength
              .sort((a, b) => Number(b.value) - Number(a.value))
              .map((course) => (
                <ListItem key={course.name}>
                  <ListItemText
                    primary={course.name}
                    secondary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            height: 4,
                            bgcolor: "#e0e0e0",
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(Number(course.value) / 10) * 100}%`,
                              height: "100%",
                              bgcolor: "#8884d8",
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                        <Typography variant="body2">{course.value}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Card>
      </Box>
    </Box>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatsCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <Card sx={{ flex: 1, p: 2, bgcolor: "#FAFAFA" }}>
    <CardContent>
      <Typography
        color="textSecondary"
        gutterBottom
        sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          pt: 2,
          fontSize: { xs: "0.8rem", md: "1.5rem" },
          fontWeight: "bold",
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default AdminDashBoard