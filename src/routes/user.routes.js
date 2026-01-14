const express = require("express");
const {
  userLogin,
  findUsersByUsername,
  userSignup,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/userLogin", userLogin);
router.post("/userSignup", userSignup);
router.get("/findUsersByUsername", findUsersByUsername);

module.exports = router;
