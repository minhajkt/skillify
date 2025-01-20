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

// export const removeFromWishlist = async (req: Request, res: Response) => {
//   const { courseId } = req.body;
//   const userId = req.user._id;

//   try {
//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     wishlist.courses = wishlist.courses.filter((id) => !id.equals(courseId));
//     await wishlist.save();

//     res.status(200).json(wishlist);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




/////////////////////////////////////////////////////////////////////

// export const addToWishlist = async (req: Request, res: Response) => {
//   const { courseId } = req.body;
//   const userId = req.user?._id;

//   try {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     let wishlist = await Wishlist.findOne({ userId });

//     if (!wishlist) {
//       wishlist = new Wishlist({
//         userId,
//         courses: [courseId],
//       });
//       await wishlist.save();
//       return res.status(201).json(wishlist);
//     }

//     if (wishlist.courses.includes(courseId)) {
//       return res
//         .status(400)
//         .json({ message: "Course is already in the wishlist" });
//     }

//     wishlist.courses.push(courseId);
//     await wishlist.save();

//     res.status(200).json(wishlist);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const removeFromWishlist = async (req: Request, res: Response) => {
//   const { courseId } = req.body;
//   const userId = req.user._id;

//   try {
//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     wishlist.courses = wishlist.courses.filter((id) => !id.equals(courseId));
//     await wishlist.save();

//     res.status(200).json(wishlist);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getWishlist = async (req: Request, res: Response) => {
//   const userId = req.user._id;

//   try {
//     const wishlist = await Wishlist.findOne({ userId }).populate("courses");
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     res.status(200).json(wishlist);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
