const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatList",
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      required: true,
      ref: "User",
    },

    receiverId: {
      type: String,
      required: true,
      ref: "User",
    },

    username: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    message: {
      type: String,
      required: function () {
        return this.type === "text";
      },
    },

    fileUrl: String,
    fileName: String,
    fileSize: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
