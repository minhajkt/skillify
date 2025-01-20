import { Request, Response } from "express";

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ITutorController {
  getTutorCourses(req: Request, res: Response): Promise<void>;
  getCourseDetails(req: Request, res: Response): Promise<void>;
}
