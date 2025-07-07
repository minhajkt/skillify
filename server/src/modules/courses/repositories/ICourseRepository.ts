import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";
import { CourseQueryOptions } from "../../../types/interfaces";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
  // getAllCourses():Promise<ICourse[]>;
  getFilteredCourses(filters: CourseQueryOptions): Promise<{ courses: ICourse[]; total: number }>;
  getCategories(): Promise<string[]>;
  getUserCourse(courseId:string): Promise<ICourse | null>
  addLecture(courseId: mongoose.Types.ObjectId, lectureId: mongoose.Types.ObjectId): Promise<void> 
  findCourseById(courseId: string): Promise<ICourse | null> 
  updateCourse(courseId: string, updatedData: Partial<ICourse>, isApproved:string, editStatus: string): Promise<ICourse | null>
  updateBlockStatus(courseId:string, status: string): Promise<ICourse | null>
  countCourses():Promise<number>
}