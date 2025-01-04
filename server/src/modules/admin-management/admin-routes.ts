import { Router } from "express";
import { AdminController } from "./controllers/adminUserAndTutorController";
import {
  handleValidationErrors,
  validateForgotPassword,
  validateUserLogin,
} from "../../middlewares/validationMiddleware";
import { UserController } from "../user-management/controllers/UserController";
import { checkRole } from "../../middlewares/checkRole";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const adminRouter = Router();

adminRouter.post("/admin/login", validateUserLogin, UserController.loginAdmin);
adminRouter.post("/admin/forgot-password", UserController.forgotPassword);
adminRouter.post(
  "/admin/reset-password",
  validateForgotPassword,
  handleValidationErrors,
  UserController.resetPassword
);
adminRouter.post("/admin/logout", UserController.logoutUser);

adminRouter.get(
  "/admin/students",
  authenticateJWT,
  AdminController.getStudents
);
adminRouter.patch(
  "/admin/students/:id/status",
  authenticateJWT,
  checkRole(["admin"]),
  AdminController.updateStudentStatus
);

adminRouter.get("/admin/tutors", authenticateJWT, AdminController.getTutors);
adminRouter.patch(
  "/admin/tutors/:id/status",
  authenticateJWT,
  AdminController.updateTutorStatus
);

adminRouter.get("/admin/tutor-requests", AdminController.getTutorRequests)
adminRouter.patch(
  "/admin/tutor-request/:id/approval",
  authenticateJWT,
  checkRole(["admin"]),
  AdminController.updateTutorApproval
);

adminRouter.get('/admin/courses', AdminController.getAllCourse)
adminRouter.get('/admin/course-requests', AdminController.getCourseRequests)
adminRouter.patch('/admin/course-request/:id/approval', AdminController.updateCourseApproval)

export default adminRouter;
