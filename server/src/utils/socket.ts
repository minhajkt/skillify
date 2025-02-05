import { Server as SocketIOServer } from "socket.io";
import http from "http";
import Message from "../modules/messages/messageModel";
import MessageRoom from "../modules/messages/messageRoomModel";
import mongoose from "mongoose";

export const initializeSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const getOrCreateRoom = async (senderId: string, recipientId: string) => {
      let room = await MessageRoom.findOne({
        users: { $all: [senderId, recipientId] },
      }).select("_id");
      if (!room) {
        room = new MessageRoom({ users: [senderId, recipientId] });
        await room.save();
      }
      return room._id;
    };

    socket.on("joinRoom", async ({ senderId, recipientId }) => {
      const roomId = await getOrCreateRoom(senderId, recipientId);
      socket.join(roomId.toString());
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    socket.on("message", async ({ senderId, recipientId, message, fileUrl, fileType }) => {
      const roomId = await getOrCreateRoom(senderId, recipientId);

      const newMessage = new Message({
        senderId,
        recipientId,
        message,
        roomId,
        read: false,
        fileUrl: fileUrl || null,
        fileType: fileType || null
      });
      await newMessage.save();

      await MessageRoom.findByIdAndUpdate(
        roomId,
        { lastMessage: message, lastMessageAt: new Date() },
        { new: true }
      );
      io.to(roomId.toString()).emit("receive_message", {
        ...newMessage.toObject(),
        timestamp: newMessage.timestamp.toISOString(),
      });

      const unreadCounts = await Message.aggregate([
        {
          $match: {
            recipientId,
            read: false,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
          },
        },
      ]);

      io.to(roomId.toString()).emit("unread_count_update", unreadCounts);
    });

    socket.on("message_read", async ({ senderId, recipientId }) => {
      const roomId = await getOrCreateRoom(senderId, recipientId);
      const currentTime = new Date();
      await Message.updateMany(
        { roomId, senderId: recipientId, recipientId: senderId, read: false },
        { $set: { read: true, readAt: currentTime } }
      );

      console.log(`Messages marked as read in room: ${roomId}`);
      console.log(`senderId ${senderId} and recieverId: ${recipientId}`);

      const unreadCounts = await Message.aggregate([
        {
          $match: {
            recipientId: senderId,
            read: false,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
          },
        },
      ]);
      io.to(roomId.toString()).emit("message_read", {
        senderId: recipientId,
        recipientId: senderId,
        readAt: currentTime,
      });

      io.to(roomId.toString()).emit("unread_count_update", unreadCounts);
    });

    socket.on("delete_message", async ({ messageId, senderId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          console.log("No message found");
          return;
        }

        await Message.findByIdAndUpdate(messageId, {
          message: "This message was deleted",
        });

        io.to(message.roomId.toString()).emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Failed to delete message");
      }
    });

    socket.on("get_unread_count", async ({ userId }) => {
      const unreadCounts = await Message.aggregate([
        {
          $match: {
            recipientId: userId,
            read: false,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
          },
        },
      ]);

      socket.emit("unread_count_update", unreadCounts);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

/////////////////////////////////////////////////////

/////////////////////////////////////////////////////

// import { Server as SocketIOServer } from "socket.io";
// import http from "http";
// import Message from "../modules/messages/messageModel";
// import MessageRoom from "../modules/messages/messageRoomModel";
// import mongoose from "mongoose";

// export const initializeSocket = (server: http.Server) => {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: process.env.CORS_ORIGIN || "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     const getOrCreateRoom = async (senderId: string, recipientId: string) => {
//       let room = await MessageRoom.findOne({
//         users: { $all: [senderId, recipientId] },
//       }).select("_id");
//       if (!room) {
//         room = new MessageRoom({ users: [senderId, recipientId] });
//         await room.save();
//       }
//       return room._id
//     };

//     socket.on("joinRoom", async ({ senderId, recipientId }) => {
//       const roomId = await getOrCreateRoom(senderId, recipientId);
//       socket.join(roomId.toString());
//       console.log(`${socket.id} joined room: ${roomId}`);
//     });

//     socket.on("message", async ({ senderId, recipientId, message }) => {
//       const roomId = await getOrCreateRoom(senderId, recipientId);

//       const newMessage = new Message({
//         senderId,
//         recipientId,
//         message,
//         roomId,
//         read: false,
//       });
//       await newMessage.save();

//       await MessageRoom.findByIdAndUpdate(
//         roomId,
//         { lastMessage: message, lastMessageAt: new Date() },
//         { new: true }
//       );
//       io.to(roomId.toString()).emit("receive_message", {
//     ...newMessage.toObject(),
//     timestamp: newMessage.timestamp.toISOString()
//   });

//   const unreadCounts = await Message.aggregate([
//     {
//       $match: {
//         recipientId,
//         read: false,
//       },
//     },
//     {
//       $group: {
//         _id: "$senderId",
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   io.to(roomId.toString()).emit("unread_count_update", unreadCounts);
//     });

//     socket.on("message_read", async ({ senderId, recipientId }) => {
//       const roomId = await getOrCreateRoom(senderId, recipientId);
//       const currentTime = new Date();
//       await Message.updateMany(
//         { roomId, senderId: recipientId,recipientId: senderId, read: false },
//         { $set: { read: true, readAt: currentTime } }
//       );

//       console.log(`Messages marked as read in room: ${roomId}`);
//       console.log(`senderId ${senderId} and recieverId: ${recipientId}`);

//       const unreadCounts = await Message.aggregate([
//     {
//       $match: {
//         recipientId: senderId,
//         read: false
//       }
//     },
//     {
//       $group: {
//         _id: "$senderId",
//         count: { $sum: 1 }
//       }
//     }
//   ])
//       io.to(roomId.toString()).emit("message_read", {
//         senderId: recipientId,
//         recipientId: senderId,
//         readAt: currentTime,
//       });

//       io.to(roomId.toString()).emit("unread_count_update", unreadCounts);
//     });

//     socket.on('delete_message', async({messageId, senderId}) => {
//       try {
//               const message = await Message.findById(messageId)
//       if(!message) {
//         console.log('No message found');
//         return
//       }

//       await Message.findByIdAndUpdate(messageId, {message: "This message was deleted"})

//       io.to(message.roomId.toString()).emit("message_deleted", { messageId });
//       } catch (error) {
//         console.error('Failed to delete message');
//       }
//     })

//     socket.on("get_unread_count", async ({ userId }) => {
//   const unreadCounts = await Message.aggregate([
//     {
//       $match: {
//         recipientId: userId,
//         read: false
//       }
//     },
//     {
//       $group: {
//         _id: "$senderId",
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   socket.emit("unread_count_update", unreadCounts);
// });

//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });

//   return io;
// };
