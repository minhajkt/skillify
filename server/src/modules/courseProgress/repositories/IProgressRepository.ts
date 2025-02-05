import { IProgress } from "../models/progressModel";

export interface IProgressRepository {
  // createProgress (userId: string, courseId: string ): Promise<IProgress | null>
  findProgress(userId: string, courseId: string): Promise<IProgress | null>;
  markLectureCompleted(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null>;
  updateProgressPercentage(
    userId: string,
    courseId: string,
    progressPercentage: number,
    completed: boolean
  ): Promise<IProgress | null>;
  updateCertificateUrl(
    userId: string,
    courseId: string,
    certificateUrl: string
  ): Promise<IProgress | null>;
}