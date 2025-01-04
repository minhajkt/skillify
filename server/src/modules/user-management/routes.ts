import { Router } from "express";
import { UserController } from "./controllers/UserController";
import {
  handleValidationErrors,
  validateForgotPassword,
  validateTutorCreation,
  validateUserCreation,
  validateUserLogin,
  validateUserUpdation,
} from "../../middlewares/validationMiddleware";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { AdminController } from "../admin-management/controllers/adminUserAndTutorController";
import { upload } from "../../config/cloudinaryConfig";
import User from "../user-management/models/UserModel";

const router = Router();

router.post(
  "/users/signup",
  validateUserCreation,
  handleValidationErrors,
  UserController.createUser
);
router.post("/users/verify-otp", UserController.verifyOtp);
router.post("/users/login", validateUserLogin, UserController.loginUser);
router.get(
  "/users/user/:id",
  authenticateJWT,
  UserController.getUserById
);
router.put(
  "/users/update-user/:id",
  authenticateJWT,

  upload.single("profilePhoto"),
  validateUserUpdation,
  handleValidationErrors,
  UserController.updateUser
);
router.post("/users/forgot-password", UserController.forgotPassword);
router.post(
  "/users/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  UserController.resetPassword
);
router.post("/auth/google", UserController.googleSignIn);


// router.post(
//   "/users/update-profile-photo", authenticateJWT,
//   upload.single("profilePhoto"),
//   UserController.uploadProfilePhoto
// );
router.post("/users/logout", UserController.logoutUser);


// routes for tutors


router.post(
  "/tutors/signup",
  upload.array("certificates", 10),
  validateTutorCreation,
  handleValidationErrors,
  UserController.createUser
);
router.post("/tutors/verify-otp", UserController.verifyOtp);
router.post("/tutors/login", validateUserLogin, UserController.loginTutor);
router.get("/tutors/user/:id", authenticateJWT, UserController.getUserById);
router.put(
  "/tutors/update-user/:id",
  authenticateJWT,
  validateUserUpdation,
  handleValidationErrors,
  UserController.updateUser
);
router.post("/tutors/forgot-password", UserController.forgotPassword);
router.post(
  "/tutors/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  UserController.resetPassword
);
router.post("/tutors/logout", UserController.logoutUser);


// router.get("/users/me", authenticateJWT, async (req, res) => {
//   const user = await User.findById(req.user.id);
//   if (!user || !user.isActive) {
//     return res.status(403).json({ error: "User is blocked" });
//   }
//   res.json({ isActive: user.isActive, user });
// });


export default router;
