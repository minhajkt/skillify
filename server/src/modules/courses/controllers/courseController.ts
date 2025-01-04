import { Request, Response } from "express";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";

const courseService = new CourseService(new CourseRepository())

export class courseController {
    static createCourse = async(req: Request, res: Response) => {
        try {
            const courseData = req.body;
            const newCourse = await courseService.createCourse(courseData);
            res.status(201).json({newCourse, message:"New Course created successfully"})
        } catch (error) {
            res.status(500).json({message: (error as Error).message})
        }
    }
}