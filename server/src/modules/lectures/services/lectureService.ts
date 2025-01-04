import { ILectureRepository } from "../repositories/ILectureRepository";
import { ILecture } from "../models/lectureModel";

export class LectureService {
  private lectureRepo: ILectureRepository;

  constructor(lectureRepo: ILectureRepository) {
    this.lectureRepo = lectureRepo;
  }

  async createLecture(lectureData: Partial<ILecture>): Promise<ILecture | null> {
    try {
      return await this.lectureRepo.createLecture(lectureData);
    } catch (error) {
      throw new Error(`Error creating new Lecture ${(error as Error).message}`);
    }
  }

  async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
    try {
      return await this.lectureRepo.getLecturesByCourse(courseId);
    } catch (error) {
      throw new Error(
        `Error fetching lectures for course: ${(error as Error).message}`
      );
    }
  }
}
