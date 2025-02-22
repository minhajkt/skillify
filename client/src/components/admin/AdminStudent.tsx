
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
  TableSortLabel,
  TextField,
  TablePagination,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fetchStudents, updateStudentStatus } from "../../api/adminApi";
import { AxiosError } from "axios";
import {IStudent} from '../../types/types'


const AdminStudent = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const fetchedStudents = await fetchStudents(); 
        setStudents(fetchedStudents);  
        setFilteredStudents(fetchedStudents); 
        
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch students. Please try again.");
        
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  if (loading) return <Typography>Loading ...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleSort = (key: keyof (typeof students)[0]) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
    const sortedData = [...filteredStudents].sort((a, b) => {
      if (a[key] < b[key]) return isAsc ? -1 : 1;
      if (a[key] > b[key]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredStudents(sortedData);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterStudents(query, statusFilter);
  };

  const handleStatusFilterChange = (
    event: SelectChangeEvent<string>
  ) => {
    const status = event.target.value;
    setStatusFilter(status);
    filterStudents(searchQuery, status);
  };

  const filterStudents = (query: string, status: string) => {
    setFilteredStudents(
      students
        .filter(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        )
        .filter((student) => {
          return status ? student.isActive === (status === "active") : true;
        })
    );
    setPage(0); 
  };

const handleStatusToggle = async (studentIndex: number) => {
  const updatedStudents = [...filteredStudents];
  const student = updatedStudents[studentIndex];
  const originalStatus = student.isActive; 

  try {
    await updateStudentStatus(student._id, !originalStatus);
    student.isActive = !originalStatus;
    setFilteredStudents(updatedStudents);
    setSnackbarMessage(originalStatus ? "Student blocked!" : "Student unblocked!");
    setSnackbar(true);
    
  } catch (error: unknown) {
    console.error("Failed to update student", error);

    if (error instanceof AxiosError && error.response?.status === 403) {
      setError("You do not have permission to change the student's status");
    console.error("Failed to update student", error);
    }
  }
};


  return (
    <Box sx={{ padding: { xs: 0, md: 2 }, width: { xs: "100%", md: "70vw" } }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: { xs: 1, md: 3 },
          fontSize: { xs: 18, md: 24 },
          fontWeight: "bold",
          ml: { xs: 1, md: 0 },
        }}
      >
        Students
      </Typography>
      {error && (
        <Typography color="error" sx={{ mt: 2, zIndex: 2010 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by student name or email..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />

        <FormControl fullWidth>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#FAFAFA" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "name"}
                  direction={
                    sortConfig.key === "name" ? sortConfig.direction : "asc"
                  }
                  onClick={() => handleSort("name")}
                >
                  Student Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "isActive"}
                  direction={
                    sortConfig.key === "isActive" ? sortConfig.direction : "asc"
                  }
                  onClick={() => handleSort("isActive")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Email
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {student.isActive ? (
                      <Typography color="green">Active</Typography>
                    ) : (
                      <Typography color="red">Blocked</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }} >
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color={student.isActive ? "error" : "success"}
                      onClick={() => handleStatusToggle(index)}
                    >
                      {student.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar}
        onClose={() => setSnackbar(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={snackbarMessage}
      />

      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{
          ".MuiTablePagination-root": {
            fontSize: { xs: "0.75rem", md: ".8rem" },
            padding: { xs: "4px", md: "16px" },
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-input": {
            fontSize: { xs: "0.75rem", md: ".85rem" },
          },
          ".MuiTablePagination-actions": {
            transform: { xs: "scale(0.8)", md: "scale(1)" },
          },
        }}
      />
    </Box>
  );
};

export default AdminStudent;
