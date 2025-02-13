import { Box, Card, CardContent, IconButton, List, ListItem, ListItemText, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileDownload as ExportIcon,} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { enrolledStudents, getCourseStrength, getRevenueReport, getTotalRevenue } from "../../api/enrollmentApi";
import { getCourseCount } from "../../api/courseApi";
import { getTutorCount } from "../../api/tutorApi";
import { fillMissingDates } from "../../utils/missingDateHandler";



const AdminDashBoard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentStrength, setStudentStregnth] = useState<number>(0)
  const [courseCount, setCourseCount] = useState<number>(0)
  const [tutorCount, setTutorCount] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [courseStrength, setCourseSterngth] = useState<{name: string; value: string}[]>([])
  const [timeRange, setTimeRange] = useState("daily");
const [customDates, setCustomDates] = useState({ startDate: "", endDate: "" });
const [salesData, setSalesData] = useState<{ date: string; totalRevenue: number }[]>([]);


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


    useEffect(() => {
      if (
        timeRange === "custom" &&
        (!customDates.startDate || !customDates.endDate)
      )
        return;
      fetchRevenueReport();
    }, [timeRange, customDates]);


  const fetchRevenueReport = async () => {
    try {
      const data = await getRevenueReport(
        timeRange,
        customDates.startDate,
        customDates.endDate
      );
      const formattedData = fillMissingDates(data, timeRange, customDates.startDate, customDates.endDate);
      setSalesData(formattedData); 
    } catch (error) {
      console.error("Error fetching revenue data", error);
    }
  };



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
            {/* <Box>
              <IconButton size="small">
                <ExportIcon />
              </IconButton>
              Export PDF
            </Box> */}
          </Box>
          <Typography>Section for sales report</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              height: "30px",
              mb: 4,
              mt: 2,
              gap: 2,
            }}
          >
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>

            {timeRange === "custom" && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  type="date"
                  label="Start Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setCustomDates({
                      ...customDates,
                      startDate: e.target.value,
                    })
                  }
                />
                <TextField
                  type="date"
                  label="End Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setCustomDates({ ...customDates, endDate: e.target.value })
                  }
                />
              </Box>
            )}
          </Box>
          <BarChart width={800} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={0}
              tickFormatter={(date) => {
                const dateObj = new Date(date);
                if (timeRange === "daily") {
                  return dateObj.getDate();
                } else if (timeRange === "monthly") {
                  return dateObj.getMonth() + 1;
                } else if (timeRange === "quarterly") {
                  const quarter = Math.floor(dateObj.getMonth() / 3) + 1;
                  return `Q${quarter}`;
                } else if (timeRange === "yearly") {
                  return dateObj.getFullYear();
                }
                return dateObj.toLocaleDateString();
              }}
            />

            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRevenue" fill="#107dac" barSize={30} />
          </BarChart>
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
                              bgcolor: "#107dac",
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