import express from "express";
import { LectureController } from "./controllers/lectureController";
import { upload, uploadVideo } from "../../config/cloudinaryConfig";

const lectureRouter = express.Router();

lectureRouter.post("/lectures",uploadVideo.array('videoFiles'), LectureController.createLecture);
lectureRouter.get(
  "/courses/:courseId/lectures",
  LectureController.getLecturesByCourse
);


export default lectureRouter;
