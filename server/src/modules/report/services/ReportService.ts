import { IReportService } from "./IReportService";
import Report, { IReport } from "../models/reportModel";
import { IReportRepository } from "../repositories/IReportRepository";
import mongoose from "mongoose";

class ReportService implements IReportService {
  private reportRepository: IReportRepository;

  constructor(reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async reportLecture(
    courseId: string,
    lectureId: string,
    reportDescription: string,
    userId: string
  ): Promise<IReport> {
    
      const reportData = new Report({
    courseId: new mongoose.Types.ObjectId(courseId),
    lectureId: new mongoose.Types.ObjectId(lectureId),
    userId: new mongoose.Types.ObjectId(userId),
    reportDescription,
    isResolved: false,
  });
    
    return this.reportRepository.createReport(reportData);
  }

  async getReports(): Promise<IReport[]> {
    return this.reportRepository.getAllReports();
  }
}

export default ReportService;
