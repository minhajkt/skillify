

import Lecture, { ILecture } from "../models/lectureModel";
import { ILectureRepository } from "./ILectureRepository";
import Course, { ICourse } from '../../courses/models/courseModel'
import mongoose from "mongoose";
import { BaseRepository } from "../../../common/baseRepository";

export class LectureRepository
  extends BaseRepository<ILecture>
  implements ILectureRepository
{
  constructor() {
    super(Lecture)
  }
  async createLecture(lectureData: Partial<ILecture>): Promise<ILecture> {
    return await this.create(lectureData)
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
      throw new Error(`Course with ID ${courseId} not found.`);
    } 
  }

  async updateLecture(
    lectureId: string,
    updatedData: Partial<ILecture>
  ): Promise<ILecture | null> {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return null;

    const course = await Course.findById(lecture.courseId);
    if (!course || !course.draftVersion) return null;

    let draftLectures = course.draftVersion.lectures || [];

    const index = draftLectures.findIndex((l) => l.order === lecture.order);

    if (index !== -1) {
      draftLectures[index] = {
        ...draftLectures[index],
        ...updatedData,
      };
    } else {
      draftLectures.push({
        title: updatedData.title || lecture.title,
        description: updatedData.description || lecture.description,
        videoUrl: updatedData.videoUrl || lecture.videoUrl,
        duration: updatedData.duration || lecture.duration,
        order: updatedData.order || lecture.order,
      });
    }

    await Course.updateOne(
      { _id: course._id },
      { $set: { "draftVersion.lectures": draftLectures } }
    );

    return lecture;
  }

  async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
    const lecture = await Lecture.find({ courseId }).sort({ order: 1 });
    return lecture;
  }

  async getLectureById(lectureId: string): Promise<ILecture | null> {
    return await this.findById(lectureId)
  }
}
