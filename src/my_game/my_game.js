"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import GameManager from "./game_manager.js";

class MyGame extends engine.Scene {
  constructor() {
    super();

    // The camera to view the scene
    this.mCamera = null;

    this.renderables = [];

    this.socket = null;

    this.drawSet = [];

    this.boardSprite = "assets/board.png";
    this.crossSprite = "assets/cross.png";
    this.circleSprite = "assets/circle.png";

    this.gameManager = null;
    this.gameState = 0;

    this.stalemateMessage = null;
    this.circleWinMessage = null;
    this.crossWinMessage = null;

    this.socket = null;

  }

  load() {
    engine.texture.load(this.boardSprite);
    engine.texture.load(this.crossSprite);
    engine.texture.load(this.circleSprite);
  }

  unload() {
    engine.texture.unload(this.boardSprite);
    engine.texture.unload(this.crossSprite);
    engine.texture.unload(this.circleSprite);
  }

  async init() {
    // Step A: set up the cameras
    this.mCamera = new engine.Camera(
      vec2.fromValues(30, 27.5), // position of the camera
      100, // width of camera
      [0, 0, 640, 640] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    this.gameManager = new GameManager();
    this.gameManager.init(
      this.boardSprite,
      this.circleSprite,
      this.crossSprite
    );

    this.stalemateMessage = new engine.FontRenderable("Stalemate");
    this.stalemateMessage.setColor([0.5, 0.5, 0.5, 1]);
    this.stalemateMessage.getXform().setPosition(18, 27.5);
    this.stalemateMessage.setTextHeight(5);

    this.circleWinMessage = new engine.FontRenderable("Player 2 Wins");
    this.circleWinMessage.setColor([0.5, 0.5, 0.5, 1]);
    this.circleWinMessage.getXform().setPosition(13, 27.5);
    this.circleWinMessage.setTextHeight(5);

    this.crossWinMessage = new engine.FontRenderable("Player 1 Wins");
    this.crossWinMessage.setColor([0.5, 0.5, 0.5, 1]);
    this.crossWinMessage.getXform().setPosition(13, 27.5);
    this.crossWinMessage.setTextHeight(5);

    this.socket = new engine.SocketClient("server.vonce.me", "80");
    await this.socket.connectPromise();

    //this.socket.sendInfo(this.gameManager.gameState);

    /*

    this.socket = new engine.Socket("server.vonce.me", "80", "Client");
    
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(5000);
    
    this.socket.sendInfo("Hello World");

    await sleep(2000);

    let msg = this.socket.recieveInfo();
    //console.log("MESSAGE RECEIVED: " + msg);
    */
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

    this.gameManager.draw(this.mCamera);

    if (this.gameState == 1) {
      this.crossWinMessage.draw(this.mCamera);
    }
    if (this.gameState == 2) {
      this.circleWinMessage.draw(this.mCamera);
    }
    if (this.gameState == 3) {
      this.stalemateMessage.draw(this.mCamera);
    }
  }

  // The Update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    //console.log("my key is " + this.socket.lastMessage.id);

    if(this.socket.message.canMove === true)
    {

        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(0, 0)) {
            this.gameManager.createCross(0, 0);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(0, 0)) {
            this.gameManager.createCircle(0, 0);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.W)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(1, 0)) {
            this.gameManager.createCross(1, 0);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(1, 0)) {
            this.gameManager.createCircle(1, 0);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.E)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(2, 0)) {
            this.gameManager.createCross(2, 0);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(2, 0)) {
            this.gameManager.createCircle(2, 0);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.A)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(0, 1)) {
            this.gameManager.createCross(0, 1);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(0, 1)) {
            this.gameManager.createCircle(0, 1);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.S)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(1, 1)) {
            this.gameManager.createCross(1, 1);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(1, 1)) {
            this.gameManager.createCircle(1, 1);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.D)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(2, 1)) {
            this.gameManager.createCross(2, 1);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(2, 1)) {
            this.gameManager.createCircle(2, 1);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.Z)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(0, 2)) {
            this.gameManager.createCross(0, 2);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(0, 2)) {
            this.gameManager.createCircle(0, 2);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.X)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(1, 2)) {
            this.gameManager.createCross(1, 2);
            this.gameManager.swapTurn();
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(1, 2)) {
            this.gameManager.createCircle(1, 2);
            this.gameManager.swapTurn();
            }
        }
        }
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
        if (this.gameManager.getTurn() == 1) {
            //player 1
            if (this.gameManager.validateMove(2, 2)) {
            //console.log("turn before " + this.gameManager.currentTurn);
            this.gameManager.createCross(2, 2);
            this.gameManager.swapTurn();
            //console.log("turn after " + this.gameManager.currentTurn);
            }
        } else {
            //player 2
            if (this.gameManager.validateMove(2, 2)) {
            //console.log(this.gameManager.currentTurn);
            this.gameManager.createCircle(2, 2);
            this.gameManager.swapTurn();
            //console.log(this.gameManager.currentTurn);
            }
        }
        }
    }
    if (engine.input.isKeyClicked(engine.input.keys.P)) {
      this.gameManager.reset();
      this.gameManager.recreateGameObjects();
      this.socket.sendInfo(this.gameManager.gameState);
    }

    //this.socket.message.data = this.gameManager.gameState;
    let newMove = this.gameManager.hasMoveBeenMade();
    if (newMove) {
      console.log("move has been made");
      console.log(this.gameManager.gameState);
      this.socket.message.canMove = true;
      this.socket.sendInfo(this.gameManager.gameState);
      this.socket.messagae.canMove = false;
      // this.socket.printMap();
    }

    //this.socket.printMap();

    //this.socket.message.id

    if (!newMove) {
      for (let [key, value] of this.socket.storageMap.entries()) {
        //console.log(value);
        if (key != this.socket.message.id && value.tag == "myTag" && value.data != "not real data") {
          console.log("rewriting with server data");
          this.gameManager.gameState = value.data;
          //console.log(this.gameManager.gameState);
          this.gameManager.recreateGameObjects();
          this.socket.sendInfo("not real data");
        }
      }
    }
    this.gameState = this.gameManager.analyzeGame();

    //console.log(this.gameManager.gameState);
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
