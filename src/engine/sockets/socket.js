"use strict";

class Socket {
  constructor(ip, port, type) {
    // Let's store ID an Data as key value pair
    // storage map keeps the latest data
    // of peers
    this.storageMap = new Map();
    this.address = "ws://" + ip + ":" + port;
    this.message = {
      type: null,
      data: null,
      id: null,
      tag: "myTag",
      canMove: true,
      turn: null,
      prevTurn: null,
    };

    this.message.canMove = true;
    console.log(this.address);
  }

  connectPromise() {
    return new Promise((resolve, reject) => {
      console.log("Trying to connect...");
      setTimeout(() => {
        this.ws = new WebSocket(this.address);
        this.ws.onopen = () => {
          console.log("Found a connection");
          this.init();
          this.sendInfo("init");
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
    for (let [key, value] of this.storageMap.entries()) {
      console.log(key, value);
    }
  }

  init() {
    console.log("Initializing...");

    this.ws.onclose = async (event) => {
      console.log("Closed " + event);
    };

    this.ws.onerror = async (error) => {
      console.log(`[error] ${error.message}`);
      await this.connectPromise();
    };

    this.setOnMessage();
  }
  setOnMessage() {
    this.ws.onmessage = null;
    this.setMessage();
  }
  sendInfo(data) {
    let tempMsg = this.message;
    tempMsg.data = data;
    this.ws.send(JSON.stringify(tempMsg));
  }

  recieveInfo() {
    for (let value of this.storageMap.values()) {
      return value;
    }
  }

  setMessage() {
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // console.log("Message recieved " + msg);
      if (msg.data === "init") {
        this.message.id = msg.id;
        console.log(this.message);
      } else {
        this.storageMap.set("key", msg);
      }

      console.log("Recieved message " + msg);
    };
  }

  setAwaitMessage() {
    return new Promise((resolve, reject) => {
      this.ws.onmessage = null;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // console.log("Message recieved " + msg);
        this.storageMap.set("key", msg);
        resolve(event);
      };
    });
  }

  close() {
    this.ws.close();
  }
}

export default Socket;
