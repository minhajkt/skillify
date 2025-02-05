import { Request, Response } from "express";

export interface IAdminController {
  getStudents(req: Request, res: Response): Promise<void>;
  updateStudentStatus(req: Request, res: Response): Promise<void>;
  getTutors(req: Request, res: Response): Promise<void>;
  getTutorById(req: Request, res: Response): Promise<void>;
  getStudentById(req: Request, res: Response): Promise<void>;
  updateTutorStatus(req: Request, res: Response): Promise<void>;
  getTutorRequests(req: Request, res: Response): Promise<void>;
  updateTutorApproval(req: Request, res: Response): Promise<void>;
  getCourseRequests(req: Request, res: Response): Promise<void>;
  updateCourseApproval(req: Request, res: Response): Promise<void>;
  getAllCourse(req: Request, res: Response): Promise<void>;
  
}