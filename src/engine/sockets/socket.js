"use strict";

const storageMap = new Map();

class Socket {
  constructor(ip, port, type) {
    this.address = "ws://" + ip + ":" + port;
    // + ip + ":" + port;
    console.log(this.address);
    // if (type == "Host") {
    // } else {
    this.ws = new WebSocket(this.address);

    // }

    // this.ws.onopen = function (e) {
    //   //   alert("[open] Connection established");
    //   //   alert("Sending to server");
    //   this.ws.send("Hello");
    //   console.log("sent msg to server");
    // };

    this.ws.addEventListener("open", () => {
      //   this.ws.send(
      //     JSON.stringify({
      //       x: 254,
      //       y: 30,
      //     })
      //   );
      console.log("FR?");
    });

    this.ws.onmessage = function (event) {
      const msg = JSON.parse(event.data);
      console.log("Message " + msg);
      storageMap.set("key", msg);
    };

    this.ws.onclose = function (event) {
      //   if (event.wasClean) {
      //     alert(
      //       `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      //     );
      //   } else {
      //     // e.g. server process killed or network down
      //     // event.code is usually 1006 in this case
      //     alert("[close] Connection died");
      //   }
    };

    // this.ws.onerror = function (error) {
    //   alert(`[error] ${error.message}`);
    // this.init();
  }

  printMap() {
    for (let [key, value] of storageMap.entries()) {
      console.log(key, value);
    }
  }
  init() {}

  update() {}

  sendInfo(data) {
    this.ws.send(JSON.stringify(data));
  }

  recieveInfo() {
    for (let [key, value] of storageMap.entries()) {
      console.log("Value ", value);
      return value;
    }
    // console.log("KEYYY? " + storageMap.get("key"));
    // return storageMap.get("key");
  }
}

export default Socket;
