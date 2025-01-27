import { Request, Response } from "express";
import { IPaymentService } from "../services/IPaymentService";
import { IPaymentController } from "./IPaymentController";

export class PaymentController implements IPaymentController {
  private paymentService: IPaymentService;
  constructor(paymentService: IPaymentService) {
    this.paymentService = paymentService;
  }

  async getPendingPayments(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getPendingPayments();
      //   res.status(200).json({ success: true, data: payments });
      res.status(200).json(payments);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching payments", error });
    }
  }

  async completePayment(req: Request, res: Response): Promise<void> {
    const { paymentId } = req.params;
    try {
      const payment = await this.paymentService.completePayment(paymentId);
      if (!payment) {
        res.status(404).json({ success: false, message: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error completing payment",
          error: (error as Error).message,
        });
    }
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getPaymentHistory();
      res.status(200).json(payments);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching payments history", error });
    }
  }

  async tutorRecievable(req: Request, res: Response): Promise<void> {
    try {
        const {tutorId} = req.params
        const tutorsRecievable = await this.paymentService.tutorsRecievable(tutorId)
        if(!tutorsRecievable) {
            res.status(404).json('No tutor recievables found')
            return
        }
        res.status(200).json(tutorsRecievable)
    } catch (error) {
        console.log('Error occured', error);
        res.status(500).json('An unexpected error occured')
    }
  }
}
   