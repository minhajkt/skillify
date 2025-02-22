import express from "express";
import {
  handleValidationErrors,
  validateCourseCreation,
  validateCourseUpdate,
} from "../../middlewares/validationMiddleware";
import { upload } from "../../config/cloudinaryConfig";
import { CourseRepository } from "./repositories/courseRepository";
import { CourseService } from "./services/courseService";
import { CourseController } from "./controllers/CourseController";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const courseRouter = express.Router();

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const coursecontroller = new CourseController(courseService);

courseRouter.post(
  "/course/create-course",
  authenticateJWT,
  upload.single("thumbnail"),
  validateCourseCreation,
  handleValidationErrors,
  coursecontroller.createCourse.bind(coursecontroller)
);

courseRouter.put('/course/:courseId', authenticateJWT,upload.single('thumbnail'), validateCourseUpdate, handleValidationErrors, coursecontroller.editCourse.bind(coursecontroller))
courseRouter.get('/course/our-courses',coursecontroller.getAllCourses.bind(coursecontroller))
courseRouter.get('/course/categories',coursecontroller.getCategories.bind(coursecontroller))
courseRouter.get('/users/course-section/:courseId', authenticateJWT,coursecontroller.getUserCourse.bind(coursecontroller))
courseRouter.patch("/course-request/:id/approval", coursecontroller.blockCourse.bind(coursecontroller));
courseRouter.get('/total', coursecontroller.countCourses.bind(coursecontroller))

export default courseRouter;
