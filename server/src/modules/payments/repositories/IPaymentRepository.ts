import { IPayment } from "../models/paymentModel"

export interface IPaymentRepository {
    getPendingPayments(): Promise<IPayment[]>
    createPayment(payment: Partial<IPayment>): Promise<IPayment>
    updatePaymentStatus(paymentId: string,status: string): Promise<IPayment | null>
    getPaymentHistory(): Promise<IPayment[]>
    tutorsRecievable(tutorId: string): Promise<IPayment[]>
}