const Message = require("../models/messages.model");
const ChatList = require("../models/chatlist.model");

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
    const msg = await Message.create(data);

    await ChatList.findByIdAndUpdate(data.chatId, {
      lastMessage: data.message,
    });

    io.to(data.chatId).emit("receiveMessage", msg);
  });

  socket.on(
    "sendPrivateMessage",
    async ({
      chatId,
      senderId,
      receiverId,
      type = "text",
      message,
      fileUrl,
      fileName,
      fileSize,
    }) => {
      const msgData = {
        chatId,
        senderId,
        receiverId,
        username: socket.username,
        type,
        message,
        fileUrl,
        fileName,
        fileSize,
      };

      io.to(chatId).emit("receivePrivateMessage", msgData);

      await Message.create(msgData);
    }
  );

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });
};

module.exports = chatSocket;
