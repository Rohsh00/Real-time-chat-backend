const mongoose = require("mongoose");

const chatListSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

chatListSchema.index({ user1: 1, user2: 1 }, { unique: true });

module.exports = mongoose.model("ChatList", chatListSchema);
