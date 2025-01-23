import { IReport } from "../models/reportModel";

export interface IReportRepository {
  createReport(reportData: IReport): Promise<IReport>;
  getAllReports(): Promise<IReport[]>;
}
