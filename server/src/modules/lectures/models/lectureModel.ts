import mongoose, { Schema, Document } from "mongoose";

export interface ILecture extends Document {
  title: string;
  description: string;
  videoUrl: string;
  duration: number; 
  order: number;
  courseId: mongoose.Types.ObjectId; 
}

const lectureSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    order: {type: Number, required: true},
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, 
  },
  { timestamps: true }
);

export default mongoose.model<ILecture>("Lecture", lectureSchema);
