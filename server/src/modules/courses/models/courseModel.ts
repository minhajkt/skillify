import mongoose, {Schema, Document} from "mongoose";

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
  lectures: mongoose.Types.ObjectId[];
}

const courseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Software", "Business", "Accounts"], default: "Software" },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref:"User",required: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: String, enum: ["draft","pending", "approved", "rejected"], default: "draft"},
  lectures: [{type: Schema.Types.ObjectId, ref:"Lecture", default:[] }]
},
{strict:true,timestamps: true}
);

export default mongoose.model<ICourse>('Course', courseSchema);