
import { Router } from "express";
import Message from '../messages/messageModel'
import MessageRoom from '../messages/messageRoomModel'
import { upload, uploadVideo } from "../../config/cloudinaryConfig";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { HttpStatus } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
// import { cloudinary } from "../../config/cloudinaryConfig";
const messageRouter = Router()

messageRouter.get("/messages/:senderId/:recipientId",authenticateJWT, async (req, res):Promise<void> => {
  const { senderId, recipientId } = req.params;

  const room = await MessageRoom.findOne({
    users: { $all: [senderId, recipientId] },
  });

  if (!room) {
     res.json([]);
     return;
  }

  const messages = await Message.find({ roomId: room._id })
    .select("senderId recipientId message read readAt timestamp fileUrl fileType")
    .sort({timestamp: 1,});
  res.json(messages);
});

messageRouter.post("/uploadImage", upload.single("file"), async(req, res):Promise<void> => {
  if (!req.file) {
     res.status(HttpStatus.BAD_REQUEST).send("No file uploaded.");
     return;
  }
  const imageUrl = req.file.path;
  res.status(HttpStatus.OK).json({ imageUrl });
  return;
});


messageRouter.post(
  "/uploadVideo",
  uploadVideo.single("file"),
  async(req, res): Promise<void> => {
    if (!req.file) {
       res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: MESSAGES.NO_FILE_UPLOADED });
        return;
    }
    const videoUrl = req.file.path;
     res.status(HttpStatus.OK).json({ videoUrl });
     return;
     
  }
);
export default messageRouter;
