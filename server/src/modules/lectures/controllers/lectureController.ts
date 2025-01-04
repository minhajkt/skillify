import { Request, Response } from "express";
import { LectureService } from "../services/lectureService";
import { LectureRepository } from "../repositories/lectureRepository";
import { CourseService } from "../../courses/services/courseService";
import { CourseRepository } from "../../courses/repositories/courseRepository";
import mongoose from "mongoose";

const lectureService = new LectureService(new LectureRepository());
const courseService = new CourseService(new CourseRepository())
interface LectureData {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  courseId: mongoose.Types.ObjectId;
}


export class LectureController {
  static createLecture = async (req: Request, res: Response):Promise<void> => {
    try {
      const lectureData = req.body as LectureData;
        // console.log('lecture adat is ', lectureData);
        
// console.log("Received courseId:", lectureData.courseId);
        if (!mongoose.Types.ObjectId.isValid(lectureData.courseId)) {
        res.status(400).json({ message: "Invalid courseId format" });
        return; 
        }

      const newLecture = await lectureService.createLecture(lectureData);
    console.log("New lecture created:", newLecture);
        if (!newLecture) {
         res
            .status(400)
            .json({ message: "Failed to create lecture" });
        return;
        }


        
   const lectureId: mongoose.Types.ObjectId = newLecture._id as mongoose.Types.ObjectId;
      await courseService.addLectureToCourse(lectureData.courseId, lectureId);
      res
        .status(201)
        .json({ newLecture, message: "New Lecture created successfully" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  static getLecturesByCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const lectures = await lectureService.getLecturesByCourse(courseId);
      res.status(200).json({ lectures });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
}
