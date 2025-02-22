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
    order: { type: Number, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    
    draftVersion: {
      title: String,
      description: String,
      videoUrl: String,
      duration: Number,
      order: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILecture>("Lecture", lectureSchema);
