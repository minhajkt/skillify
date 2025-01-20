import { Request, Response } from "express";
import { ReviewRepository } from "../repositories/reviewRepository";
import { ReviewService } from "../services/reviewService";
import Review, { IReview } from "../models/reivewModel";
import { IReviewService } from "../services/IReviewService";
import { IReviewController } from "./IReviewController";

// interface User {
//   id: string;
// }

export class reviewController implements IReviewController{
  private reviewService: IReviewService
  constructor(reviewService: IReviewService) {
    this.reviewService = reviewService
  }

  async addReview(req: Request, res: Response):Promise<void> {
    try {
      const { courseId, rating, reviewText } = req.body;
      const userId = req.user?.id;

      const reviewData = { rating, reviewText, userId, courseId };
      const newReview = await this.reviewService.addReview(reviewData);
      if (!newReview) {
         res.status(404).json({ message: "Failed to add review" });
      }
       res.status(200).json(newReview);
    } catch (error) {
       res.status(500).json({
        message: "An unexpected error occured",
        error: (error as Error).message,
      });
    }
  };

  async getReviews(req: Request, res: Response) : Promise<void> {
    try {
      const { courseId } = req.params;
      const {reviews,   totalReviews, averageRating } = await this.reviewService.getReviews(courseId);
      if (!reviews || reviews.length === 0) {
         res.status(404).json({ message: "No reviews are posted for this course" });
         return; 
      }
      res.status(200).json({ reviews, averageRating, totalReviews });
    } catch (error) {
      res.status(500).json({message: "An unexpected error occured while getting the review data",error: (error as Error).message,});
    }
  };

  async getUserReview(req: Request, res: Response):Promise<void> {
    try {
      const { userId, courseId } = req.params;
      const review = await this.reviewService.getUserReview(userId, courseId); 
      // if (!review) {
      //   return res
      //     .status(404)
      //     .json({ message: "Review not found for this course" });
      // }
       res.status(200).json(review); 
    } catch (error) {
       res.status(500).json({message: "An unexpected error occurred while getting the review data",error: (error as Error).message,});
    }
  };

  async updateCourseReview(req: Request, res: Response): Promise<void> {
    try {
        const {userId, courseId} = req.params
        const {reviewText, rating} = req.body
        // console.log('controller', reviewText);
        
        const existingReview = await this.reviewService.updateCourseReview(userId, courseId, reviewText, rating)
         res.status(200).json(existingReview);
    } catch (error) {
          res.status(500).json({
           message: "An unexpected error occurred while updating the review",
           error: (error as Error).message,
         });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
        const { courseId, userId } = req.params;
    const review = await this.reviewService.deleteReview( courseId, userId );

    if (!review) {
       res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
         res.status(500).json({message: "An error occured", error:(error as Error).message})
    }
  }
}
