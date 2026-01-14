const express = require("express");
const {
  userLogin,
  findUsersByUsername,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/userLogin", userLogin);
router.get("/findUsersByUsername", findUsersByUsername);

module.exports = router;
