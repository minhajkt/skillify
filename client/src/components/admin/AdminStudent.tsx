
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
} from "@mui/material";
import { useEffect, useState } from "react";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fetchStudents, updateStudentStatus } from "../../api/adminApi";
import { AxiosError } from "axios";

type Student = {
  _id: string;
  name: string;
  email: string;
  status: string; 
  isActive: boolean;
};


const AdminStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); 
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

  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const fetchedStudents = await fetchStudents(); 
        setStudents(fetchedStudents);  
        setFilteredStudents(fetchedStudents); 
        console.log('fetched', fetchedStudents);
        
      } catch (error) {
        setError("Failed to fetch students. Please try again.");
        console.log("error fetching students", error);
        
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
    
  } catch (error: unknown) {
    console.error("Failed to update student", error);

    if (error instanceof AxiosError && error.response?.status === 403) {
      setError("You do not have permission to change the student's status");
    console.error("Failed to update student", error);
    }
  }
};


  return (
    <Box sx={{ padding: 2, width: "70vw" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
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
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents
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
                  <TableCell>{student.email}</TableCell>
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

      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default AdminStudent;
