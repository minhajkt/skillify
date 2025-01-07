import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";
import { ICourseRepository } from "../repositories/ICourseRepository";

export class CourseService {
  private courseRepo: ICourseRepository;
  constructor(courseRepo: ICourseRepository) {
    this.courseRepo = courseRepo;
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
       if (!courseData.title) {
         throw new Error("Title cannot be empty");
       } else if (!courseData.description) {
         throw new Error("Description cannot be empty");
       } else if (!courseData.category) {
         throw new Error("Category cannot be empty");
       }else if (courseData.price && courseData.price <= 0) {
         throw new Error("Price must be greater than 0");
       }else if (!courseData.thumbnail) {
        throw new Error ("Thumbnail is required")
       }
    try {
      return await this.courseRepo.createCourse(courseData);
    } catch (error) {
      throw new Error("Failed to create course. Please try again.");
    }
  }

  async addLectureToCourse(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    await this.courseRepo.addLecture(courseId, lectureId);
  }

  async getAllCourses() : Promise<ICourse[] > {
    return await this.courseRepo.getAllCourses()
  } 
}