import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  isActive: boolean;
  isApproved: string;
  isBlocked: boolean;
  editStatus: string;
  lectures: mongoose.Types.ObjectId[];
  draftVersion?: {
    title?: string;
    description?: string;
    category?: string;
    thumbnail?: string;
    price?: number;
    lectures?: {
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      order: number;
    }[];
  };
}

const courseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Software", "Business", "Accounts"],
      default: "Software",
    },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
    isBlocked: { type: Boolean, default: "false" },
    editStatus: {
      type: String,
      enum: ["pending", "appproved", "rejected", "null"],
      default: "null",
    },
    lectures: [{ type: Schema.Types.ObjectId, ref: "Lecture", default: [] }],

    draftVersion: {
      title: String,
      description: String,
      category: String,
      thumbnail: String,
      price: Number,
      lectures: [
        {
          title: String,
          description: String,
          videoUrl: String,
          duration: Number,
          order: Number,
        },
      ],
    },
  },
  { strict: true, timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);

