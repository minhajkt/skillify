// import express from 'express'
import { enrollmentController } from './controllers/enrollmentController'
import { authenticateJWT } from '../../middlewares/authenticateJWT'
import {Router} from 'express'
import { EnrollmentRepository } from './repositories/enrollmentRepository'
import { EnrollmentService } from './services/enrollmentService'

const enrollmentRouter = Router()

const enrollmentRepository = new EnrollmentRepository()
const enrollmentService = new EnrollmentService(enrollmentRepository)
const enrollmentcontroller = new enrollmentController(enrollmentService)

// enrollmentRouter.post('/create-enrollment', enrollmentController.createEnrollment)   

enrollmentRouter.get('/enrollment/my-courses', authenticateJWT, enrollmentcontroller.getAllEnrolledCoursesByStudent.bind(enrollmentcontroller))
enrollmentRouter.get('/enrollment/total',authenticateJWT, enrollmentcontroller.totalEnrolledStudents.bind(enrollmentcontroller))
enrollmentRouter.get('/enrollment/total-revenue', enrollmentcontroller.totalRevenue.bind(enrollmentcontroller))
enrollmentRouter.get('/enrollment/strength', enrollmentcontroller.courseStrength.bind(enrollmentcontroller))
enrollmentRouter.get('/enrollment/my-students',authenticateJWT, enrollmentcontroller.getTutorsStudents.bind(enrollmentcontroller))
enrollmentRouter.get("/enrollment/revenue-report", enrollmentcontroller.revenueReport.bind(enrollmentcontroller));
// enrollmentRouter.get('/enrollment/total/:couseId', enrollmentController.totalStudentsInEachCourse)

export default enrollmentRouter;