import { Box, Button, Typography } from "@mui/material";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { axiosInstance } from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { handleAxiosError } from "../../utils/errorHandler";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CheckoutButtonProps {
  disabled: boolean; 
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({disabled}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()


  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (!courseId) {
        throw new Error("Course ID is missing");
      }

      console.log("courseId", courseId);

      const response = await axiosInstance.post(`/course/checkout/${courseId}`);
      console.log("response of payment is ", response);

      const { id: sessionId } = response.data;

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.log("Error redirecting to checkout page", error);
      }
    } catch (error) {
      console.error("checkout failed", error);
      setError(error.message);
      throw handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {user ? (
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#1a1a1a",
            "&:hover": { bgcolor: "#333" },
            py: 1.5,
            mb: 0,
          }}
          onClick={handleCheckout}
          disabled={disabled || !stripe || !elements}
        >
          {isLoading ? "Processing..." : "ENROLL NOW"}
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#1a1a1a",
            "&:hover": { bgcolor: "#333" },
            py: 1.5,
            mb: 0,
          }}
          onClick={() => navigate('/login')}
          disabled={disabled || !stripe || !elements}
        >
          {isLoading ? "Processing..." : "ENROLL NOW"}
        </Button>
      )}
      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}
    </Box>
  );
};


export default CheckoutButton