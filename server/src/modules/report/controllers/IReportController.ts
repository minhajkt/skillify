import { Request, Response } from "express";

export interface IReportController {
  reportLecture(req: Request, res: Response): Promise<void>;
  getReports(req: Request, res: Response): Promise<void>;
}