import { ILectureRepository } from "../repositories/ILectureRepository";
import { ILecture } from "../models/lectureModel";
import Course from '../../courses/models/courseModel'
import mongoose from "mongoose";
import { ICourseService } from "../../courses/services/ICourseService";
import { ILectureService } from "./ILectureService";
import { cloudinary } from "../../../config/cloudinaryConfig";

export class LectureService implements ILectureService {
  private lectureRepo: ILectureRepository;

  constructor(lectureRepo: ILectureRepository) {
    this.lectureRepo = lectureRepo;
  }

  async createLecture(
    lectureData: Partial<ILecture>,
    courseId: mongoose.Types.ObjectId
  ): Promise<ILecture | null> {
    try {
      if (lectureData) {
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { isApproved: "pending" },
          { new: true }
        );
        if (!updatedCourse) {
          throw new Error("Course not found");
        }
      }
      return await this.lectureRepo.createLecture(lectureData);
    } catch (error) {
      throw new Error(`Error creating new Lecture ${(error as Error).message}`);
    }
  }

  async addLectureToCourse(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    await this.lectureRepo.addLecture(courseId, lectureId);
  }

  async editLecture(
    lectureId: string,
    updatedData: Partial<ILecture>,
  ): Promise<ILecture | null> {
    try {
      return await this.lectureRepo.updateLecture(lectureId, updatedData);
    } catch (error) {
      throw new Error(`Error editing lecture: ${(error as Error).message}`);
    }
  }

  async getLecturesByCourse(courseId: string): Promise<ILecture[]> {
    try {
      const lecture = await this.lectureRepo.getLecturesByCourse(courseId);

      return lecture;
    } catch (error) {
      throw new Error(
        `Error fetching lectures for course: ${(error as Error).message}`
      );
    }
  }

  async getLectureById(lectureId: string): Promise<ILecture | null> {
    try {
      return await this.lectureRepo.getLectureById(lectureId);
    } catch (error) {
      throw new Error(`Error fetching lecture: ${(error as Error).message}`);
    }
  }
}
