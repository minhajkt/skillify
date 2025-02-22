import { BaseRepository } from "../../../common/baseRepository";
import Review, { IReview } from "../models/reivewModel";
import { IReviewRepository } from "./IReviewRepository";

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(Review)
  }
  async addReview(reviewData: Partial<IReview>): Promise<IReview> {
    // const review = new Review(reviewData);
    // return await review.save();
    return await this.create(reviewData)
  }

  async getReviews(courseId: string):Promise<IReview[]> {
    return await Review.find({courseId}).populate('userId', "name profilePhoto")
    
  }

  async getUserReview(userId: string, courseId: string): Promise<IReview | null> {
  return await Review.findOne({ userId, courseId }).populate("userId", "name profilePhoto");
}

async updateCourseReview(userId: string, courseId: string, reviewText: string, rating: number) {

        const review = await Review.findOne({userId, courseId})
        if(!review) {
            return null
        }
        review.reviewText = reviewText
        review.rating = rating
        
        await review.save()
        return review
}

  async deleteReview(courseId: string, userId: string): Promise<IReview | null> {
    return await Review.findOneAndDelete({ courseId, userId });
  }
}