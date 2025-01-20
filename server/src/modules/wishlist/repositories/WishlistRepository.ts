import Wishlist, { IWishlist } from "../models/wishlistModel";
import { IWishlistRepository } from "./IWishlistRepository";


export class WishlistRepository implements IWishlistRepository {
  async findWishlistByUserId(userId: string): Promise<IWishlist | null> {
    return Wishlist.findOne({ userId });
  }

  async createWishlist(userId: string, courses: string[]): Promise<IWishlist> {
    const wishlist = new Wishlist({ userId, courses });
    return wishlist.save();
  }

  async saveWishlist(wishlist: IWishlist): Promise<IWishlist> {
    return wishlist.save();
  }

  async populateCourses(wishlist: IWishlist): Promise<IWishlist> {
    return wishlist.populate("courses"); 
  }
}
