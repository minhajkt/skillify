import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  roomId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date;
  fileUrl?: string
  fileType?: 'image' | 'video'
}

const messageSchema: Schema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: "MessageRoom", required: true },
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  fileUrl: { type: String, default: null },
  fileType: {type: String, enum:['image', 'video', null], default: null}
});
messageSchema.index({ roomId: 1 });

export default mongoose.model<IMessage>("Message", messageSchema);
