import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";
import Course from "../models/courseModel";
import { ICourseService } from "../services/ICourseService";
import { ICourseController } from "./ICourseController";


export class CourseController implements ICourseController {
  private courseService: ICourseService;
  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;
      console.log("course data req.nody", courseData);
      if (req.file) {
        courseData.thumbnail = req.file.path;
      }

      const newCourse = await this.courseService.createCourse(courseData,req.file);
      res.status(201).json({ newCourse, message: "New Course created successfully" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();

       res.status(200).json(courses);
    } catch (error) {
       res.status(500).json({
        message: "An unexpected error occured.",
        error: (error as Error).message,
      });
    }
  };

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
    const categories = await this.courseService.getCategories()
       res.status(200).json(categories);
    } catch (error) {
       res.status(500).json({message: "An unexpected error occured",error: (error as Error).message,});
    }
  };

  // for user course viewing

  async getUserCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
         res.status(400).json({ message: "Invalid course ID" });
      }

      const userCourse = await this.courseService.getUserCourse(courseId);

       res.status(200).json(userCourse);
    } catch (error) {console.log("Error occured when trying to view user course video part",error);
         res.status(500).json({message: "An unexpected error occured",error: (error as Error).message,});
    }
  };
}
