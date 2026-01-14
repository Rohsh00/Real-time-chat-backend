require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const mongoConnect = require("./src/config/db");
const initSocket = require("./src/socket");

const uploadRoutes = require("./src/routes/upload.routes");
const messageRoutes = require("./src/routes/message.routes");
const userRoutes = require("./src/routes/user.routes");
const chatListRoutes = require("./src/routes/chatlist.routes");

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

app.get("/health", (req, res) => {
  res.json({ status: "OK", server: "running" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoConnect();
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
