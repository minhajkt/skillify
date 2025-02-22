import { NextFunction, Request, Router } from "express";

import {
  handleValidationErrors,
  validateForgotPassword,
  validateTutorCreation,
  validateUserCreation,
  validateUserLogin,
  validateUserUpdation,
} from "../../middlewares/validationMiddleware";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { AdminController } from "../admin-management/controllers/adminController";
import { upload } from "../../config/cloudinaryConfig";
import User from "../user-management/models/UserModel";
import { checkRole } from "../../middlewares/checkRole";
import { UserRepository } from "./repositories/UserRepository";
import { UserService } from "./services/UserService";
import { confirmPassword } from "../../middlewares/confirmPassword";
import { UserController } from "./controllers/UserController";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


router.post("/users/refresh-token", userController.refreshAccessToken.bind(userController));

router.post(
  "/users/signup",
  validateUserCreation,
  handleValidationErrors,
  confirmPassword,
  userController.createUser.bind(userController)
);

router.post("/users/verify-otp", userController.verifyOtp.bind(userController));
router.post('/users/resend-otp', userController.resendOtp.bind(userController))
router.post(
  "/users/login",
  validateUserLogin,
  userController.loginUser.bind(userController)
);
router.get(
  "/users/user/:id",
  // authenticateJWT,
  userController.getUserById.bind(userController)
);
router.put(
  "/users/update-user/:id",
  authenticateJWT,
  // authenticateJWT("user"),
  upload.single("profilePhoto"),
  validateUserUpdation,
  handleValidationErrors,
  userController.updateUser.bind(userController)
);
router.post(
  "/users/forgot-password",
  userController.forgotPassword.bind(userController)
);
router.post(
  "/users/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  userController.resetPassword.bind(userController)
);
router.post("/auth/google", userController.googleSignIn.bind(userController));

router.post("/users/logout", userController.logoutUser.bind(userController));

// routes for tutors

router.post(
  "/tutors/signup",
  upload.array("certificates", 10),
  validateTutorCreation,
  handleValidationErrors,
  confirmPassword,
  userController.createUser.bind(userController)
);
router.post(
  "/tutors/verify-otp",
  userController.verifyOtp.bind(userController)
);
router.post(
  "/tutors/login",
  validateUserLogin,
  userController.loginTutor.bind(userController)
);
router.get(
  "/tutors/user/:id",
  authenticateJWT,
  userController.getUserById.bind(userController)
);

router.put(
  "/tutors/update-user/:id",
  authenticateJWT,
  validateUserUpdation,
  handleValidationErrors,
  userController.updateUser.bind(userController)
);
router.post(
  "/tutors/forgot-password",
  userController.forgotPassword.bind(userController)
);
router.post(
  "/tutors/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  userController.resetPassword.bind(userController)
);

router.post("/tutors/logout", userController.logoutUser.bind(userController));

// admin

router.post(
  "/admin/login",
  validateUserLogin,
  userController.loginAdmin.bind(userController)
);
router.post(
  "/admin/forgot-password",
  userController.forgotPassword.bind(userController)
);
router.post(
  "/admin/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  userController.resetPassword.bind(userController)
);
router.post("/admin/logout", userController.logoutUser.bind(userController));

// router.get("/validate-session", authenticateJWT, (req, res) => {
//   if (req.user && req.user.isActive) {

//     res.status(200).json({ message: "Session is valid" });
//   } else {
//     res.status(403).json({ message: "Your account is blocked" });
//   }
// });

router.get("/courses/:id", userController.getCourseById.bind(userController));

// stripe payment route
router.post(
  "/course/checkout/:courseId",
  authenticateJWT,
  userController.stripePayment.bind(userController)
);

router.get('/user/tutor-count',userController.getTutorCount.bind(userController))


export default router;
