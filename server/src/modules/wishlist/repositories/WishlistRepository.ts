import { BaseRepository } from "../../../common/baseRepository";
import Wishlist, { IWishlist } from "../models/wishlistModel";
import { IWishlistRepository } from "./IWishlistRepository";


export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository {
  constructor() {
      super(Wishlist)
    }
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
