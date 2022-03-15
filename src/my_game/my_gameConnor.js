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

    this.dataTransfer = {
      tag: null,
      action: null,
      data: null,
      host: null
    };
    this.dataReciever = null;

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
          this.dataTransfer.tag = idBox.value;
          this.dataTransfer.host = this.HostBool;
          this.socketTest = new engine.SocketClient(ipBox.value, portBox.value);
          await this.socketTest.connectPromise();
          this.Connected = true;
        } else if (lastclick === "host") {
          this.HostBool = "host";
          this.turnBool = true;
          this.waiting = false;
          this.lobbyNum = idBox.value;
          this.dataTransfer.tag = idBox.value;
          this.dataTransfer.host = this.HostBool;
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
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

    if(this.Connected == true) {
      if(this.turnBool == true){

        if(engine.input.isKeyClicked(engine.input.keys.Space)){
          this.dataTransfer.data = vec2.fromValues(this.selector.getPos()[0]-200, this.selector.getPos()[1]);
          this.dataTransfer.action = "shoot";
          this.dataTransfer.host = this.HostBool;
          this.turnBool = false;
          this.waiting = true;
          this.received = false;
          this.socketTest.sendInfo(this.dataTransfer);
          console.log("fired");
        }
      }
      else if(this.turnBool == false){
        for (let [key, value] of this.socketTest.storageMap.entries()) {
              
          if(key != this.socketTest.message.id && value.tag == "BS")
          {
            console.log(value);
            this.dataReciever = value.data;
            console.log(this.dataReciever);
          }

        }
        //this.dataReciever = this.socketTest.recieveInfo();
        //console.log(this.dataReciever);
        if(this.dataReciever != null){
          if(this.dataReciever.tag == "BS"){
            if(this.dataReciever.type != this.HostBool && this.dataReciever.data.host != this.HostBool){

              if(this.dataReciever.data.action == "shoot"){
                var temp = this.shipSet.checkHits(this.dataReciever.data.data[0], this.dataReciever.data.data[1]);
                if(temp == 1){
                  this.shotSet.createHit(this.dataReciever.data.data[0], this.dataReciever.data.data[1]);
                  this.dataTransfer.action = "resultHit";
                  this.dataTransfer.data = vec2.fromValues(this.dataReciever.data.data[0]+200, this.dataReciever.data.data[1]);
                  this.socketTest.sendInfo(this.dataTransfer);
                }
                else if(temp == 2){
                  this.shotSet.createMiss(this.dataReciever.data.data[0], this.dataReciever.data.data[1]);
                  this.dataTransfer.action = "resultMiss";
                  this.dataTransfer.data = vec2.fromValues(this.dataReciever.data.data[0]+200, this.dataReciever.data.data[1]);
                  this.socketTest.sendInfo(this.dataTransfer);
                }
                this.turnBool = true;
              }
              else if(this.dataReciever.data.action == "resultHit" && this.received != true){
                this.shotSet.createHit(this.dataReciever.data.data[0], this.dataReciever.data.data[1]);
                this.received = true;
              }
              else if(this.dataReciever.data.action == "resultMiss" && this.received != true){
                this.shotSet.createMiss(this.dataReciever.data.data[0], this.dataReciever.data.data[1]);
                this.received = true;
              }
              else if(this.dataReciever.data.action == "winCondition"){
                this.MsgVal.setText(this.dataReciever.data.data);
              }

            }
          }
        }

        this.dataReciever = null;
      }

      if(this.shipSet.checkDead() == true){
        this.dataTransfer.data = "You Won";
        this.dataTransfer.action = "winCondition";
        this.socketTest.sendInfo(this.dataTransfer);
        this.MsgVal.setText("You Lost");
      }


      /*console.log(this.waiting, this.socketTest.recieveInfo().lastMessage.tag == "BS", this.socketTest.recieveInfo().lastMessage.data.tag == this.lobbyNum, this.socketTest.recieveInfo().lastMessage.type != this.HostBool);
      if(this.waiting && this.recieved == false && this.socketTest.recieveInfo().tag == "BS" && this.socketTest.recieveInfo().data.tag == this.lobbyNum && this.socketTest.recieveInfo().type != this.HostBool){ 
        
        this.dataTransfer = this.socketTest.recieveInfo().data;
        console.log(this.dataTransfer);
        console.log(this.socketTest.recieveInfo());

        if(this.dataTransfer.action == "shoot"){

          if(this.shipSet.checkHits(this.dataTransfer.data[0], this.dataTransfer.data[1]) == 1){
            this.shotSet.createHit(this.dataTransfer.data[0], this.dataTransfer.data[1]);
            this.dataTransfer.action = "result";
            this.dataTransfer.data = "1";
          }
          else if(this.shipSet.checkHits(this.dataTransfer.data[0], this.dataTransfer.data[1]) == 2){
            this.shotSet.createMiss(this.dataTransfer.data[0], this.dataTransfer.data[1]);
            this.dataTransfer.action = "result";
            this.dataTransfer.data = "2";
          }

          this.shipSet.update();

          this.waiting = false;
          this.turnBool = true;
          this.socketTest.sendInfo(this.dataTransfer);
        }
        else if(this.dataTransfer.action == "result"){
          this.recieved = true;

          if(this.dataTransfer.data == "1"){
            this.shotSet.createHit(this.selector.getPos()[0]+200, this.selector.getPos()[1]);
          }
          else if(this.dataTransfer.data == "2"){ 
            this.shotSet.createMiss(this.selector.getPos()[0]+200, this.selector.getPos()[1]);
          }
        }
      }
      */
    }

    

    //this.socket.message.id
    //for (let [key, value] of this.socket.storageMap.entries()) {
    //    
    //  if(key != this.socket.message.id && value.lastMessage.tag == "BS")
    //  {
    //      console.log(value);
    //      this.gameManager.gameState = value.lastMessage.data;
    //      console.log(this.gameManager.gameState);
    //      //qthis.gameManager.recreateGameObjects();
    //  }
    //}
    //this.gameState = this.gameManager.analyzeGame();
    //console.log(this.gameManager.currentTurn);


  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGameConnor();
  myGame.start();
};
