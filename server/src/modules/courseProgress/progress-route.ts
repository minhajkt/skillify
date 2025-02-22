import { Request, Response, Router } from "express";
import { ProgressRepository } from "./repositories/progressRepository";
import { ProgressService } from "./services/progressService";
import { ProgressController } from "./controllers/progressController";
import { cloudinary } from "../../config/cloudinaryConfig";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import Progress from './models/progressModel'
import axios from "axios";

const progressRouter = Router()

const progressRepository = new ProgressRepository()
const progressService = new ProgressService(progressRepository)
const progressController = new ProgressController(progressService)

progressRouter.get('/progress/get-progress/:userId/:courseId', authenticateJWT,progressController.findProgress.bind(progressController))
progressRouter.put('/progress/update-progress/:userId/:courseId/:lectureId', authenticateJWT,progressController.markLectureCompleted.bind(progressController))
progressRouter.post('/progress/generate-certificate', authenticateJWT,progressController.generateCertificate.bind(progressController))
progressRouter.get('/progress/download-certificate', authenticateJWT,progressController.downloadCertificate.bind(progressController))

export default progressRouter;