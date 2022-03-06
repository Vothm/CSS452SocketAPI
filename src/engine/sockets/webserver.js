const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 51400 });
let sockets = [];

const clients = new Map();

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
wss.on("connection", (ws, req) => {
  const id = uuidv4();
  const metadata = { id };
  clients.set(ws, metadata);

  console.log(
    "Connection made with userID " +
      id +
      " at " +
      new Date().toLocaleTimeString()
  );

  ws.on("message", (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
      console.log(msg);
    } catch (e) {
      console.log("Error parsing message: " + e);
    }
    // const msg = message;
    const data = clients.get(ws);
    if (msg) {
      msg.sender = data.id;
      const outbound = JSON.stringify(msg);
      [...clients.keys()].forEach((client) => {
        client.send(outbound);
      });
      console.log(
        "Send message to all clients: " + outbound + " " + clients.size
      );
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});
