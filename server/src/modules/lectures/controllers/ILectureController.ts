import { Request, Response } from "express";

export interface ILectureController {
  createLecture(req: Request, res: Response): Promise<void>;
  getLecturesByCourse(req: Request, res: Response): Promise<void>;
}