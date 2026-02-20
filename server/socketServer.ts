import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔥 USER ROOM JOIN
    socket.on("joinUser", (userId: string) => {
      socket.join(userId);
    });

    // 🔥 ADMIN ROOM
    socket.on("joinAdmin", () => {
      socket.join("admin-room");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
