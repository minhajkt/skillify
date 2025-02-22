import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { tutorRecievable } from "../../api/paymentsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Navbar from "../shared/Navbar";

interface Payment {
  _id: string;
  tutorId: {
    name: string;
  };
  courseId: {
    title: string;
    price: number;
  };
  newEnrollments: number;
  amount: number;
  status: string;
  paymentDate: string;
}

const TutorPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const tutor = useSelector((state: RootState) => state.auth.user);
  const tutorId = tutor?._id;

  useEffect(() => {
    const fecthTutorsPayment = async (tutorId: string) => {
      const data = await tutorRecievable(tutorId);
      setPayments(data);
    };
    if (tutorId) {
      fecthTutorsPayment(tutorId);
    }
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

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 1, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          mt: "64px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Navbar />
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 20, md: 28 },
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Payments History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  New Enrollments
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  Price
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Recievable Amount
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Recieved Date
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.courseId.title}</TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {payment.newEnrollments}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {payment.courseId.price}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {payment.amount}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                        color:
                          payment.status === "Pending" ? "orange" : "green",
                      }}
                    >
                      {payment.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {payments.length > 0 && (
          <TablePagination
            component="div"
            count={payments.length}
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
        )}
      </Box>
    </Box>
  );
};

export default TutorPayments;
