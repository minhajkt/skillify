import { IReportRepository } from "./IReportRepository";
import Report, { IReport } from "../models/reportModel";

class ReportRepository implements IReportRepository {
  async createReport(reportData: IReport): Promise<IReport> {
    const report = new Report(reportData);
    return report.save();
  }

  async getAllReports(): Promise<IReport[]> {
    return Report.find()
    .populate('courseId', 'title createdBy')
    .populate('userId', 'name')
    .populate('lectureId', 'title')
    ;
  }
}

export default ReportRepository;
