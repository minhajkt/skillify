import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";
import { ICourseRepository } from "../repositories/ICourseRepository";

export class CourseService {
  private courseRepo: ICourseRepository;
  constructor(courseRepo: ICourseRepository) {
    this.courseRepo = courseRepo;
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
    try {
      return await this.courseRepo.createCourse(courseData);
    } catch (error) {
      throw new Error(`Error creating new Course ${(error as Error).message}`);
    }
  }

  async addLectureToCourse(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    await this.courseRepo.addLecture(courseId, lectureId);
  }
}