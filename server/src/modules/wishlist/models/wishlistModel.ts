import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    courses: mongoose.Types.ObjectId[];
}
export const wishlistSchema: Schema = new mongoose.Schema(
  {
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);