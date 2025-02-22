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

type SortKey = "name" | "category" | "tutor" | "createdAt"; 

const AdminCourse = () => {
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

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
  const [searchQuery, setSearchQuery] = useState("");
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
    const showCourses = async () => {
      try {
        const courses = await fetchAllCourses();

        const categories = await fetchCategories();
        setCategories(categories);

        const tutorIds = courses.map((course: ICourse) => course.createdBy);
        const tutors = await Promise.all(
          tutorIds.map((tutorId:string) => fetchTutorById(tutorId))
        );

        const coursesWithTutors = courses.map((course:ICourse, index:number) => ({
          ...course,
          name: course.title,
          tutor: tutors[index]?.name || "Unknown",
        }));

        setCoursesData(coursesWithTutors);
        setFilteredCourses(coursesWithTutors);
      } catch (error) {
        setError(`Failed to fetch the courses`);
        console.log(error);
      }
    };
    showCourses();
  }, []);

  const handleOpenModal = (course: ICourse) => {
    navigate(`/admin/course-details/${course._id}`);
  };

  useEffect(() => {
    let updatedCourses = [...coursesData];

    if (searchQuery) {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tutor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      updatedCourses = updatedCourses.filter(
        (course) => course.category === categoryFilter
      );
    }

    updatedCourses.sort((a, b) => {
      const isAsc = sortConfig.direction === "asc";
      if (a[sortConfig.key] < b[sortConfig.key]) return isAsc ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return isAsc ? 1 : -1;
      return 0;
    });

    setFilteredCourses(updatedCourses);
  }, [coursesData, searchQuery, categoryFilter, sortConfig]);

  const handleSort = (key: SortKey) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
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
            {filteredCourses
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course, index) => (
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
        count={filteredCourses.length}
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
