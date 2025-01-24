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

  useEffect(() => {
    const getTutorRequests = async () => {
      setLoading(true);
      try {
        const fetchedTutors = await fetchTutorRequests();
        setTutors(fetchedTutors);
      } catch (error) {
        setError("Failed to fetch tutor requests.");
        console.log('error occured',error);
        
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
    <Box sx={{ padding: 2, width: "70vw" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Tutor Requests
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#FAFAFA" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell></TableCell>
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tutor) => (
                  <TableRow key={tutor._id}>
                    <TableCell>{tutor.name}</TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>
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
                    <TableCell>
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
