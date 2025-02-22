
import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId;
  reportDescription: string;
  isResolved: boolean;
}

const reportSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
    reportDescription: { type: String, required: true },
  },
  { timestamps: true }  
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
