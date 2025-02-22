import { cloudinary } from "../../../config/cloudinaryConfig";
import { generateCertificate } from "../../../utils/certificateGenerator"
import { IProgress } from "../models/progressModel"
import { IProgressRepository } from "../repositories/IProgressRepository"
import { IProgressService } from "./IProgressService"

export class ProgressService implements IProgressService {
  private progressRepository: IProgressRepository;

  constructor(progressRepository: IProgressRepository) {
    this.progressRepository = progressRepository;
  }

  async findProgress(
    userId: string,
    courseId: string
  ): Promise<IProgress | null> {
    return await this.progressRepository.findProgress(userId, courseId);
  }

  async markLectureCompleted(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null> {
    const progress = await this.progressRepository.findProgress(
      userId,
      courseId
    );
    if (!progress) {
      throw new Error("No progress found");
    }

    if (progress?.completedLecturesDetails.includes(lectureId)) {
      return progress;
    }

    const updatedProgress = await this.progressRepository.markLectureCompleted(
      userId,
      courseId,
      lectureId
    );

    if (!updatedProgress) {
      return progress;
    }

    return await this.progressRepository.updateProgressPercentage(
      userId,
      courseId,
      Math.floor(
        (updatedProgress.lecturesCompleted / updatedProgress.totalLectures) *
          100
      ),
      updatedProgress.lecturesCompleted === updatedProgress.totalLectures
    );
  }

  async issueCertificate(
    userId: string,
    courseId: string,
    userName: string,
    courseName: string
  ): Promise<string> {
    const certificateId = await generateCertificate(
      userName,
      courseName,
      `${userId}_${courseId}`
    );
    await this.progressRepository.updateCertificateId(
      userId,
      courseId,
      certificateId
    );
    return certificateId;
  }

  async downloadCertificate(
    certificateId: string,
    userId: string
  ): Promise<string> {
    const progress = await this.progressRepository.findProgressByCertificateId(
      certificateId
    );

    if (!progress) {
      throw new Error("Certificate not found");
    }

    if (progress.userId.toString() !== userId) {
      throw new Error("Unauthorized access");
    }

    const options = {
      resource_type: "raw",
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 600,
      attachment: true,
    };

    const signedUrl = cloudinary.v2.utils.private_download_url(
      certificateId,
      "pdf",
      options
    );
    return signedUrl;
  }
}