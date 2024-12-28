import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: string,
    profilePhoto: String,
    createdAt : Date
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  profilePhoto: {type: String, required: false},
  createdAt: {type: Date, default: Date.now()}
});

export default mongoose.model<IUser>('User', UserSchema);