import { Request, Response } from "express";
import Wishlist, { IWishlist } from "../models/wishlistModel";
import Course from "../../courses/models/courseModel";
import User from "../../user-management/models/UserModel";
import { IWishlistService } from "../services/IWishlistService";
import { IWishlistController } from "./IWishlistController";

export class WishlistController implements IWishlistController {
  private wishlistService: IWishlistService;

  constructor(wishlistService: IWishlistService) {
    this.wishlistService = wishlistService;
  }

  async addToWishlist(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const wishlist = await this.wishlistService.addToWishlist(
        userId,
        courseId
      );
      res.status(200).json(wishlist);
    } catch (error) {
      if (error instanceof Error && error.message) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  }

  async getWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      // console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", userId);

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const wishlist = await this.wishlistService.getWishlist(userId);

      if (!wishlist || wishlist.courses.length === 0) {
        res.status(404).json({ message: "Wishlist not found" });
        return;
      }

      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: (error as Error).message,
      });
    }
  }

  async removeFromWishlist(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const updatedWishlist = await this.wishlistService.removeFromWishlist(userId,courseId);

      if (!updatedWishlist) {
        res.status(404).json({ message: "Wishlist not found" });
        return;
      }

      res.status(200).json(updatedWishlist);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: (error as Error).message,
      });
    }
  }
}
