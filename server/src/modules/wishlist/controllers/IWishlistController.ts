import { Request, Response } from "express";

export interface IWishlistController {
  addToWishlist(req: Request, res: Response): Promise<void>;
  getWishlist(req: Request, res: Response): Promise<void>;
  removeFromWishlist(req: Request, res: Response): Promise<void>;
}