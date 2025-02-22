import { IPaymentRepository } from "./IPaymentRepository";
import Payment , {IPayment} from '../models/paymentModel'
import { BaseRepository } from "../../../common/baseRepository";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment)
  }
  async getPendingPayments(): Promise<IPayment[]> {
    const result = await Payment.find({ status: "Pending" })
      .populate({ path: "tutorId", select: "name" })
      .populate({ path: "courseId", select: "title price" });

    return result;
  }

  async createPayment(payment: Partial<IPayment>): Promise<IPayment> {
    // return await Payment.create(payment);
    return await this.create(payment)
  }

  async getPaymentHistory(): Promise<IPayment[]> {
    const result = await Payment.find({ status: {$nin: "Pending"} })
      .populate({ path: "tutorId", select: "name" })
      .populate({ path: "courseId", select: "title price" });

    return result;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string
  ): Promise<IPayment | null> {
    const updateFields: Partial<IPayment> = { status };
    if (status === "Completed") {
      updateFields.paymentDate = new Date(); 
    }

    return await Payment.findByIdAndUpdate(
      paymentId,
      updateFields,
      { new: true }
    );
  }

  async tutorsRecievable(tutorId: string): Promise<IPayment[]> {
    return await Payment.find({tutorId}).populate({path: "courseId", select: "title price"})
  }
}