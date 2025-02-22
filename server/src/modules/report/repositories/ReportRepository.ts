import { IReportRepository } from "./IReportRepository";
import Report, { IReport } from "../models/reportModel";
import { BaseRepository } from "../../../common/baseRepository";

class ReportRepository extends BaseRepository<IReport> implements IReportRepository {
  constructor() {
    super(Report)
  }
  async createReport(reportData: IReport): Promise<IReport> {
    // const report = new Report(reportData);
    // return report.save();
    return await this.create(reportData)
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
