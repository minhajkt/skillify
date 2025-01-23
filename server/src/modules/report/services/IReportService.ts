import { IReport } from "../models/reportModel";

export interface IReportService {
  reportLecture(
    courseId: string,
    lectureId: string,
    reportDescription: string,
    userId: string
  ): Promise<IReport>;
  getReports(): Promise<IReport[]>;
}
