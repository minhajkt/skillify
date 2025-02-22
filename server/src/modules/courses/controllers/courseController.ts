import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";
import Course from "../models/courseModel";
import { ICourseService } from "../services/ICourseService";
import { ICourseController } from "./ICourseController";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";


export class CourseController implements ICourseController {
  private courseService: ICourseService;
  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;
      if (req.file) {
        courseData.thumbnail = req.file.path;
      }

      const newCourse = await this.courseService.createCourse(
        courseData,
        req.file
      );
      res
        .status(HttpStatus.CREATED)
        .json({ newCourse, message: MESSAGES.NEW_COURSE_CREATED });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: (error as Error).message });
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const updatedData = req.body;

      if (req.file) {
        updatedData.thumbnail = req.file.path;
      }

      const updatedCourse = await this.courseService.editCourse(
        courseId,
        updatedData,
        req.file
      );

      res.status(HttpStatus.OK).json({
        message: MESSAGES.COURSE_EDIT_SUBMITTED,
        course: updatedCourse,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();

      res.status(HttpStatus.OK).json(courses);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.courseService.getCategories();
      res.status(HttpStatus.OK).json(categories);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  // for user course viewing

  async getUserCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.INVALID_COURSE_ID });
      }

      const userCourse = await this.courseService.getUserCourse(courseId);

      res.status(HttpStatus.OK).json(userCourse);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async blockCourse(req:Request, res:Response):Promise<void> {
    const { id } = req.params;
    const { isApproved } = req.body;

    try {

      const updatedCourse = await this.courseService.toggleBlockStatus(
        id,
        isApproved
      );
      res.status(HttpStatus.OK).json(updatedCourse);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
    }
  }

  async countCourses(req: Request, res: Response): Promise<void> {
    try {
      const courseCount = await this.courseService.countCourses()
      if(!courseCount) {
        res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.COURSE_NOT_FOUND})
      }
        res.status(HttpStatus.OK).json(courseCount)
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: (error as Error).message})
    }
  }
}
