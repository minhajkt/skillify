import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    reviewText: string;
}
export const reviewSchema: Schema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);


export default mongoose.model<IReview>("Review", reviewSchema);
