import { Request, Response } from "express";

export interface IUserController {
  createUser(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  loginUser(req: Request, res: Response): Promise<void>;
  loginTutor(req: Request, res: Response): Promise<void>;
  loginAdmin(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleSignIn(req: Request, res: Response): Promise<void>;
  getCourseById(req: Request, res: Response): Promise<void>;
  logoutUser(req: Request, res: Response): Promise<void>;
  stripePayment(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  getTutorCount(req: Request, res: Response): Promise<void>;
}

