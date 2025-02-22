import { CalendarToday } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, Divider, Rating, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { getReviews } from "../../api/reviewApi";
import { ReviewComponentProps, IReview } from "../../types/types";

const ReviewComponent:React.FC<ReviewComponentProps> = ({ courseId, setAverageRating, setTotalReviews }) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewData = await getReviews(courseId);
        setReviews(reviewData.reviews);
        setAverageRating(reviewData.averageRating);
        setTotalReviews(reviewData.totalReviews);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, [courseId]);
  
  return (
    <Box sx={{ mt: 6, mb: 4, px: { xs: 1, md: 14 } }}>
      <Typography
        variant="h5"
        fontWeight="600"
        gutterBottom
        sx={{
          mb: 4,
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            bgcolor: "primary.main",
            borderRadius: 1,
          },
        }}
      >
        Student Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Card sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            No reviews yet. Be the first to share your learning experience!
          </Typography>
        </Card>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Card
              key={review._id}
              sx={{
                "&:hover": {
                  boxShadow: (theme) => theme.shadows[4],
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                      src={review.userId.profilePhoto || "/images/prof.png"}
                      alt={review.userId.name}
                      sx={{
                        width: 48,
                        height: 48,
                        border: "2px solid",
                        borderColor: "primary.light",
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {review.userId.name}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        precision={0.5}
                        sx={{
                          fontSize: "1rem",
                          color: "warning.main",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    pl: 2,
                    borderLeft: "2px solid",
                    borderColor: "grey.200",
                  }}
                >
                  {review.reviewText}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ReviewComponent