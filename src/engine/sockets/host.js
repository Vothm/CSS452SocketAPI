import Socket from "./socket.js";

class SocketHost extends Socket {
  constructor(ip, port, type) {
    super(ip, port, type);
    this.message.type = "host";
  }
}

export default SocketHost;
