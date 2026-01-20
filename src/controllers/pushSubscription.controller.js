const PushSub = require("../models/pushSubscription.model");

const pushSubscription = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, subscription } = req.body;

    if (!userId || !subscription) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await PushSub.findOneAndUpdate(
      { userId },
      { subscription },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Push subscription error:", error);
    res.status(500).json({ message: "Failed to save subscription" });
  }
};

module.exports = { pushSubscription };
