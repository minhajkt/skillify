import { IWishlist } from "../models/wishlistModel";

export interface IWishlistService {
  addToWishlist(userId: string, courseId: string): Promise<IWishlist>;
  getWishlist(userId: string): Promise<IWishlist | null>;
  removeFromWishlist(
    userId: string,
    courseId: string
  ): Promise<IWishlist | null>;
}