"use strict";

const storageMap = new Map();

class Socket {
  constructor(ip, port, type) {
    this.address = "ws://" + ip + ":" + port;
    console.log(this.address);
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log("Trying to connect...");
      this.ws = new WebSocket(this.address);
      this.ws.onopen = () => {
        console.log("Found a connection");
        this.init();
        resolve(this.ws);
      };

      this.ws.onerror = (error) => {
        reject(error);
      };
    });
  }

  printMap() {
    for (let [key, value] of storageMap.entries()) {
      console.log(key, value);
    }
  }

  init() {
    console.log("Initializing...");

    this.ws.onclose = (event) => {
      console.log("Closed " + event);
    };

    this.ws.onerror = (error) => {
      console.log(`[error] ${error.message}`);
    };
  }

  update() {}

  sendInfo(data) {
    this.ws.send(JSON.stringify(data));
  }

  recieveInfo() {
    for (let value of storageMap.values()) {
      return value;
    }
  }

  message() {
    return new Promise((resolve, reject) => {
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // console.log("Message recieved " + msg);
        storageMap.set("key", msg);
        resolve(event);
      };
    });
  }
}

export default Socket;
