import mongoose from "mongoose";
import { ILecture } from "../models/lectureModel";
import { ICourse } from "../../courses/models/courseModel";

export interface ILectureRepository {
  createLecture(lectureData: Partial<ILecture>): Promise<ILecture>;
  updateCourseStatus(courseId: mongoose.Types.ObjectId, status: string): Promise<ICourse | null>
  getLecturesByCourse(courseId: string): Promise<ILecture[]>;
  addLecture(courseId: mongoose.Types.ObjectId,lectureId: mongoose.Types.ObjectId): Promise<void>
  updateLecture(lectureId: string,updatedData: Partial<ILecture>): Promise<ILecture | null> 
  getLectureById(lectureId: string): Promise<ILecture | null>
}
