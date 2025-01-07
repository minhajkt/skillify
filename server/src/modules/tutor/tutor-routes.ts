import express from 'express'
import { tutorController } from "./controllers/tutorController"
import { authenticateJWT } from '../../middlewares/authenticateJWT'

const tutorRouter = express.Router()

tutorRouter.get('/tutor/courses',authenticateJWT, tutorController.getTutorCourses)
tutorRouter.get("/tutor/courses/:courseId", tutorController.getCourseDetails)
export default tutorRouter
