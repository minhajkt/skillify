import { Request, Response } from "express";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";
import { cloudinary } from "../../../config/cloudinaryConfig";
import {Schema} from 'mongoose'
import Course from '../models/courseModel'

const courseService = new CourseService(new CourseRepository())

export class courseController {
    static createCourse = async(req: Request, res: Response) => {
        try {
            const courseData = req.body;
            console.log('course data req.nody', courseData);
            
            if(req.file) {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:"course_thumbnails",
                    resource_type:"auto"
                    // transformation: [{ width: 500, height: 500, crop: "limit" }],
                })
                console.log('req.file', req.file);
                
                courseData.thumbnail = result.secure_url
            }
            const newCourse = await courseService.createCourse(courseData);
            res.status(201).json({newCourse, message:"New Course created successfully"})
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    static getAllCourses = async(req: Request, res: Response) => {
        try {
            const courses =await courseService.getAllCourses()
            if(!courses) {
                return res.status(404).json({message: "No courses found"})
            }
            return res.status(200).json(courses)
        } catch (error) {
            return res.status(500).json({message: "An unexpected error occured.",error:(error as Error).message})
        }
    }

    static getCategories = async(req: Request, res:Response) => {
        try {
            const categories = (Course.schema.path('category') as Schema.Types.String).enumValues
            return res.status(200).json(categories)
        } catch (error) {
            return res.status(500).json({message:"An unexpected error occured", error:(error as Error).message})
        }
    }
}