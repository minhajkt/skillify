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
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";


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
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: MESSAGES.VIDEO_REQUIRED_FOR_LECTURES });
        return;
      }

      const lecturesData = JSON.parse(req.body.lectures) as LectureData[];

      if (!mongoose.Types.ObjectId.isValid(lecturesData[0].courseId)) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.INVALID_COURSE_FORMAT });
        return;
      }

      const videos = req.files as Express.Multer.File[];
      if (videos.length !== lecturesData.length) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: MESSAGES.VIDEO_REQUIRED_FOR_LECTURES,
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
          res.status(HttpStatus.BAD_REQUEST).json({
            message: MESSAGES.FAILED_LECTURE_CREATION,
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

      res.status(HttpStatus.CREATED).json({
        message: MESSAGES.LECTURES_CREATED,
        lectures: createdLectures,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }

  async editLecture(req: Request, res: Response): Promise<void> {
    try {
      const lectureId = req.params.lectureId;
      const updatedData = req.body;

      if (Array.isArray(req.files) && req.files.length > 0) {
        updatedData.videoUrl = req.files[0].path;
      } else if (
        req.files &&
        Object.values(req.files).some((files) => files.length > 0)
      ) {
        const videoFiles = Object.values(req.files).flat();
        updatedData.videoUrl = videoFiles[0].path;
      }

      const updatedLecture = await this.lectureService.editLecture(
        lectureId,
        updatedData,
      );

      if (!updatedLecture) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.LECTURE_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({
        message: MESSAGES.LECTURE_UPDATE_SUCCESS,
        lecture: updatedLecture,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }

  async getLecturesByCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const lectures = await this.lectureService.getLecturesByCourse(courseId);

      res.status(HttpStatus.OK).json({ lectures });
    
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }

  async getLectureById(req: Request, res: Response): Promise<void> {
    try {
      const { lectureId } = req.params;

      const lecture = await this.lectureService.getLectureById(lectureId);

      if (!lecture) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.LECTURE_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json(lecture);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }
}
