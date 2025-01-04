import { ILecture } from "../models/lectureModel";

export interface ILectureRepository {
  createLecture(lectureData: Partial<ILecture>): Promise<ILecture>;
  getLecturesByCourse(courseId: string): Promise<ILecture[]>;
}
