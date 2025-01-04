import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
  addLecture(courseId: mongoose.Types.ObjectId, lectureId: mongoose.Types.ObjectId): Promise<void> 
}