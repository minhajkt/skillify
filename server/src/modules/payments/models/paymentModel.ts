import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  tutorId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  status: string; 
  paymentDate: Date;
  newEnrollments: number
}

const paymentSchema: Schema = new Schema(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentDate: { type: Date, default: null },
    newEnrollments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
