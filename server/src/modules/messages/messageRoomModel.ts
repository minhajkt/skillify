import mongoose, { Document, Schema } from "mongoose";

export interface IMessageRoom extends Document {
  users: string[]; 
  courseId?: string;
  lastMessage?: string;
  lastMessageAt: Date;
}

const messageRoomSchema = new Schema({
  users: { type: [String], required: true }, 
  courseId: { type: String },
  lastMessage: { type: String, default: "" }, 
  lastMessageAt: { type: Date, default: Date.now },
});

messageRoomSchema.index({ users: 1 });

export default mongoose.model<IMessageRoom>("MessageRoom", messageRoomSchema);
