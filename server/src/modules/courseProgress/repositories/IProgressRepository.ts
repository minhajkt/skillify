import { IProgress } from "../models/progressModel";

export interface IProgressRepository {
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
  updateCertificateId(
    userId: string,
    courseId: string,
    certificatId: string
  ): Promise<IProgress | null>;
  findProgressByCertificateId(certificateId: string): Promise<IProgress | null>;
}