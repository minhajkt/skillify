import { Request, Response } from "express";
import { IReportService } from "../services/IReportService";
import { IReportController } from "./IReportController";
import { AuthRequest } from "../../../types/custom";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";

class ReportController implements IReportController {
  private reportService: IReportService;

  constructor(reportService: IReportService) {
    this.reportService = reportService;
  }

  async reportLecture(req: AuthRequest, res: Response): Promise<void> {
    const { courseId, lectureId, reportDescription } = req.body;
    if (!courseId || !lectureId) {
       res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: MESSAGES.NO_COURSE_LECTURE_ID });
        return
    }
    
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USERID_NOT_FOUND });
      return;
    }
    

    try {
      const report = await this.reportService.reportLecture(
        courseId,
        lectureId,
        reportDescription,
        userId
      );
      res.status(HttpStatus.CREATED).json({ message: MESSAGES.REPORT_CREATED, report });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.UNEXPECTED_ERROR });
    }
  }

  async getReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await this.reportService.getReports();
      res.status(HttpStatus.OK).json(reports);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.UNEXPECTED_ERROR });

    }
  }
}

export default ReportController;
