import mongoose, { Schema } from "mongoose";

export interface IProgress extends Document {
    userId: string, 
    courseId: string,
    completedLecturesDetails: string[],
    lecturesCompleted: number,
    totalLectures: number,
    progressPercentage: number,
    completed: boolean,
    completionDate: Date,
    certificateUrl?: string
    certificateId?: string
}

const progressSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  completedLecturesDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture", default: [] }],
  lecturesCompleted: { type: Number, default: 0 },
  totalLectures: { type: Number },
  progressPercentage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completionDate: { type: Date, default:null },
  certificateUrl: {type: String, default: null},
  certificateId: { type: String, default: null }
}, 
{timestamps: true}
);

export default mongoose.model<IProgress>('Progress', progressSchema);
