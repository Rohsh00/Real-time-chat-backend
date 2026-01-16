const mongoose = require("mongoose");

const PushSchema = new mongoose.Schema({
  userId: String,
  subscription: Object,
});

module.exports = mongoose.model("PushSubscription", PushSchema);
