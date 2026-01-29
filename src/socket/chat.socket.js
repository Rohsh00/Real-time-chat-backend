const Message = require("../models/messages.model");
const ChatList = require("../models/chatlist.model");
const webpush = require("../config/webpush");
const PushSub = require("../models/pushSubscription.model");

const onlineUsers = new Map();

const chatSocket = (io, socket) => {
  console.log("User connected:", socket.id);

  socket.on("setUser", ({ userId, username }) => {
    socket.userId = userId;
    socket.username = username;

    onlineUsers.set(userId, socket.id);

    console.log(`${username} connected`);

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`${socket.username} joined chat: ${chatId}`);
  });

  socket.on("typing", ({ chatId, senderId, username }) => {
    socket.to(chatId).emit("receiveTypingState", {
      senderId,
      chatId,
      username,
      isTyping: true,
    });
  });

  socket.on("stopTyping", ({ chatId, senderId, username }) => {
    socket.to(chatId).emit("receiveTypingState", {
      chatId,
      senderId,
      isTyping: false,
      username,
    });
  });

  socket.on("sendMessage", async (data) => {
    const { receiverId, chatId, senderId, username, message, type } = data;
    const msg = await Message.create({
      ...data,
      status: "sent",
    });

    await ChatList.findByIdAndUpdate(data.chatId, {
      lastMessage: data.message,
    });

    io.to(data.chatId).emit("receiveMessage", msg);

    const userSub = await PushSub.findOne({ userId: receiverId });
    if (userSub) {
      await webpush.sendNotification(
        userSub.subscription,
        JSON.stringify({
          title: `New message from ${socket.username}`,
          body: message || "📎 Attachment",
          url: `/chat/${chatId}`,
        }),
      );
    }
  });

  socket.on("messageDelivered", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, {
      status: "delivered",
      deliveredAt: new Date(),
    });

    const msg = await Message.findById(messageId);
    io.to(msg.chatId).emit("messageStatusUpdate", msg);
  });

  socket.on("messageSeen", async ({ chatId, userId }) => {
    await Message.updateMany(
      { chatId, receiverId: userId, status: "delivered" },
      { status: "seen", seenAt: new Date() },
    );

    const updated = await Message.find({ chatId });
    io.to(chatId).emit("bulkSeenUpdate", updated);
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });
};

module.exports = chatSocket;
