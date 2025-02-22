import mongoose from "mongoose";
import { ICourseRepository } from "../../courses/repositories/ICourseRepository";
import { IWishlist } from "../models/wishlistModel";
import { IWishlistRepository } from "../repositories/IWishlistRepository";
import { IWishlistService } from "./IWishlistService";

export class WishlistService implements IWishlistService {
  private wishlistRepo: IWishlistRepository;
  private courseRepo: ICourseRepository;

  constructor(
    wishlistRepo: IWishlistRepository,
    courseRepo: ICourseRepository
  ) {
    this.wishlistRepo = wishlistRepo;
    this.courseRepo = courseRepo;
  }

  async addToWishlist(userId: string, courseId: string): Promise<IWishlist> {
    const course = await this.courseRepo.findCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    let wishlist = await this.wishlistRepo.findWishlistByUserId(userId);

    if (!wishlist) {
      wishlist = await this.wishlistRepo.createWishlist(userId, [courseId]);
      return wishlist;
    }

    if (
      wishlist.courses.some((id) => id.equals(new mongoose.Types.ObjectId(courseId)))
    ) {
      throw new Error("Course is already in the wishlist");
    }

    wishlist.courses.push(new mongoose.Types.ObjectId(courseId));
    return this.wishlistRepo.saveWishlist(wishlist);
  }

  async getWishlist(userId: string): Promise<IWishlist | null> {
    const wishlist = await this.wishlistRepo.findWishlistByUserId(userId);

    if (!wishlist) {
      return null;
    }

    const populatedWishlist = await this.wishlistRepo.populateCourses(wishlist);

    return populatedWishlist;
  }

  async removeFromWishlist(userId: string,courseId: string): Promise<IWishlist | null> {
    const wishlist = await this.wishlistRepo.findWishlistByUserId(userId);

    if (!wishlist) {
      return null;
    }

    const updatedCourses = wishlist.courses.filter(
      (id) => !id.equals(courseId)
    );

    wishlist.courses = updatedCourses;

    return this.wishlistRepo.saveWishlist(wishlist);
  }
}
