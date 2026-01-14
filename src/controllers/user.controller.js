require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: {
        userId: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.log("loginUser", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const findUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const keyword = username.trim().toLowerCase();

    const users = await User.find({
      username: {
        $regex: keyword,
        $options: "i",
      },
    })
      .select("_id username")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    console.error("findUsersByUsername error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userLogin, findUsersByUsername };
