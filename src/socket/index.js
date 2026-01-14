const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:5173", "https://realchatapp1.netlify.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.username);
    require("./chat.socket")(io, socket);
  });
};

module.exports = initSocket;
