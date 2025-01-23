import { Request, Response } from "express";
import { IReportService } from "../services/IReportService";
import { IReportController } from "./IReportController";

class ReportController implements IReportController {
  private reportService: IReportService;

  constructor(reportService: IReportService) {
    this.reportService = reportService;
  }

  async reportLecture(req: Request, res: Response): Promise<void> {
    const { courseId, lectureId, reportDescription } = req.body;
    if (!courseId || !lectureId) {
       res
        .status(400)
        .json({ message: "Course ID and Lecture ID are required." });
        return
    }
    console.log('route hit');
    
    const userId = req.user.id;
    console.log(userId);
    

    try {
      const report = await this.reportService.reportLecture(
        courseId,
        lectureId,
        reportDescription,
        userId
      );
      res.status(201).json({ message: "Report created successfully", report });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create report" });
    }
  }

  async getReports(req: Request, res: Response): Promise<void> {
    try {
        // console.log('fetching reports from backend');
        
      const reports = await this.reportService.getReports();
      res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve reports" });
    }
  }
}

export default ReportController;
