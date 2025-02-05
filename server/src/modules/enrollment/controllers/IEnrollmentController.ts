import { Request, Response } from "express";


export interface IEnrollmentController {
  getAllEnrolledCoursesByStudent(req: Request, res: Response): Promise<void>;
  totalEnrolledStudents(req: Request, res: Response): Promise<void>;
  totalRevenue(req: Request, res: Response): Promise<void>;
  courseStrength(req: Request, res: Response): Promise<void>;
  getTutorsStudents(req: Request, res: Response): Promise<void>;
  revenueReport(req: Request, res: Response): Promise<void>;
}