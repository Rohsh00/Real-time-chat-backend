const express = require("express");

const { getChatHistory } = require("../controllers/message.controller");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

router.get("/history/:chatId", authMiddleware, getChatHistory);

module.exports = router;
