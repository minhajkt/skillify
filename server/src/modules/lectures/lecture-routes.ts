import express from "express";
import { LectureController } from "./controllers/lectureController";
import { upload, uploadVideo } from "../../config/cloudinaryConfig";
import { LectureRepository } from "./repositories/lectureRepository";
import { LectureService } from "./services/lectureService";
import { CourseService } from "../courses/services/courseService";
import { CourseRepository } from "../courses/repositories/courseRepository";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const lectureRouter = express.Router();

const lectureRepository = new LectureRepository()
const lectureService = new LectureService(lectureRepository)
const lectureController = new LectureController(lectureService)

lectureRouter.post("/lectures", authenticateJWT,uploadVideo.array('videoFiles'), lectureController.createLecture.bind(lectureController));
lectureRouter.put("/lecture/:lectureId",uploadVideo.array('videoFiles'), lectureController.editLecture.bind(lectureController));
lectureRouter.get("/courses/:courseId/lectures",lectureController.getLecturesByCourse.bind(lectureController));
lectureRouter.get("/lectures/:lectureId",authenticateJWT, lectureController.getLectureById.bind(lectureController));


export default lectureRouter;
