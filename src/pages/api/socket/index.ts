import { Server as IOServer, Socket } from "socket.io";
import { NextApiRequest } from "next";
import { Server as HTTPServer } from "http";
import { NextApiResponseServerIo } from "@/types/socketDataTypes";

interface User {
  id: string;
  name?: string;
}

interface Message {
  id: string;
  discussionId: string;
  content: string;
  user: User;
  createdAt: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (!res.socket.server.io) {
    const httpServer: HTTPServer = res.socket.server;
    const io = new IOServer(httpServer, { path: "/api/socket" });

    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("chatMessage", (message: Message) => {
        console.log("Pesan diterima dari klien:", message);
        io.emit("chatMessage", message); // Kirim pesan lengkap ke semua klien
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

  }

  res.end();
}
