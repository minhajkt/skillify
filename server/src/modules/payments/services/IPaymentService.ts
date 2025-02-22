import { IPayment } from "../models/paymentModel";

export interface IPaymentService {
  getPendingPayments(): Promise<IPayment[]>;
  getPaymentHistory(): Promise<IPayment[]>;
  completePayment(paymentId: string): Promise<IPayment | null>;
  tutorsRecievable(tutorId: string): Promise<IPayment[]>;
}