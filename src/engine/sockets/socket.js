"use strict";

const storageMap = new Map();

class Socket {
  constructor(ip, port, type) {
    this.address = "ws://" + ip + ":" + port;
    console.log(this.address);
  }

  connectPromise() {
    return new Promise((resolve, reject) => {
      console.log("Trying to connect...");
      setTimeout(() => {
        this.ws = new WebSocket(this.address);
        this.ws.onopen = () => {
          console.log("Found a connection");
          this.ws.send(JSON.stringify("Connected"));
          this.init();
          resolve(this.ws);
        };

        this.ws.onerror = async (error) => {
          await this.connectPromise();
        };
      }, 1000);
    });
  }

  connect() {
    console.log("Trying to connect...");
    this.ws = new WebSocket(this.address);
    this.ws.onopen = () => {
      console.log("Found a connection");
      this.init();
    };
  }

  printMap() {
    for (let [key, value] of storageMap.entries()) {
      console.log(key, value);
    }
  }

  init() {
    console.log("Initializing...");

    this.ws.onclose = async (event) => {
      console.log("Closed " + event);
      await this.connectPromise();
    };

    this.ws.onerror = (error) => {
      console.log(`[error] ${error.message}`);
    };
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // console.log("Message recieved " + msg);
      storageMap.set("key", msg);
    };
  }

  sendInfo(data) {
    this.ws.send(JSON.stringify(data));
  }

  recieveInfo() {
    for (let value of storageMap.values()) {
      return value;
    }
  }

  setOnMessage() {
    this.ws.onmessage = null;
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // console.log("Message recieved " + msg);
      storageMap.set("key", msg);
    };
  }

  setAwaitMessage() {
    return new Promise((resolve, reject) => {
      this.ws.onmessage = null;
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
