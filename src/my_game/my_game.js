"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
  constructor() {
    super();

    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.socketTest = null;
    this.drawSet = [];
  }

  async init() {
    // Step A: set up the cameras
    this.mCamera = new engine.Camera(
      vec2.fromValues(30, 27.5), // position of the camera
      100, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    let ipBox = document.createElement("INPUT");
    document.body.appendChild(ipBox);
    ipBox.setAttribute("type", "text");
    ipBox.setAttribute("value", "localhost");
    ipBox.style.position = "absolute";
    ipBox.style.height = "50px";
    ipBox.style.fontSize = "25pt";
    ipBox.onclick = () => {
      ipBox.value = "";
      ipBox.onclick = null;
    };

    let portBox = document.createElement("INPUT");
    document.body.appendChild(portBox);
    portBox.setAttribute("type", "text");
    portBox.setAttribute("value", "3000");
    portBox.style.position = "absolute";
    portBox.style.top = "80px";
    portBox.style.height = "50px";
    portBox.style.fontSize = "25pt";
    portBox.onclick = () => {
      portBox.value = "";
      portBox.onclick = null;
    };

    let connectBtn = document.createElement("BUTTON");
    document.body.appendChild(connectBtn);
    connectBtn.style.fontSize = "25pt";
    connectBtn.textContent = "Connect";
    connectBtn.style.height = "50px";
    connectBtn.style.width = "200px";

    let hostBtn = document.createElement("BUTTON");
    document.body.appendChild(hostBtn);
    hostBtn.style.fontSize = "25pt";
    hostBtn.textContent = "Host";
    hostBtn.style.height = "50px";
    hostBtn.style.width = "200px";
    hostBtn.style.border = "none";

    let clientBtn = document.createElement("BUTTON");
    document.body.appendChild(clientBtn);
    clientBtn.style.border = "1px solid red";
    clientBtn.style.fontSize = "25pt";
    clientBtn.textContent = "Client";
    clientBtn.style.height = "50px";
    clientBtn.style.width = "200px";
    clientBtn.focus();

    let lastclick = "client";
    hostBtn.onclick = () => {
      hostBtn.style.border = "1px solid red";
      hostBtn.focus();
      clientBtn.style.border = "none";
      clientBtn.blur();

      lastclick = hostBtn.textContent.toLowerCase();
    };

    clientBtn.onclick = () => {
      clientBtn.style.border = "1px solid red";
      clientBtn.focus();
      hostBtn.style.border = "none";
      hostBtn.blur();

      lastclick = clientBtn.textContent.toLowerCase();
    };

    connectBtn.onclick = async () => {
      // ------------------------------------------
      if (ipBox.value === "Input IP" || portBox.value === "Input port") {
        setTimeout(() => {
          alert("Please input ip and port");
        });
      } else {
        console.log(lastclick);
        if (this.socketTest) {
          this.socketTest.close();
          this.socketTest = null;
        }
        if (lastclick === "client") {
          this.socketTest = new engine.SocketClient(ipBox.value, portBox.value);
          await this.socketTest.connectPromise();
        } else if (lastclick === "host") {
          this.socketTest = new engine.SocketHost(ipBox.value, portBox.value);
          await this.socketTest.connectPromise();
        }
        // Two most required lines, the function this is running on has to be async
        // -----------------------------------------
      }
    };
  }

  // This is the draw function, make sure to setup proper drawing environment, and more
  // importantly, make sure to _NOT_ change any state.
  draw() {
    // Step A: clear the canvas
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setViewAndCameraMatrix();
    for (let obj of this.drawSet) {
      obj.draw(this.mCamera);
    }
  }

  // The Update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  async update() {}
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
