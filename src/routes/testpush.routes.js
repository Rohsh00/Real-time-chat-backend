// routes/testPush.routes.js
const express = require("express");
const router = express.Router();
const PushSub = require("../models/pushSubscription.model");
const webpush = require("../config/webpush");

router.post("/:userId", async (req, res) => {
  const userSub = await PushSub.findOne({ userId: req.params.userId });

  if (!userSub) {
    return res.status(404).json({ message: "No subscription found" });
  }

  await webpush.sendNotification(
    userSub.subscription,
    JSON.stringify({
      title: "Test Notification ✅",
      body: "Web Push is working!",
      url: "/",
    })
  );

  res.json({ success: true });
});

module.exports = router;
