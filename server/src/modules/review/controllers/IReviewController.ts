import { Request, Response } from "express";

export interface IReviewController {
  addReview(req: Request, res: Response): Promise<void>;
  getReviews(req: Request, res: Response): Promise<void>;
  getUserReview(req: Request, res: Response): Promise<void>;
  updateCourseReview(req: Request, res: Response): Promise<void>;
}