import Socket from "./socket.js";

class SocketClient extends Socket {
  constructor(ip, port, type) {
    super(ip, port, type);
    this.message.type = "client";
  }

  
}

export default SocketClient;
