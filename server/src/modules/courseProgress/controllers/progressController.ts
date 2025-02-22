import { Request, Response } from "express";
import { IProgressController } from "./IProgressController";
import { IProgressService } from "../services/IProgressService";
import Progress from "../models/progressModel"
import { cloudinary } from "../../../config/cloudinaryConfig";
import axios from "axios";
import { Users } from "../../../types/interfaces";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";


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
        res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.PROGRESS_NOT_FOUND});
        return;
      }
      res.status(HttpStatus.OK).json(progress);
      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
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
        res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.PROGRESS_NOT_FOUND});
      }

      res.status(HttpStatus.OK).json(progress);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async generateCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId, userName, courseName } = req.body;
      const certificateId = await this.progressService.issueCertificate(
        userId,
        courseId,
        userName,
        courseName
      );
      res.status(HttpStatus.OK).json({ certificateId });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async downloadCertificate(req: Request, res: Response): Promise<void> {
    const { certificateId } = req.query;
    const userId = (req?.user as Users)?.id;
    
    if (!certificateId || typeof certificateId !== "string") {
      res.status(HttpStatus.BAD_REQUEST).json({message: MESSAGES.CERTIFICATE_ID_ERROR});
      return; 
    }

    try {
      const signedUrl = await this.progressService.downloadCertificate(
        certificateId,
        userId
      );

      const fileResponse = await axios({
        url: signedUrl,
        method: "GET",
        responseType: "stream",
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${certificateId.split("/").pop()}"`
      );
      res.setHeader("Content-Type", "application/pdf");

      fileResponse.data.pipe(res);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.CERTIFICATE_DOWNLOAD_FAILED , error: (error as Error).message,});
      return   
    }
  }
}