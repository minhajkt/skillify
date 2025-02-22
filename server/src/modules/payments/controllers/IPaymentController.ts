import { Request, Response } from "express";

export interface IPaymentController {
  getPendingPayments(req: Request, res: Response): Promise<void>;
  getPaymentHistory(req: Request, res: Response): Promise<void>;
  completePayment(req: Request, res: Response): Promise<void>;
}