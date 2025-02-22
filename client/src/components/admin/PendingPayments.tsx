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
  useMediaQuery,
} from "@mui/material";
import { getPendingPayments, updatePaymentStatus } from "../../api/paymentsApi";
import { PaymentPending } from "../../types/types";



const PendingPayments: React.FC = () => {
  const [paymentsPending, setPaymentsPending] = useState<PaymentPending[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false)
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [selectedPayment, setSelectedPayment] = useState<string | null> (null)
  const isSmallScreen  = useMediaQuery((theme) => theme.breakpoints.down('sm'))

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.log('Error settling payment', error);
      }
    }
  }

  const handleCancelSettle = () => {
    setOpenModal(false)
    setSnackbarMessage("Payment cancelled");
    setSnackbar(true)
  }

  return (
    <Box >
      <Snackbar
        open={snackbar}
        message={snackbarMessage}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbar(false)}
      />
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
        Payments Pending
      </Typography>
      <TableContainer component={Paper}  sx={{ml:{xs:-2, md:0}, width:{xs:'110%', md:'auto'}}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Tutor</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                New Enrollments
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Price
              </TableCell>
              <TableCell>Payable</TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsPending
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment, index) => (
                <TableRow
                  key={index}
                  onClick={
                    isSmallScreen
                      ? () => handleSettlePayment(payment._id)
                      : undefined
                  }
                >
                  <TableCell>{payment.tutorId.name}</TableCell>
                  <TableCell>{payment.courseId.title}</TableCell>
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
                  <TableCell>₹ {payment.amount}</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
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

      <Modal
        open={openModal}
        onClose={handleCancelSettle}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, md: 400 },
          height: 270,
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
            sx={{
              mt: { xs: 0, md: 3 },
              mb: { xs: 2, md: 5 },
              fontWeight: "bold",
            }}
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
