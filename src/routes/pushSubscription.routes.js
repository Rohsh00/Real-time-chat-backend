const express = require("express");
const {
  pushSubscription,
} = require("../controllers/pushSubscription.controller");

const router = express.Router();

router.post("/", pushSubscription);

module.exports = router;
