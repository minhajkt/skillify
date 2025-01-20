import { IWishlist } from "../models/wishlistModel";

export interface IWishlistRepository {
  findWishlistByUserId(userId: string): Promise<IWishlist | null>;
  createWishlist(userId: string, courses: string[]): Promise<IWishlist>;
  saveWishlist(wishlist: IWishlist): Promise<IWishlist>;
  populateCourses(wishlist: IWishlist): Promise<IWishlist>;
}