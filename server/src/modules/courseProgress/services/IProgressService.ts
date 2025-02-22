import { IProgress } from "../models/progressModel";

export interface IProgressService {
  findProgress(userId: string, courseId: string): Promise<IProgress | null>;
  markLectureCompleted(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null>;
  issueCertificate(
    userId: string,
    courseId: string,
    userName: string,
    courseName: string
  ): Promise<string>;
  downloadCertificate(certificateId: string, userId: string): Promise<string>;
}