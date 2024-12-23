import { socket } from "..";

socket.on("bot/message-success", (a, b) => {
  console.log(a, b);
});

socket.on("bot/hello-world", (a) => {
  console.log(a);
});
