const ChatList = require("../models/chatlist.model");

const startChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { selectedUserId } = req.body;

    if (!selectedUserId) {
      return res.status(400).json({ message: "Selected user required" });
    }

    const users = [userId, selectedUserId].sort();

    const chat = await ChatList.findOneAndUpdate(
      { user1: users[0], user2: users[1] },
      { $setOnInsert: { user1: users[0], user2: users[1] } },
      { upsert: true, new: true }
    );

    res.status(200).json(chat);
  } catch (err) {
    console.error("startChat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await ChatList.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1", "username")
      .populate("user2", "username")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { startChat, getMyChats };
