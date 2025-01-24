import { Request, Response } from "express";
import { LectureService } from "../services/lectureService";
import { LectureRepository } from "../repositories/lectureRepository";
import { CourseService } from "../../courses/services/courseService";
import { CourseRepository } from "../../courses/repositories/courseRepository";
import mongoose from "mongoose";
import { cloudinary, uploadVideo } from "../../../config/cloudinaryConfig";
import { ILectureService } from "../services/ILectureService";
import { ILectureController } from "./ILectureController";
import { ICourseService } from "../../courses/services/ICourseService";


interface LectureData {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  courseId: mongoose.Types.ObjectId;
}

export class LectureController implements ILectureController {
  private lectureService: ILectureService;

  constructor(lectureService: ILectureService) {
    this.lectureService = lectureService;
  }

  async createLecture(req: Request, res: Response): Promise<void> {
    try {
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
        res.status(400).json({
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

        const newLecture = await this.lectureService.createLecture(
          lectureData,
          courseId
        );
        if (!newLecture) {
          res.status(400).json({
            message: `Failed to create lecture: ${lectureData.title}`,
          });
          return;
        }

        const lectureId: mongoose.Types.ObjectId =
          newLecture._id as mongoose.Types.ObjectId;
        await this.lectureService.addLectureToCourse(
          lectureData.courseId,
          lectureId
        );

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
  }

  async editLecture(req: Request, res: Response): Promise<void> {
    try {
      const lectureId = req.params.lectureId;
      const updatedData = req.body;

      if (Array.isArray(req.files) && req.files.length > 0) {
        updatedData.videoUrls = req.files.map((file) => file.path);
      } else if (
        req.files &&
        Object.values(req.files).some((files) => files.length > 0)
      ) {
        const videoFiles = Object.values(req.files).flat();
        updatedData.videoUrls = videoFiles.map((file) => file.path);
      }

      const updatedLecture = await this.lectureService.editLecture(
        lectureId,
        updatedData,
        req.file
      );

      if (!updatedLecture) {
        res.status(404).json({ message: "Lecture not found" });
        return;
      }

      res.status(200).json({
        message: "Lecture updated successfully",
        lecture: updatedLecture,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getLecturesByCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      console.log("id", courseId);
      const lectures = await this.lectureService.getLecturesByCourse(courseId);
      console.log("back with vid", lectures);

      const lecturesMetadata = lectures.map((lecture) => {
        const { videoUrl, ...rest } = lecture.toObject();
        // console.log("back without vid", rest);

        return rest;
      });
      res.status(200).json({ lectures: lecturesMetadata });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getLectureById(req: Request, res: Response): Promise<void> {
    try {
      const { lectureId } = req.params;
      // console.log("Fetching lecture by ID:", lectureId);

      const lecture = await this.lectureService.getLectureById(lectureId);

      if (!lecture) {
        res.status(404).json({ message: "Lecture not found" });
        return;
      }

      res.status(200).json(lecture);
    } catch (error) {
      console.error("Error fetching lecture by ID:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
