import { IPayment } from "../models/paymentModel";
import { IPaymentRepository } from "../repositories/IPaymentRepository";
import { IPaymentService } from "./IPaymentService";

export class PaymentService implements IPaymentService {
  private paymentRepository: IPaymentRepository;
  constructor(paymentRepository: IPaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async getPendingPayments(): Promise<IPayment[]> {
    return await this.paymentRepository.getPendingPayments();
  }

  async getPaymentHistory(): Promise<IPayment[]> {
    return await this.paymentRepository.getPaymentHistory();
  }

  async completePayment(paymentId: string): Promise<IPayment | null> {
    return await this.paymentRepository.updatePaymentStatus(
      paymentId,
      "Completed"
    );
  }

  async tutorsRecievable(tutorId: string): Promise<IPayment[]> {
    return await this.paymentRepository.tutorsRecievable(tutorId)
  }
}