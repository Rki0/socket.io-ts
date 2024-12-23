import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on("operator/message-success", (a, b) => {
  console.log(a, b);
});
