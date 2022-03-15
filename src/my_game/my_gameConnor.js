"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Grid from "./Objects/grid.js";
import Selector from "./Objects/selector.js";
import Ships from "./Objects/ships.js";
import ShotHolder from "./Objects/shotHolder.js";

class MyGameConnor extends engine.Scene {
  constructor() {
    super();

    

    this.Connected = false;
    this.lobbyNum = 0;
    this.HostBool = "";
    this.turnBool = false;
    this.waiting = false;
    this.recieved = false;
    this.setup = 0;
    this.datTag = 0;

    
    

    //import textures 
    this.gridImage = "assets/Grid.png";
    this.battleshipImage = "assets/Battleship.png";
    this.cruiserImage = "assets/Cruiser.png";
    this.destroyerImage = "assets/Destroyer.png";
    this.carrierImage = "assets/Carrier.png";
    this.hitImage = "assets/Hit.png";
    this.missImage = "assets/Miss.png";

    this.shipSet = null;

    this.selector = null;

    // The camera to view the scene
    this.mCamera = null;
    this.mCameraPieces = null;
    this.mCameraShots = null;

    this.mMsg = null;

    this.socketTest = null;

    this.drawSet = [];

    this.shotSet = null;

    this.MsgVal = null;
    this.CountVal = 0;

    this.yourGrid = null;
    this.enemyGrid = null;
  }

  load(){ 
    engine.texture.load(this.gridImage);
    engine.texture.load(this.battleshipImage);
    engine.texture.load(this.cruiserImage);
    engine.texture.load(this.destroyerImage);
    engine.texture.load(this.carrierImage);
    engine.texture.load(this.hitImage);
    engine.texture.load(this.missImage);
  }

  unload(){ 
    engine.texture.unload(this.gridImage);
    engine.texture.unload(this.battleshipImage);
    engine.texture.unload(this.cruiserImage);
    engine.texture.unload(this.destroyerImage);
    engine.texture.unload(this.carrierImage);
    engine.texture.unload(this.hitImage);
    engine.texture.unload(this.missImage);
  }

  async init() {
    
    
    // Step A: set up the cameras
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 50), // position of the camera
      100, // width of camera
      [0, 0, 500, 500] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    this.mCameraPieces = new engine.Camera(
      vec2.fromValues(150, 50), // position of the camera
      10, // width of camera
      [500, 0, 100, 500] // viewport (orgX, orgY, width, height)
    );
    this.mCameraPieces.setBackgroundColor([0.4, 0.4, 0.8, 1]);

    this.mCameraShots = new engine.Camera(
      vec2.fromValues(250, 50), // position of the camera
      100, // width of camera
      [600, 0, 500, 500] // viewport (orgX, orgY, width, height)
    );
    this.mCameraShots.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.MsgVal = new engine.FontRenderable("");
    this.MsgVal.setColor([0, 0, 0, 1]);
    this.MsgVal.getXform().setPosition(50, 50);
    this.MsgVal.setTextHeight(3);

    

    this.yourGrid = new Grid(this.gridImage, true);
    this.enemyGrid = new Grid(this.gridImage, false);
    this.drawSet.push(this.yourGrid);
    this.drawSet.push(this.enemyGrid);

    this.shipSet = new Ships(this.battleshipImage, this.carrierImage, this.cruiserImage, this.destroyerImage);
    this.drawSet.push(this.shipSet);

    this.shotSet = new ShotHolder(this.hitImage, this.missImage);
    this.drawSet.push(this.shotSet);

    this.selector = new Selector(this.hitImage);
    this.drawSet.push(this.selector);

    this.drawSet.push(this.MsgVal);
    

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

    let idBox = document.createElement("INPUT");
    document.body.appendChild(idBox);
    idBox.setAttribute("type", "text");
    idBox.setAttribute("value", "Lobby Num");
    idBox.style.position = "absolute";
    idBox.style.top = "150px";
    idBox.style.height = "50px";
    idBox.style.fontSize = "25pt";
    idBox.onclick = () => {
      idBox.value = "";
      idBox.onclick = null;
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
      if (ipBox.value === "Input IP" || portBox.value === "Input port" || idBox.value === "Input ID") {
        setTimeout(() => {
          alert("Please input ip, port and lobby number");
        });
      } else {
        console.log(lastclick);
        if (this.socketTest) {
          this.socketTest.close();
          this.socketTest = null;
        }
        if (lastclick === "client") {
          this.HostBool = "client";
          this.turnBool = false;
          this.waiting = true;
          this.lobbyNum = idBox.value;
          this.datTag = idBox.value;
          this.recieved = true;
          this.socketTest = new engine.SocketClient(ipBox.value, portBox.value);
          await this.socketTest.connectPromise();
          this.Connected = true;
        } else if (lastclick === "host") {
          this.HostBool = "host";
          this.turnBool = true;
          this.waiting = false;
          this.lobbyNum = idBox.value;
          this.datTag = idBox.value;
          this.socketTest = new engine.SocketHost(ipBox.value, portBox.value);
          await this.socketTest.connectPromise();
          this.Connected = true;
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
    this.selector.draw(this.mCamera);
    
    this.mCameraPieces.setViewAndCameraMatrix();
    for (let obj of this.drawSet) {
      obj.draw(this.mCameraPieces);
    }

    this.mCameraShots.setViewAndCameraMatrix();
    for (let obj of this.drawSet) {
      obj.draw(this.mCameraShots);
    }
    this.selector.draw(this.mCameraShots);

  }

  // The Update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  async update() {
    var dataTransfer = {
      tag: null,
      action: null,
      data: null,
      host: null
    };
    var dataReciever = null;

    dataTransfer.host = this.HostBool;
    dataTransfer.tag = this.datTag;

    if(engine.input.isKeyClicked(engine.input.keys.X)){
      if(this.setup == 0){
        this.shipSet.createBB(this.selector.getPos()[0]+15, this.selector.getPos()[1], true);
        this.setup++;
      }
      else if(this.setup == 1){
        this.shipSet.createCV(this.selector.getPos()[0]+15, this.selector.getPos()[1], true);
        this.setup++;
      }
      else if(this.setup == 2){
        this.shipSet.createCC(this.selector.getPos()[0]+15, this.selector.getPos()[1], true);
        this.setup++;
      }
      else if(this.setup == 3){
        this.shipSet.createDD(this.selector.getPos()[0]+15, this.selector.getPos()[1], true);
        this.setup++;
      }
    }

    if(engine.input.isKeyClicked(engine.input.keys.Z)){
      if(this.setup == 0){
        this.shipSet.createBB(this.selector.getPos()[0]+15, this.selector.getPos()[1], false);
        this.setup++;
      }
      else if(this.setup == 1){
        this.shipSet.createCV(this.selector.getPos()[0]+15, this.selector.getPos()[1], false);
        this.setup++;
      }
      else if(this.setup == 2){
        this.shipSet.createCC(this.selector.getPos()[0]+15, this.selector.getPos()[1], false);
        this.setup++;
      }
      else if(this.setup == 3){
        this.shipSet.createDD(this.selector.getPos()[0]+15, this.selector.getPos()[1], false);
        this.setup++;
      }
    }

    if(this.setup == 4){
      this.selector.setPos(255,55);
      this.setup++;
    }

    this.selector.update();
    
    if(engine.input.isKeyClicked(engine.input.keys.B)){
      console.log(this.recieved, this.turnBool);
    }
    if(engine.input.isKeyClicked(engine.input.keys.N)){
      console.log(this.socketTest.recieveInfo());
    }

    console.log(this.turnBool);

    if(this.Connected == true) {
      if(this.turnBool == true){

        if(engine.input.isKeyClicked(engine.input.keys.Space)){
          dataTransfer.data = vec2.fromValues(this.selector.getPos()[0]-200, this.selector.getPos()[1]);
          dataTransfer.action = 1;
          dataTransfer.host = this.HostBool;
          this.turnBool = false;
          this.waiting = true;
          this.received = false;
          console.log("fired");
          console.log(dataTransfer.action);
          this.socketTest.sendInfo(dataTransfer);
          console.log(dataTransfer.action);
          console.log(dataTransfer);
          console.log("fired");
        }
      }
      else if(this.turnBool == false){
        
        dataReciever = this.socketTest.recieveInfo();
        //console.log(this.dataReciever);
        //console.log(this.dataReciever.tag == "BS", this.dataReciever.type != this.HostBool, this.dataReciever.data.host != this.HostBool);
        if(dataReciever != null){
          if(dataReciever.tag === "BS" && dataReciever.id !== this.socketTest.message.id){
            //if(this.dataReciever.type !== this.HostBool && this.dataReciever.data.host !== this.HostBool){
              //console.log(this.dataReciever);
              if(dataReciever.data.action == 1 && this.recieved == true){
                console.log("within shoot");
                console.log(dataReciever.data);
                console.log(dataReciever.data.data);
                console.log("within shoot");
                var temp = this.shipSet.checkHits(dataReciever.data.data[0], dataReciever.data.data[1]);
                if(temp == 1){
                  this.turnBool = true;
                  console.log("shot hit");
                  this.shotSet.createHit(dataReciever.data.data[0], dataReciever.data.data[1]);
                  dataTransfer.action = 2;
                  dataTransfer.data = vec2.fromValues(dataReciever.data.data[0]+200, dataReciever.data.data[1]);
                  this.socketTest.sendInfo(dataTransfer);
                }
                else if(temp == 2 || temp == 0){
                  this.turnBool = true;
                  console.log("shot missed");
                  this.shotSet.createMiss(dataReciever.data.data[0], dataReciever.data.data[1]);
                  dataTransfer.action = 3;
                  dataTransfer.data = vec2.fromValues(dataReciever.data.data[0]+200, dataReciever.data.data[1]);
                  this.socketTest.sendInfo(dataTransfer);
                }

              }
              else if(dataReciever.data.action == 2 && this.received != true){
                console.log("hit");
                console.log(dataReciever.data);
                console.log("hit");
                this.shotSet.createHit(dataReciever.data.data[0], dataReciever.data.data[1]);
                this.received = true;
              }
              else if(dataReciever.data.action == 3 && this.received != true){
                console.log("miss");
                console.log(dataReciever.data);
                console.log("miss");
                this.shotSet.createMiss(dataReciever.data.data[0], dataReciever.data.data[1]);
                this.received = true;
              }
              else if(dataReciever.data.action == 4){
                this.MsgVal.setText(dataReciever.data.data);
              }
              else{

              }

            //}
          }
        }

      }

      if(this.shipSet.checkDead() == true){
        dataTransfer.data = "You Won";
        dataTransfer.action = 4;
        this.socketTest.sendInfo(dataTransfer);
        this.MsgVal.setText("You Lost");
      }
    }

  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGameConnor();
  myGame.start();
};
