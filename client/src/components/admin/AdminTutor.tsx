
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
import { fetchTutors, updateTutorsStatus } from "../../api/adminApi";
import {ITutor} from '../../types/types'
import { useDebounce } from "../../hooks/useDebounce";


const AdminTutor = () => {
  const [tutors, setTutors] = useState<ITutor[]>([]);
  // const [filteredTutors, setFilteredTutors] = useState<ITutor[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
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
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    useEffect(() => {
      const getTutors = async () => {
        setLoading(true);
        try {
          const { users, total } = await fetchTutors({
            search: debouncedSearchQuery,
            status: statusFilter,
            sort: sortConfig.key,
            order: sortConfig.direction,
            page: page + 1,
            limit: rowsPerPage,
          });
          setTutors(users);
          setTotalCount(total);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError("Failed to fetch tutors. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      getTutors();
    }, [debouncedSearchQuery, statusFilter, sortConfig, page, rowsPerPage]);

      if (loading) return <Typography>Loading ...</Typography>;
      if (error) return <Typography color="error">{error}</Typography>;

      const handleSort = (key: keyof ITutor) => {
        const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
        setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
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
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const status = event.target.value;
    setStatusFilter(status);
    setPage(0);
  };

  // const filterTutors = (query: string, status: string) => {
  //   setFilteredTutors(
  //     tutors
  //       .filter(
  //         (tutor) =>
  //           tutor.name.toLowerCase().includes(query) ||
  //           tutor.email.toLowerCase().includes(query)
  //       )
  //       .filter((tutor) => (status ? tutor.status === status : true))
  //   );
  //   setPage(0); 
  // };

  const handleStatusToggle = async(tutorIndex: number) => {
    const updatedTutors = [...tutors];
    const tutor = updatedTutors[tutorIndex];
    const newStatus = !tutor.isActive
    tutor.isActive = newStatus
    setTutors(updatedTutors);
    
    try {
        await updateTutorsStatus(tutor._id, newStatus)
        setSnackbarMessage(newStatus ? "Tutor Unblocked!" : "Tutor Blocked!");
        setSnackbar(true);

    } catch (error) {
        console.error('Failed to update student', error);
        tutor.isActive = !newStatus; 
        // setFilteredTutors(updatedTutors);
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
        Tutors
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search"
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

      <TableContainer
        component={Paper}
        sx={{ bgcolor: "#FAFAFA", ml: { xs: 0, md: 0 } }}
      >
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
                  Tutor Name
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
            {/* {filteredTutors
              // .sort(
              //   (a, b) =>
              //     new Date(b.createdAt).getTime() -
              //     new Date(a.createdAt).getTime()
              // ) */}
            {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
            {tutors.map((tutor, index) => (
              <TableRow key={index}>
                <TableCell>{tutor.name}</TableCell>
                <TableCell>
                  {tutor.isActive ? (
                    <Typography color="green">Active</Typography>
                  ) : (
                    <Typography color="red">Blocked</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {tutor.email}
                </TableCell>
                <TableCell>
                  <IconButton
                    color={tutor.isActive ? "error" : "success"}
                    onClick={() => handleStatusToggle(index)}
                  >
                    {tutor.isActive ? <BlockIcon /> : <CheckCircleIcon />}
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
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <TablePagination
        component="div"
        count={totalCount}
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
}

export default AdminTutor


