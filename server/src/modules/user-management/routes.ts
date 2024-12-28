import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { handleValidationErrors, validateForgotPassword, validateUserCreation, validateUserLogin, validateUserUpdation } from "../../middlewares/validationMiddleware";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const router = Router()

router.post('/signup', validateUserCreation, handleValidationErrors , UserController.createUser)
router.post('/verify-otp', UserController.verifyOtp)
router.post("/login", validateUserLogin , UserController.loginUser);
router.get("/user/:id", authenticateJWT, UserController.getUserById);
router.put('/update-user/:id', authenticateJWT, validateUserUpdation, handleValidationErrors , UserController.updateUser)
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password",validateForgotPassword,handleValidationErrors, UserController.resetPassword);
router.post("/logout", UserController.logoutUser);

export default router;



