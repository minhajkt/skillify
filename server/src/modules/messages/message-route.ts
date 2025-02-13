
import { Router } from "express";
import Message from '../messages/messageModel'
import MessageRoom from '../messages/messageRoomModel'
import { upload, uploadVideo } from "../../config/cloudinaryConfig";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
// import { cloudinary } from "../../config/cloudinaryConfig";
const messageRouter = Router()

messageRouter.get("/messages/:senderId/:recipientId",authenticateJWT, async (req, res) => {
  const { senderId, recipientId } = req.params;

  const room = await MessageRoom.findOne({
    users: { $all: [senderId, recipientId] },
  });

  if (!room) {
    return res.json([]);
  }

  const messages = await Message.find({ roomId: room._id })
    .select("senderId recipientId message read readAt timestamp fileUrl fileType")
    .sort({timestamp: 1,});
  res.json(messages);
});

messageRouter.post("/uploadImage", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // console.log("File uploaded:", req.file);
  const imageUrl = req.file.path;
  return res.status(200).json({ imageUrl });
});


messageRouter.post("/uploadVideo", uploadVideo.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  console.log("Video uploaded:", req.file);
  const videoUrl = req.file.path;
  return res.status(200).json({ videoUrl });
});
export default messageRouter;
