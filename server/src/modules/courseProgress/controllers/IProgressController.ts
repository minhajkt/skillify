import { Request, Response } from "express";

export interface IProgressController {
  findProgress(req: Request, res: Response): Promise<void>;
  generateCertificate(req: Request, res: Response): Promise<void>;
}