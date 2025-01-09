import { Box, Card, CardContent, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material"
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  FileDownload as ExportIcon,
} from "@mui/icons-material";

// const salesData = [
//   { month: "Jan", value: 4000 },
//   { month: "Feb", value: 5000 },
//   { month: "Mar", value: 6000 },
//   { month: "Apr", value: 4000 },
//   { month: "May", value: 8000 },
//   { month: "Jun", value: 9000 },
//   { month: "Jul", value: 10000 },
//   { month: "Aug", value: 8500 },
//   { month: "Sep", value: 11000 },
//   { month: "Oct", value: 9500 },
//   { month: "Nov", value: 10000 },
//   { month: "Dec", value: 9000 },
// ];

const courseStrength = [
  { name: "MERN Stack", value: 10 },
  { name: "Python", value: 8 },
  { name: "Communication", value: 5 },
  { name: "Accounts", value: 2 },
];

const AdminDashBoard = () => {
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
          <StatsCard title="Total Number of Enrolled Students" value="10" />
          <StatsCard title="Total Number of Courses available" value="5" />
          <StatsCard title="Total Number of Instructors joined" value="5" />
          <StatsCard title="Total Revenue Generated in sales" value="₹25000" />
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
            {courseStrength.map((course) => (
              <ListItem key={course.name}>
                <ListItemText
                  primary={course.name}
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            width: `${(course.value / 10) * 100}%`,
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