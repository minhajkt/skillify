import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  Snackbar,
  Tooltip,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getComplaints } from "../../api/courseApi";
import { useNavigate } from "react-router-dom";
import { IReport } from "../../types/types";


const CourseComplaints = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    const getReports = async () => {
      setLoading(true);
      try {
        const fetchedReports = await getComplaints(); 
        setReports(fetchedReports);
      } catch (error) {
        setError("Failed to fetch reports.");
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 2, width: "70vw" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Reports
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#FAFAFA" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Lecture</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No reports available
                </TableCell>
              </TableRow>
            ) : (
              reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <Tooltip
                        title={report.courseId?.title || "No Title"}
                        arrow
                      >
                        <Typography
                          noWrap
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.courseId?.title || "N/A"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{report.userId?.name}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={report.lectureId?.title || "No Title"}
                        arrow
                      >
                        <Typography
                          noWrap
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.lectureId?.title || "N/A"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={report.reportDescription || "No description"}
                        arrow
                      >
                        <Typography
                          noWrap
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.reportDescription || "N/A"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                    <Button variant="outlined" onClick={()=>navigate(`/admin/course-details/${report.courseId?._id}`)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={3000}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <TablePagination
        component="div"
        count={reports.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default CourseComplaints;
