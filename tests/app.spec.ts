import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

test.describe("my awesome project", () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  // Ensures that the server and client are ready before running tests.
  test.beforeAll(() => {
    return new Promise((resolve) => {
      // Create an HTTP server
      const httpServer = createServer();

      // Initialize a Socket.IO server
      io = new Server(httpServer);

      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;

        clientSocket = ioc(`http://localhost:${port}`);

        // Server-side connection
        io.on("connection", (socket) => {
          serverSocket = socket;
        });

        // Client-side connection
        clientSocket.on("connect", resolve as () => void);
      });
    });
  });

  // Prevents memory leaks and leftover connections.
  test.afterAll(() => {
    // Stops the Socket.IO server
    io.close();

    // Disconnects the client socket
    clientSocket.disconnect();
  });

  // Verifies that the server can send data to the client.
  test("should work", () => {
    return new Promise((resolve) => {
      // Client listens for "hello" and receives the message.
      clientSocket.on("hello", (arg) => {
        // Assertion: Checks that the received data is "world".
        expect(arg).toEqual("world");

        // Resolves the promise to complete the test.
        resolve();
      });

      // Server sends an event
      serverSocket.emit("hello", "world");
    });
  });

  // Verifies that client-to-server messages work with acknowledgments.
  test("should work with an acknowledgement", () => {
    return new Promise((resolve) => {
      // Server listens for "hi" and executes the callback, sending "hola" as a response.
      serverSocket.on("hi", (cb) => {
        cb("hola");
      });

      // Client emits a "hi" event with a callback function.
      clientSocket.emit("hi", (arg) => {
        // Client receives "hola" and asserts the value.
        expect(arg).toEqual("hola");

        // Resolves the promise to complete the test.
        resolve();
      });
    });
  });

  // Verifies that acknowledgment-based communication works using emitWithAck().
  test("should work with emitWithAck()", async () => {
    // Server listens for "foo" and responds with "bar".
    serverSocket.on("foo", (cb) => {
      cb("bar");
    });

    // Client uses emitWithAck() to send "foo" and wait for the response.
    const result = await clientSocket.emitWithAck("foo");

    // Assertion: Checks that the response is "bar".
    expect(result).toEqual("bar");
  });

  // Ensures that an event is received before proceeding.
  test("should work with waitFor()", async () => {
    // Client emits "baz".
    clientSocket.emit("baz");

    // Test waits for the server to receive "baz" using the waitFor() helper
    await waitFor(serverSocket, "baz");
  });
});
