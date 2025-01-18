import React, { useEffect, useState } from "react";
import { socket } from "./socket/index";

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [ackMessage, setAckMessage] = useState<string>("");

  useEffect(() => {
    socket.connect(); // Manually connect the client

    // Listen for "hello" event from server
    socket.on("hello", (msg: string) => {
      setMessage(msg);
    });

    return () => {
      socket.disconnect(); // Disconnect on unmount
    };
  }, []);

  // Send event with acknowledgment
  const sendAcknowledgment = () => {
    socket.emit("hi", "test", (response) => {
      setAckMessage(response);
    });
  };

  // Send "foo" event using emitWithAck()
  const sendEmitWithAck = async () => {
    const response: string = await socket.emitWithAck("foo");
    setAckMessage(response);
  };

  // Send "baz" event
  const sendBazEvent = () => {
    socket.emit("baz");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Socket.IO React App</h1>
      <p>Received message: {message}</p>

      <button onClick={sendAcknowledgment}>Send "hi" Event</button>
      <button onClick={sendEmitWithAck}>Send "foo" Event</button>
      <button onClick={sendBazEvent}>Send "baz" Event</button>

      <p>Received Acknowledgment: {ackMessage}</p>
    </div>
  );
};

export default App;
