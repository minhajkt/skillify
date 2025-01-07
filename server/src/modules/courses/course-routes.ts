import express from 'express'
import { courseController } from './controllers/courseController'
import { handleValidationErrors, validateCourseCreation } from '../../middlewares/validationMiddleware';
import { upload } from '../../config/cloudinaryConfig';

const courseRouter = express.Router()

courseRouter.post(
  "/course/create-course",
  upload.single("thumbnail"),
  validateCourseCreation,
  handleValidationErrors, courseController.createCourse
);
courseRouter.get('/course/categories', courseController.getCategories)

export default courseRouter;