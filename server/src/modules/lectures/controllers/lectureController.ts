import { Request, Response } from "express";
import { LectureService } from "../services/lectureService";
import { LectureRepository } from "../repositories/lectureRepository";
import { CourseService } from "../../courses/services/courseService";
import { CourseRepository } from "../../courses/repositories/courseRepository";
import mongoose from "mongoose";
import { cloudinary, uploadVideo } from "../../../config/cloudinaryConfig";

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
  static createLecture = async (req: Request, res: Response): Promise<void> => {
    try {
      // console.log('reqqqqqqqqqqqqqqqqqqqqqqqqqqqq',req.files);
      // console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqq boddddddddddd", req.body);
      if (!req.files || !Array.isArray(req.files)) {
        res
          .status(400)
          .json({ message: "Video files are required for all lectures" });
        return;
      }

      const lecturesData = JSON.parse(req.body.lectures) as LectureData[];

      if (!mongoose.Types.ObjectId.isValid(lecturesData[0].courseId)) {
        res.status(400).json({ message: "Invalid courseId format" });
        return;
      }

      const videos = req.files as Express.Multer.File[];
      if (videos.length !== lecturesData.length) {
        res
          .status(400)
          .json({
            message: "Each lecture must have a corresponding video file",
          });
        return;
      }

      const createdLectures = [];
      const courseId = lecturesData[0].courseId;

      for (let i = 0; i < lecturesData.length; i++) {
        const lectureData = {
          title: lecturesData[i].title,
          description: lecturesData[i].description,
          duration: Number(lecturesData[i].duration),
          order: Number(lecturesData[i].order),
          courseId: lecturesData[i].courseId,
          videoUrl: videos[i].path,
        };

        const newLecture = await lectureService.createLecture(lectureData, courseId);
        if (!newLecture) {
          res
            .status(400)
            .json({
              message: `Failed to create lecture: ${lectureData.title}`,
            });
          return;
        }

        const lectureId: mongoose.Types.ObjectId =
          newLecture._id as mongoose.Types.ObjectId;
        await courseService.addLectureToCourse(lectureData.courseId, lectureId);

        createdLectures.push(newLecture);
      }

      res.status(201).json({
        message: "Lectures created successfully",
        lectures: createdLectures,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error(error);
    }
  };
  // static createLecture = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const lecturesData = req.body as LectureData[];
  //     // console.log('lecture adat is ', lectureData);

  //     // console.log("Received lecture data:", lecturesData);
  //   for (const lectureData of lecturesData) {
  //     if (!mongoose.Types.ObjectId.isValid(lectureData.courseId)) {
  //       res.status(400).json({ message: "Invalid courseId format" });
  //       return;
  //     }

  //     if (!lectureData.videoUrl) {
  //       res.status(400).json({ message: "Video URL is required" });
  //       return;
  //     }
  //   }

  //     const createdLectures = [];

  //     for (const lectureData of lecturesData) {
  //     const newLecture = await lectureService.createLecture(lectureData);
  //     if (!newLecture) {
  //       res.status(400).json({ message: `Failed to create lecture: ${lectureData.title}` });
  //       return;
  //     }

  //     const lectureId: mongoose.Types.ObjectId = newLecture._id as mongoose.Types.ObjectId;

  //     await courseService.addLectureToCourse(lectureData.courseId, lectureId);
  //     createdLectures.push(newLecture);
  //   }
  //   res.status(201).json({
  //     message: "Lectures created successfully",
  //     lectures: createdLectures,
  //   });
  //   } catch (error) {
  //     res.status(500).json({ message: (error as Error).message });
  //     console.log(error);

  //   }
  // };

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
