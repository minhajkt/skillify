import express from 'express'
import { courseController } from './controllers/courseController'

const courseRouter = express.Router()

courseRouter.post('/course/create-course', courseController.createCourse)

export default courseRouter;