import mongoose from "mongoose";
import Course, { ICourse } from "../models/courseModel";
import { ICourseRepository } from "./ICourseRepository";

export class CourseRepository implements ICourseRepository {
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(courseData);
    return await course.save();
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await Course.find();
  }

  async getCategories(): Promise<string[]> {
    const categories = (Course.schema.path("category") as any).enumValues;
    return categories;
  }

  async getUserCourse(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate("lectures");
  }

  async addLecture(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { lectures: lectureId } },
      { new: true }
    );
    if (!updatedCourse) {
      console.log(`Course with ID ${courseId} not found.`);
      throw new Error(`Course with ID ${courseId} not found.`);
    } else {
      console.log(`Updated Course: `, updatedCourse);
    }
  }
  
  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId);
  }
}