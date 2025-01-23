

import Lecture, { ILecture } from "../models/lectureModel";
import { ILectureRepository } from "./ILectureRepository";
import Course, { ICourse } from '../../courses/models/courseModel'
import mongoose from "mongoose";

export class LectureRepository implements ILectureRepository {
  async createLecture(lectureData: Partial<ILecture>): Promise<ILecture> {
    const lecture = new Lecture(lectureData);
    return await lecture.save();
  }

  async updateCourseStatus(
    courseId: mongoose.Types.ObjectId,
    status: string
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      { isApproved: status },
      { new: true }
    );
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

  async updateLecture(lectureId: string,updatedData: Partial<ILecture>): Promise<ILecture | null> {
    return await Lecture.findByIdAndUpdate(lectureId, updatedData, {
      new: true, 
    });
  }
  async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
    return await Lecture.find({ courseId }).sort({ order: 1 });
  }
}
