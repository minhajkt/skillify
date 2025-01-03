import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: string,
    profilePhoto: string,
    createdAt : Date,
    verified: boolean,
    isActive : boolean,
    bio?:string,
    isApproved?: string,
    certificatess?:string
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "tutor", "admin"], default: "user" },
  profilePhoto: { type: String, required: false },
  createdAt: { type: Date, default: Date.now() },
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  bio: { type: String, default: null },
  isApproved: { type: String, enum:['pending', 'approved', 'rejected'], default: 'pending' },
  certificates: { type: [String], default: [] },
});

export default mongoose.model<IUser>('User', UserSchema);