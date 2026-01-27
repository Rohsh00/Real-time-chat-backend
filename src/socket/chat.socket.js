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
    const msg = await Message.create(data);

    await ChatList.findByIdAndUpdate(data.chatId, {
      lastMessage: data.message,
    });

    io.to(data.chatId).emit("receiveMessage", msg);

    // if (onlineUsers.has(receiverId)) {
    const userSub = await PushSub.findOne({ userId: receiverId });
    console.log({ userSub });
    if (userSub) {
      console.log({ userSub });
      await webpush.sendNotification(
        userSub.subscription,
        JSON.stringify({
          title: `New message from ${socket.username}`,
          body: message || "📎 Attachment",
          url: `/chat?chatid=${chatId}`,
        })
      );
      // }
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });
};

module.exports = chatSocket;
