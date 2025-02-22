import { Request, Response } from "express";
import { ReviewRepository } from "../repositories/reviewRepository";
import { ReviewService } from "../services/reviewService";
import Review, { IReview } from "../models/reivewModel";
import { IReviewService } from "../services/IReviewService";
import { IReviewController } from "./IReviewController";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";



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
         res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.ADD_REVIEW_FAILED });
      }
       res.status(HttpStatus.OK).json(newReview);
    } catch (error) {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  };

  async getReviews(req: Request, res: Response) : Promise<void> {
    try {
      const { courseId } = req.params;
      const {reviews,   totalReviews, averageRating } = await this.reviewService.getReviews(courseId);
      if (!reviews || reviews.length === 0) {
         res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.NO_REVIEW });
         return; 
      }
      res.status(HttpStatus.OK).json({ reviews, averageRating, totalReviews });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR , error: (error as Error).message,});
    }
  };

  async getUserReview(req: Request, res: Response):Promise<void> {
    try {
      const { userId, courseId } = req.params;
      const review = await this.reviewService.getUserReview(userId, courseId); 

       res.status(HttpStatus.OK).json(review); 
    } catch (error) {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR , error: (error as Error).message,});
    }
  };

  async updateCourseReview(req: Request, res: Response): Promise<void> {
    try {
        const {userId, courseId} = req.params
        const {reviewText, rating} = req.body
        
        const existingReview = await this.reviewService.updateCourseReview(userId, courseId, reviewText, rating)
         res.status(HttpStatus.OK).json(existingReview);
    } catch (error) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.UNEXPECTED_ERROR,
            error: (error as Error).message,
          });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
        const { courseId, userId } = req.params;
    const review = await this.reviewService.deleteReview( courseId, userId );

    if (!review) {
       res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.NO_REVIEW });
      return;
    }

    res.status(HttpStatus.OK).json({ message: MESSAGES.REVIEW_DELETED});
    } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR, error:(error as Error).message})
    }
  }
}
