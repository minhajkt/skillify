import { IReportService } from "./IReportService";
import { IReport } from "../models/reportModel";
import { IReportRepository } from "../repositories/IReportRepository";

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
    const reportData: IReport = {
      courseId,
      lectureId,
      userId,
      reportDescription,
      isResolved: false,
    };
    return this.reportRepository.createReport(reportData);
  }

  async getReports(): Promise<IReport[]> {
    return this.reportRepository.getAllReports();
  }
}

export default ReportService;
