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


      const response = await axiosInstance.post(`/course/checkout/${courseId}`);

      const { id: sessionId } = response.data;

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        setError("Error redirecting to checkout page");
      }
    } catch (error) {
      setError((error as Error).message);
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