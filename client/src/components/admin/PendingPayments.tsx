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
  Button,
  TablePagination,
  Modal,
  Snackbar,
} from "@mui/material";
import { getPendingPayments, updatePaymentStatus } from "../../api/paymentsApi";

interface PaymentPending {
  _id: string,
  tutorId: {
    name: string;
  };
  courseId: {
    title: string;
    price: number
  };
  newEnrollments: number;
  amount: number;
}

const PendingPayments: React.FC = () => {
  const [paymentsPending, setPaymentsPending] = useState<PaymentPending[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false)
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [selectedPayment, setSelectedPayment] = useState<string | null> (null)

  useEffect(() => {
    const fetchPaymentsPending = async () => {
      const data = await getPendingPayments()
      setPaymentsPending(data);
    };
    fetchPaymentsPending();
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


  const handleSettlePayment = async(paymentId: string) => {
    setSelectedPayment(paymentId)
    setOpenModal(true)
  }

  const handleConfirmSettlement = async() => {
    if(selectedPayment) {
      try {
        await updatePaymentStatus(selectedPayment)
        setOpenModal(false)
        setPaymentsPending((prev) => prev.filter((payment) => selectedPayment !== payment._id))
        setSnackbarMessage("Payment Success")
        setSnackbar(true)
      } catch (error) {
        console.log('Error settling payment', error);
      }
    }
  }

  const handleCancelSettle = () => {
    setOpenModal(false)
    setSnackbarMessage("Payment cancelled");
    setSnackbar(true)
  }

  return (
    <Box>
      <Snackbar
        open={snackbar}
        message={snackbarMessage}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbar(false)}
      />
      <Typography variant="h4" gutterBottom>
        Payments Pending
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Tutor</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>New Enrollments</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Payable</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsPending
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.tutorId.name}</TableCell>
                  <TableCell>{payment.courseId.title}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {payment.newEnrollments}
                  </TableCell>
                  <TableCell>₹ {payment.courseId.price}</TableCell>
                  <TableCell>₹ {payment.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSettlePayment(payment._id)}
                    >
                      Settle Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={paymentsPending.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />

      <Modal
        open={openModal}
        onClose={handleCancelSettle}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height:270,
          boxShadow: 24,
          "& .MuiModal-backdrop": {
            bgcolor: "white",
          },
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ border: "none", outline: "none" }}>
          <Typography
            variant="h5"
            textAlign={"center"}
            sx={{ mt: 3, mb: 5, fontWeight: "bold" }}
            gutterBottom
          >
            Confirm Payment Settlement
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Are you sure you want to settle the payment for this tutor? Once
            confirmed, the payment will be marked as completed.
          </Typography>
          <Box display={"flex"} justifyContent={"center"} mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmSettlement}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              onClick={handleCancelSettle}
              color="primary"
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PendingPayments;
