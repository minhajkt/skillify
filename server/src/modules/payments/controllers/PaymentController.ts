import { Request, Response } from "express";
import { IPaymentService } from "../services/IPaymentService";
import { IPaymentController } from "./IPaymentController";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";

export class PaymentController implements IPaymentController {
  private paymentService: IPaymentService;
  constructor(paymentService: IPaymentService) {
    this.paymentService = paymentService;
  }

  async getPendingPayments(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getPendingPayments();
      res.status(HttpStatus.OK).json(payments);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: MESSAGES.PAYMENT_FETCHING_ERROR, error });
    }
  }

  async completePayment(req: Request, res: Response): Promise<void> {
    const { paymentId } = req.params;
    try {
      const payment = await this.paymentService.completePayment(paymentId);
      if (!payment) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: MESSAGES.PAYMENT_NOT_FOUND });
      }
      res.status(HttpStatus.OK).json(payment);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: MESSAGES.PAYMENT_ERROR,
          error: (error as Error).message,
        });
    }
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getPaymentHistory();
      res.status(HttpStatus.OK).json(payments);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: MESSAGES.PAYMENT_HISTORY_FETCHING_ERROR, error });
    }
  }

  async tutorRecievable(req: Request, res: Response): Promise<void> {
    try {
        const {tutorId} = req.params
        const tutorsRecievable = await this.paymentService.tutorsRecievable(tutorId)
        if(!tutorsRecievable) {
            res.status(HttpStatus.NOT_FOUND).json(MESSAGES.TUTOR_RECIEVABLES_NOT_FOUND)
            return
        }
        res.status(HttpStatus.OK).json(tutorsRecievable)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(MESSAGES.UNEXPECTED_ERROR)
    }
  }
}
   