import express from 'express'
import { TutorController } from "./controllers/tutorController"
import { authenticateJWT } from '../../middlewares/authenticateJWT'
import { TutorRepository } from './repositories/tutorRepository'
import { TutorService } from './services/tutorService'

const tutorRepository = new TutorRepository()
const tutorService = new TutorService(tutorRepository)
const tutorController = new TutorController(tutorService)

const tutorRouter = express.Router()

tutorRouter.get('/tutor/courses',authenticateJWT, tutorController.getTutorCourses.bind(tutorController))
tutorRouter.get("/tutor/courses/:courseId", tutorController.getCourseDetails.bind(tutorController))
export default tutorRouter
