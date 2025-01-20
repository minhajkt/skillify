import { Request, Response } from "express";


export interface IEnrollmentController {
  getAllEnrolledCoursesByStudent(req: Request, res: Response): Promise<void>;
  totalEnrolledStudents(req: Request, res: Response): Promise<void>
}