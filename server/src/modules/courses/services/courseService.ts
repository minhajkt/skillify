import mongoose from "mongoose";
import { ICourse } from "../models/courseModel";
import { ICourseRepository } from "../repositories/ICourseRepository";
import { cloudinary } from "../../../config/cloudinaryConfig";
import { ICourseService } from "./ICourseService";

export class CourseService implements ICourseService {
  private courseRepo: ICourseRepository;
  constructor(courseRepo: ICourseRepository) {
    this.courseRepo = courseRepo;
  }

  async createCourse(
    courseData: Partial<ICourse>,
    file?: Express.Multer.File
  ): Promise<ICourse | null> {
    try {
      if (file) {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "course_thumbnails",
          resource_type: "auto",
        });
        courseData.thumbnail = result.secure_url;
      }

      const newCourse = await this.courseRepo.createCourse(courseData);
      return newCourse;
    } catch (error) {
      throw new Error("Failed to create course. Please try again..");
    }
  }

  async editCourse(
    courseId: string,
    updatedData: Partial<ICourse>,
    file?: Express.Multer.File
  ): Promise<ICourse | null> {
    try {
      if (file) {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "course_thumbnails",
          resource_type: "auto",
        });
        updatedData.thumbnail = result.secure_url;
      }
      return await this.courseRepo.updateCourse(
        courseId,
        updatedData,
        "pending",
        "pending"
      );
    } catch (error) {
      throw new Error(`Error editing course: ${(error as Error).message}`);
    }
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseRepo.getAllCourses();
  }

  async getCategories(): Promise<string[]> {
    try {
      return await this.courseRepo.getCategories();
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }

  async getUserCourse(courseId: string): Promise<ICourse | null> {
    const userCourse = await this.courseRepo.getUserCourse(courseId);
    if (!userCourse) {
      throw new Error("No course found for user");
    }
    return userCourse;
  }

  async addLectureToCourse(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    await this.courseRepo.addLecture(courseId, lectureId);
  }

  async toggleBlockStatus(courseId:string, status:string):Promise<ICourse> {
    const validStatuses = ["pending", "approved", "rejected", "blocked"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

    const course = await this.courseRepo.updateBlockStatus(courseId, status);

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  }

  async countCourses() : Promise<number> {
    const countCourse = await this.courseRepo.countCourses()
if (typeof countCourse !== "number") {
  throw new Error("Invalid count returned from repository");
}
    return countCourse
  }
}