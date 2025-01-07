import mongoose from "mongoose";
import Course, { ICourse } from "../models/courseModel";

export class CourseRepository {
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(courseData);
    return await course.save();
  }

  async addLecture(courseId: mongoose.Types.ObjectId, lectureId: mongoose.Types.ObjectId): Promise<void> {
    const updatedCourse = await Course.findByIdAndUpdate(
      {_id: courseId},
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

  async getAllCourses(): Promise<ICourse[]> {
    return await Course.find();
  }
}