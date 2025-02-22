import React, { useState, useEffect } from "react";
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
import { getPaymentHistory } from "../../api/paymentsApi";

interface PaymentHistory {
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
  status: string
  paymentDate: string
}

const PaymentHistory: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const data = await getPaymentHistory();
      setPaymentHistory(data);
    };
    fetchPaymentHistory();
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
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 1, md: 3 },
          fontSize: { xs: 18, md: 24 },
          fontWeight: "bold",
          ml: { xs: -2, md: 0 },
        }}
        gutterBottom
      >
        Payments History
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ ml: { xs: -2, md: 0 }, width: { xs: "110%", md: "auto" } }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Tutor</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Course Name
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                New Enrollments
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Price
              </TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>PaymentDate</TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Status
              </TableCell>
              {/* <TableCell sx={{ textAlign: "center" }}>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentHistory
              .sort(
                (a, b) =>
                  new Date(b.paymentDate).getTime() -
                  new Date(a.paymentDate).getTime()
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.tutorId.name}</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {payment.courseId.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    {payment.newEnrollments}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    ₹ {payment.courseId.price}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    ₹ {payment.amount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(payment.paymentDate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: payment.status === "Completed" ? "green" : "red",
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    {payment.status}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={paymentHistory.length}
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

export default PaymentHistory;
