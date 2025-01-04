

import Lecture, { ILecture } from "../models/lectureModel";

export class LectureRepository {
  async createLecture(lectureData: Partial<ILecture>): Promise<ILecture> {
    const lecture = new Lecture(lectureData);
    return await lecture.save();
  }

  async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
    return await Lecture.find({ courseId }).sort({ order: 1 });
  }
}
