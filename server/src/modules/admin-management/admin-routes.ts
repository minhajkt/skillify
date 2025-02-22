import { Router } from "express";
import { AdminController } from "./controllers/adminController";
import {
  handleValidationErrors,
  validateForgotPassword,
  validateUserLogin,
} from "../../middlewares/validationMiddleware";
import { UserController } from "../user-management/controllers/UserController";
import { checkRole } from "../../middlewares/checkRole";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { AdminRepository } from "./repositories/AdminRepository";
import { AdminService } from "./services/adminService";

const adminRouter = Router();

const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)



adminRouter.get(
  "/admin/students",
  authenticateJWT,
  adminController.getStudents.bind(adminController)
);
adminRouter.patch(
  "/admin/students/:id/status",
  authenticateJWT,
  checkRole(["admin"]),
  adminController.updateStudentStatus.bind(adminController)
);

adminRouter.get("/admin/tutors", authenticateJWT, adminController.getTutors.bind(adminController));
adminRouter.get("/admin/tutor/:id",adminController.getTutorById.bind(adminController));
adminRouter.get("/admin/user/:id", authenticateJWT,adminController.getStudentById.bind(adminController));
adminRouter.patch("/admin/tutors/:id/status",authenticateJWT,adminController.updateTutorStatus.bind(adminController));


adminRouter.get("/admin/tutor-requests", authenticateJWT,adminController.getTutorRequests.bind(adminController));
adminRouter.patch(
  "/admin/tutor-request/:id/approval",
  authenticateJWT,
  checkRole(["admin"]),
  adminController.updateTutorApproval.bind(adminController)
);

adminRouter.get("/admin/course-requests",authenticateJWT ,adminController.getCourseRequests.bind(adminController));
adminRouter.patch(
  "/admin/course-request/:id/approval", authenticateJWT,
  adminController.updateCourseApproval.bind(adminController)
);

adminRouter.patch('/admin/course-request/:id/edit-approval', authenticateJWT , adminController.updateCourseEditApproval.bind(adminController))

adminRouter.get(
  "/admin/courses",
  adminController.getAllCourse.bind(adminController)
);


export default adminRouter;
