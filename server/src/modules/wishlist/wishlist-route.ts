import express from "express";
import {
//   addToWishlist,
//   removeFromWishlist,
//   getWishlist,
  WishlistController,
} from "./controllers/wishlistController";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { WishlistRepository } from "./repositories/WishlistRepository";
import { UserRepository } from "../user-management/repositories/UserRepository";
import { WishlistService } from "./services/WishlistService";
import { CourseRepository } from "../courses/repositories/courseRepository";

const wishlistRouter = express.Router();

const wishlistRepo = new WishlistRepository();
const courseRepo = new CourseRepository();
const wishlistService = new WishlistService(wishlistRepo, courseRepo);
const wishlistcontroller = new WishlistController(wishlistService);

wishlistRouter.post("/wishlist/add", authenticateJWT, wishlistcontroller.addToWishlist.bind(wishlistcontroller));
wishlistRouter.get("/wishlist" , authenticateJWT,wishlistcontroller.getWishlist.bind(wishlistcontroller));
wishlistRouter.post("/wishlist/remove", authenticateJWT, wishlistcontroller.removeFromWishlist.bind(wishlistcontroller));

export default wishlistRouter;
