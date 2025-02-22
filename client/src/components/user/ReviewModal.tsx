import {
  Box,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Rating,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
  rating: number | null;
  setRating: (value: number | null) => void;
  reviewText: string;
  setReviewText: (value: string) => void;
  onSubmit: () => void;
  onDelete: () =>  void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userReview: any
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  courseTitle,
  rating,
  setRating,
  reviewText,
  setReviewText,
  onSubmit,
  onDelete,
  userReview
  
}) => {
  return (
    <Box>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {xs:300,md:400},
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{fontSize:{xs:16,md:20},mb:-1}}>Add Review for {courseTitle}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Rating
            name="course-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="medium"
          />
          <TextField
            label="Write your review"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={onSubmit}
          >
            Submit Review
          </Button>
          {userReview && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ mt: 2 }}
              onClick={onDelete}
            >
              Delete Review
            </Button>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ReviewModal;
