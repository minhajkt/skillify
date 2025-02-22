import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";

export interface ICourseService {
    createCourse(courseData: Partial<ICourse>, file?: Express.Multer.File): Promise<ICourse | null>
    getAllCourses() : Promise<ICourse[]>;
    getCategories(): Promise<string[]>;
    getUserCourse(courseId: string): Promise<ICourse | null>
    addLectureToCourse(courseId: mongoose.Types.ObjectId,lectureId: mongoose.Types.ObjectId): Promise<void> 
     editCourse(courseId: string,updatedData: Partial<ICourse>, file?: Express.Multer.File): Promise<ICourse | null>
     toggleBlockStatus(courseId:string, status:string):Promise<ICourse>
     countCourses() : Promise<number>
}