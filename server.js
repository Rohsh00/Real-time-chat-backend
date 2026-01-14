require("dotenv").config();

const cors = require("cors");
const mongoConnect = require("./src/config/db");
const uploadRoutes = require("./src/routes/upload.routes");
const messageRoutes = require("./src//routes/message.routes");
const userRoutes = require("./src/routes/user.routes");
const chatListRoutes = require("./src/routes/chatlist.routes");

const express = require("express");
const http = require("http");
const initSocket = require("./src/socket");

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/api/messages", messageRoutes);
app.use("/api/chatUploads", uploadRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/chatList", chatListRoutes);

mongoConnect();
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
