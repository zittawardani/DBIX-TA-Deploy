import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import { Socket } from "net";
import { NextApiResponse } from "next";

export interface NextApiResponseServerIo extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io?: IOServer;
    };
  };
}
