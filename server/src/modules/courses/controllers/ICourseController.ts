import { Request, Response } from "express";

export interface ICourseController {
  createCourse(req: Request, res: Response): Promise<void>;
  getAllCourses(req: Request, res: Response): Promise<void>;
  getCategories(req: Request, res: Response): Promise<void>;
  editCourse(req: Request, res: Response): Promise<void>;
  blockCourse(req: Request, res: Response): Promise<void>;
  countCourses(req: Request, res: Response): Promise<void>;
}