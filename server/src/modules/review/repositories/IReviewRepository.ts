import { IReview } from "../models/reivewModel";

export interface IReviewRepository {
  addReview(reviewData: Partial<IReview>): Promise<IReview>;
  getReviews(courseId: string): Promise<IReview[]>;
  getUserReview(userId: string, courseId: string): Promise<IReview | null>;
  updateCourseReview(userId: string, courseId: string, reviewText: string, rating: number): Promise<IReview | null> 
  deleteReview(courseId: string, userId: string): Promise<IReview | null>
}