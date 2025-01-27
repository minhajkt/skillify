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
      <Typography variant="h4" gutterBottom>
        Payments History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Tutor</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>New Enrollments</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>PaymentDate</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
              {/* <TableCell sx={{ textAlign: "center" }}>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.tutorId.name}</TableCell>
                  <TableCell>{payment.courseId.title}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {payment.newEnrollments}
                  </TableCell>
                  <TableCell>₹ {payment.courseId.price}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    ₹ {payment.amount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: payment.status === "Completed" ? "green" : "red",
                    }}
                  >
                    {payment.status}
                  </TableCell>

                  {/* <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSettlePayment(payment._id)}
                    >
                      Settle Payment
                    </Button>
                  </TableCell> */}
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
      />
    </Box>
  );
};

export default PaymentHistory;
