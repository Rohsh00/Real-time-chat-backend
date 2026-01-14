const express = require("express");
const router = express.Router();
const { startChat, getMyChats } = require("../controllers/chatlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/startChat", authMiddleware, startChat);
router.get("/getMyChats", authMiddleware, getMyChats);

module.exports = router;
