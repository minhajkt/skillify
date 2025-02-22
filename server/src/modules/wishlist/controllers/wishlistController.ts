import { Request, Response } from "express";
import Wishlist, { IWishlist } from "../models/wishlistModel";
import Course from "../../courses/models/courseModel";
import User from "../../user-management/models/UserModel";
import { IWishlistService } from "../services/IWishlistService";
import { IWishlistController } from "./IWishlistController";
import { AuthRequest } from "../../../types/custom";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";

export class WishlistController implements IWishlistController {
  private wishlistService: IWishlistService;

  constructor(wishlistService: IWishlistService) {
    this.wishlistService = wishlistService;
  }

  async addToWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USERID_NOT_FOUND });
        return;
      }

      const wishlist = await this.wishlistService.addToWishlist(
        userId,
        courseId
      );
      res.status(HttpStatus.OK).json(wishlist);
    } catch (error) {
      if (error instanceof Error && error.message) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.UNEXPECTED_ERROR });
      }
    }
  }

  async getWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USERID_NOT_FOUND });
        return;
      }

      const wishlist = await this.wishlistService.getWishlist(userId);

      if (!wishlist || wishlist.courses.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.WISHLIST_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(wishlist);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USERID_NOT_FOUND });
        return;
      }

      const updatedWishlist = await this.wishlistService.removeFromWishlist(userId,courseId);

      if (!updatedWishlist) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.WISHLIST_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(updatedWishlist);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }
}
