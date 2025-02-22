import { IReview } from "../models/reivewModel";

interface ReviewStatistics {
  reviews: IReview[];
  totalReviews: number;
  averageRating: number;
}


export interface IReviewService {
  addReview(reviewData: Partial<IReview>): Promise<IReview | null>;
  getUserReview(userId: string, courseId: string): Promise<IReview | null>;
  getReviews(courseId: string): Promise<ReviewStatistics>;
  updateCourseReview(userId: string,courseId: string,reviewText: string,rating: number): Promise<IReview | null>
  deleteReview(courseId: string, userId: string): Promise<boolean>
}