import express from 'express';
import { authenticateJWT } from '../../middlewares/authenticateJWT';
import { reviewController } from './controllers/reviewController';
import { ReviewRepository } from './repositories/reviewRepository';
import { ReviewService } from './services/reviewService';
import Review from './models/reivewModel'

const reviewRouter = express.Router()

const reviewRepository = new ReviewRepository()
const reviewService = new ReviewService(reviewRepository)
const reviewcontroller = new reviewController(reviewService)

reviewRouter.post('/review/add-review', authenticateJWT, reviewcontroller.addReview.bind(reviewcontroller))
reviewRouter.get('/reviews/:courseId', reviewcontroller.getReviews.bind(reviewcontroller))
reviewRouter.get('/reviews/user/:userId/course/:courseId', reviewcontroller.getUserReview.bind(reviewcontroller))
reviewRouter.put('/reviews/user/:userId/course/:courseId', reviewcontroller.updateCourseReview.bind(reviewcontroller));
reviewRouter.delete('/reviews/:courseId/:userId', reviewcontroller.deleteReview.bind(reviewcontroller));
reviewRouter.get("/api/reviews/ratings", async (req, res) => {
  const ratings = await Review.aggregate([
    { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } },
  ]);
  
  res.json(ratings);
});
export default reviewRouter;

