import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface IEnrollment extends Document {
    userId: string
    courseId: string
    paymentStatus: string
    paymentMethod: string
    amount : number
}

const enrollmentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  paymentStatus: { type: String,enum: ["Pending", "Success", "Failed"] ,required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true }
}, 
{timestamps: true}
);

export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
