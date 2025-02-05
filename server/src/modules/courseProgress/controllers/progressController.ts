import { Request, Response } from "express";
import { IProgressController } from "./IProgressController";
import { IProgressService } from "../services/IProgressService";

export class ProgressController implements IProgressController {
  private progressService: IProgressService;
  constructor(progressService: IProgressService) {
    this.progressService = progressService;
  }
  async findProgress(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId } = req.params;
      const progress = await this.progressService.findProgress(
        userId,
        courseId
      );
      if (!progress) {
        res.status(404).json("Progress not found");
        return;
      }
      res.status(200).json(progress);
      return;
    } catch (error) {
      res.status(500).json({
        message: "An unexpected error occured",
        error: (error as Error).message,
      });
    }
  }

  async markLectureCompleted(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId, lectureId } = req.params;
      const progress = await this.progressService.markLectureCompleted(
        userId,
        courseId,
        lectureId
      );
      if (!progress) {
        res.status(404).json("Progress not found");
      }

      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({
        message: "An unexpected error occured",
        error: (error as Error).message,
      });
    }
  }

  async generateCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId, userName, courseName } = req.body;
      const certificateUrl = await this.progressService.issueCertificate(
        userId,
        courseId,
        userName,
        courseName
      );
      res.status(200).json({ certificateUrl });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Failed to generate certificate",
          error: (error as Error).message,
        });
    }
  }
}