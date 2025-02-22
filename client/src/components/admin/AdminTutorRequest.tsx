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
  TablePagination,
  IconButton,
  Button,
  Snackbar,
  useMediaQuery,

} from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { fetchTutorRequests, updateTutorsApproval } from "../../api/adminApi";
import TutorDetailsModal from "./TutorDetailsModal";
import { ITutor } from "../../types/types";



const AdminTutorRequest = () => {
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false)
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
    });

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  useEffect(() => {
    const getTutorRequests = async () => {
      setLoading(true);
      try {
        const fetchedTutors = await fetchTutorRequests();
        setTutors(fetchedTutors);
      } catch (error) {
        setError("Failed to fetch tutor requests.");
        
      } finally {
        setLoading(false);
      }
    };

    getTutorRequests();
  }, []);

    const handleOpenModal = (tutor: ITutor) => {
      setSelectedTutor(tutor);
      setModalOpen(true);
    };

    const handleCloseModal = () => {
      setModalOpen(false);
    };


const handleApprove = async (tutorId: string) => {
  try {
    await updateTutorsApproval(tutorId, "approved");
    setTutors((prev) =>
      prev.map((tutor) =>
        tutor._id === tutorId ? { ...tutor, isApproved: "approved" } : tutor
      )
    );
    setSnackbar({
      open: true,
      message: "Tutor approved successfully!",
    });
  } catch (error) {
    console.error("Failed to approve tutor request.", error);
  }
};

const handleReject = async (tutorId: string) => {
  try {
    await updateTutorsApproval(tutorId, "rejected");

    setTutors((prev) =>
      prev.map((tutor) =>
        tutor._id === tutorId ? { ...tutor, isApproved: "rejected" } : tutor
      )
    );
          setSnackbar({
            open: true,
            message: "Tutor rejected successfully!",
          });
  } catch (error) {
    console.error("Failed to reject tutor request.", error);
  }
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: { xs: 0, md: 2 }, width: { xs: "100%", md: "70vw" } }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: { xs: 1, md: 3 },
          fontSize: { xs: 18, md: 24 },
          fontWeight: "bold",
          ml: { xs: -2, md: 0 },
        }}
      >
        Tutor Requests
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#FAFAFA", ml:{xs:-2,md:0},width:{xs:'110%', md:'auto'} }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Status
              </TableCell>
              <TableCell>Actions</TableCell>
              <TableCell
                sx={{ display: { xs: "none", md: "table-cell" } }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tutors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tutor requests pending
                </TableCell>
              </TableRow>
            ) : (
              tutors
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tutor) => (
                  <TableRow key={tutor._id}>
                    <TableCell
                      onClick={
                        isSmallScreen ? () => handleOpenModal(tutor) : undefined
                      }
                    >
                      {tutor.name}
                    </TableCell>
                    <TableCell
                      onClick={
                        isSmallScreen ? () => handleOpenModal(tutor) : undefined
                      }
                    >
                      {tutor.email}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <span
                        style={{
                          color:
                            tutor.isApproved === "approved"
                              ? "green"
                              : tutor.isApproved === "rejected"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {tutor.isApproved === "approved"
                          ? "Approved"
                          : tutor.isApproved === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tutor.isApproved === "pending" && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(tutor._id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleReject(tutor._id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenModal(tutor)}
                      >
                        View
                      </Button>
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
        count={tutors.length}
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
      <TutorDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        tutor={selectedTutor}
      />
    </Box>
  );
};

export default AdminTutorRequest;
