/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAllCourses, fetchTutorById } from "../../api/adminApi";
import { fetchCategories, getComplaints } from "../../api/courseApi";
import { useNavigate } from "react-router-dom";
import {ICourse } from '../../types/types'
import { useDebounce } from "../../hooks/useDebounce";

type SortKey = "name" | "category" | "tutor" | "createdAt"; 

const AdminCourse = () => {
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  useEffect(() => {
    const getReports = async () => {
      try {
        const fetchedReports = await getComplaints(); 
      } catch (error) {
        setError("Failed to fetch reports.");
        console.error("Error occurred:", error);
      } 
    };

    getReports();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { courses, total } = await fetchAllCourses({
          search: debouncedSearchQuery,
          category: categoryFilter,
          sort: sortConfig.key,
          order: sortConfig.direction,
          page: page + 1, 
          limit: rowsPerPage,
        });

        const tutorIds = courses.map((c: ICourse) => c.createdBy);
        const tutors = await Promise.all(
          tutorIds.map((id: string) => fetchTutorById(id))
        );

        const coursesWithTutors = courses.map(
          (course: ICourse, index: number) => ({
            ...course,
            name: course.title,
            tutor: tutors[index]?.name || "Unknown",
          })
        );

        setCoursesData(coursesWithTutors);
        setTotalCourses(total);

        const uniqueCategories: string[] = Array.from(
          new Set(
            courses.map((course: ICourse) => course.category).filter(Boolean)
          )
        );
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      }
    };

    loadCourses();
  }, [debouncedSearchQuery, categoryFilter, sortConfig, page, rowsPerPage]);
  

  const handleOpenModal = (course: ICourse) => {
    navigate(`/admin/course-details/${course._id}`);
  };


  const handleSort = (key: SortKey) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
    setPage(0);
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

  return (
    <Box sx={{ padding: { xs: 0, md: 2 }, width: { xs: "100%", md: "70vw" } }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: { xs: 1, md: 3 }, fontSize: { xs: 18, md: 24 } }}
      >
        Courses
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by course name, category, or tutor..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />

        <FormControl fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
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
                  Course Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                <TableSortLabel
                  active={sortConfig.key === "category"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "tutor"}
                  direction={
                    sortConfig.key === "tutor" ? sortConfig.direction : "asc"
                  }
                  onClick={() => handleSort("tutor")}
                >
                  Tutor
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell
                sx={{ display: { xs: "none", md: "table-cell" } }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
              {coursesData.map((course, index) => (
                <TableRow
                  key={index}
                  onClick={
                    isSmallScreen ? () => handleOpenModal(course) : undefined
                  }
                >
                  <TableCell>{course.title}</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {course.category}
                  </TableCell>
                  <TableCell>{course.tutor}</TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        color:
                          course.isApproved === "approved"
                            ? "green"
                            : course.isApproved === "blocked"
                            ? "red"
                            : "black",
                        // fontWeight: "bold",
                      }}
                    >
                      {course.isApproved}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModal(course)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCourses}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default AdminCourse;
