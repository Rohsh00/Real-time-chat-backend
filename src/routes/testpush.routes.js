const express = require("express");
const router = express.Router();
const PushSub = require("../models/pushSubscription.model");
const webpush = require("../config/webpush");

router.post("/:userId", async (req, res) => {
  const userSub = await PushSub.findOne({ userId: req.params.userId });

  if (!userSub) {
    return res.status(404).json({ message: "No subscription found" });
  }

  try {
    await webpush.sendNotification(
      userSub.subscription,
      JSON.stringify({
        title: "✅ Production Push Test",
        body: "Your live push notification is working!",
        url: "/",
      })
    );

    res.json({ success: true });
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log("Expired push subscription, deleting...");

      await PushSub.deleteOne({ userId: req.params.userId });

      return res.status(410).json({
        message: "Push subscription expired. Please re-subscribe.",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Push failed" });
  }
});

module.exports = router;
