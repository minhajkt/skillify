import express from "express";
import { LectureController } from "./controllers/lectureController";

const lectureRouter = express.Router();

lectureRouter.post("/lectures", LectureController.createLecture);
lectureRouter.get(
  "/courses/:courseId/lectures",
  LectureController.getLecturesByCourse
);

export default lectureRouter;
