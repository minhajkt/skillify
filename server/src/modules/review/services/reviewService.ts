import { IReview } from "../models/reivewModel";
import { IReviewRepository } from "../repositories/IReviewRepository";
import { IReviewService } from "./IReviewService";

interface ReviewStatistics {
  reviews: IReview[];
  totalReviews: number; 
  averageRating: number; 
}

export class ReviewService implements IReviewService {
  private reviewRepo: IReviewRepository;

  constructor(reviewRepo: IReviewRepository) {
    this.reviewRepo = reviewRepo;
  }

  async addReview(reviewData: Partial<IReview>): Promise<IReview | null> {
    const { rating, reviewText, userId, courseId } = reviewData;
    if (!rating || !reviewText || !courseId) {
      throw new Error("Rating, review text, and course ID are required.");
    }
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    return this.reviewRepo.addReview(reviewData);
  }

  async getReviews(courseId: string): Promise<ReviewStatistics> {
    const reviews = await this.reviewRepo.getReviews(courseId);

    if (!reviews || reviews.length === 0) {
      return { reviews: [], totalReviews: 0, averageRating: 0 };
    }
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    return { reviews, totalReviews, averageRating };
  }

  async getUserReview(
    userId: string,
    courseId: string
  ): Promise<IReview | null> {
    const userReview = this.reviewRepo.getUserReview(userId, courseId);
    if (!userReview) {
      throw new Error("You have not posted any review for this course");
    }
    return userReview;
  }

  async updateCourseReview(
    userId: string,
    courseId: string,
    reviewText: string,
    rating: number
  ): Promise<IReview | null> {

    const updatedReview = await this.reviewRepo.updateCourseReview(
      userId,
      courseId,
      reviewText,
      rating
    );
    if (!updatedReview) {
      throw new Error("No current review available to update");
    }
    return updatedReview;
  }

  async deleteReview(courseId: string, userId: string): Promise<boolean> {
    const deletedReview = await this.reviewRepo.deleteReview(courseId, userId);
    return deletedReview !== null;  
  }
}