const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user.model");

mongoose.connect("mongodb://localhost:27017/chatApp");

const createUsers = async () => {
  const users = [
    { username: "vaibhav", password: "123456" },
    { username: "amit", password: "123456" },
    { username: "rahul", password: "123456" },
    { username: "manish", password: "123456" },
    { username: "anjali", password: "123456" },
    { username: "dikshant", password: "123456" },
    { username: "aditi", password: "123456" },
    { username: "kishan", password: "123456" },
    { username: "ajay", password: "123456" },
    { username: "akshansh", password: "123456" },
    { username: "ramkishor", password: "123456" },
    { username: "hamendar", password: "123456" },
    { username: "jaswant", password: "123456" },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await User.create({
      username: u.username,
      password: hashedPassword,
    });
  }

  process.exit();
};

createUsers();
