import express from "express";
import {
  handleValidationErrors,
  validateCourseCreation,
} from "../../middlewares/validationMiddleware";
import { upload } from "../../config/cloudinaryConfig";
import { CourseRepository } from "./repositories/courseRepository";
import { CourseService } from "./services/courseService";
import { CourseController } from "./controllers/CourseController";

const courseRouter = express.Router();

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const coursecontroller = new CourseController(courseService);

courseRouter.post(
  "/course/create-course",
  upload.single("thumbnail"),
  validateCourseCreation,
  handleValidationErrors,
  coursecontroller.createCourse.bind(coursecontroller)
);
courseRouter.get('/course/categories', coursecontroller.getCategories.bind(coursecontroller))
courseRouter.get('/users/course-section/:courseId', coursecontroller.getUserCourse.bind(coursecontroller))

export default courseRouter;
