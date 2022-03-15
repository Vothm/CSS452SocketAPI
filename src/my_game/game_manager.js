"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Board from "./board.js";
import Cross from "./cross.js";
import Circle from "./circle.js";

class GameManager{
  constructor() {
    this.drawSet = []
    this.boardSprite = null;
    this.circleSprite = null;
    this.crossSprite = null;

    this.board = null;

    this.currentTurn = 1;
    this.prevTurn = 1;

    this.boxLocationsX = [-4, 30, 64];
    this.boxLocationsY = [61, 27.5, -6];

    this.gameEnd = 0;
    this.gameState = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];

    
  }

  async init(boardSprite, circleSprite, crossSprite) {
    this.boardSprite = boardSprite;
    this.circleSprite = circleSprite;
    this.crossSprite = crossSprite;

    this.board = new Board(this.boardSprite, 30, 27.5)
    this.drawSet.push(this.board);

  }

  // This is the draw function, make sure to setup proper drawing environment, and more
  // importantly, make sure to _NOT_ change any state.
  draw(camera) {
    // Step A: clear the canvas
    
    for (let obj of this.drawSet) {
      obj.draw(camera);
    }
  }

  createCross(x, y)
  {
    let cross = new Cross(this.crossSprite, this.boxLocationsX[x], this.boxLocationsY[y]);
    this.drawSet.push(cross);
    this.gameState[x][y] = 1;
    //this.currentTurn = 2;
  }

  createCircle(x, y)
  {
    let circle = new Circle(this.circleSprite, this.boxLocationsX[x], this.boxLocationsY[y]);
    this.drawSet.push(circle);
    this.gameState[x][y] = 2;
    //this.currentTurn = 1;
  }

  swapTurn()
  {
    if(this.currentTurn == 1)
    {
      this.currentTurn = 2;
    }
    else
    {
      this.currentTurn = 1;
    }
  }

  hasMoveBeenMade()
  {
    if(this.prevTurn == this.currentTurn)
    {
      return false;
    }
    if(this.prevTurn != this.currentTurn)
    {
      this.prevTurn = this.currentTurn;
      return true;
    }
  }

  getTurn()
  {
    return this.currentTurn;
  }

  //0 = draw, 1 = cross win, 2 = circle win, 3 = draw
  analyzeGame()
  {
    //p1
    if(this.gameState[0][0] == 1 && this.gameState[0][1] == 1 && this.gameState[0][2] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[1][0] == 1 && this.gameState[1][1] == 1 && this.gameState[1][2] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[2][0] == 1 && this.gameState[2][1] == 1 && this.gameState[2][2] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[0][0] == 1 && this.gameState[1][0] == 1 && this.gameState[2][0] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[0][1] == 1 && this.gameState[1][1] == 1 && this.gameState[2][1] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[0][2] == 1 && this.gameState[1][2] == 1 && this.gameState[2][2] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    //diag
    if(this.gameState[0][0] == 1 && this.gameState[1][1] == 1 && this.gameState[2][2] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    if(this.gameState[0][2] == 1 && this.gameState[1][1] == 1 && this.gameState[2][0] == 1)
    {
      this.gameEnd = 1;
      return 1;
    }
    //p2
    if(this.gameState[0][0] == 2 && this.gameState[0][1] == 2 && this.gameState[0][2] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[1][0] == 2 && this.gameState[1][1] == 2 && this.gameState[1][2] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[2][0] == 2 && this.gameState[2][1] == 2 && this.gameState[2][2] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[0][0] == 2 && this.gameState[1][0] == 2 && this.gameState[2][0] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[0][1] == 2 && this.gameState[1][1] == 2 && this.gameState[2][1] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[0][2] == 2 && this.gameState[1][2] == 2 && this.gameState[2][2] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    //diag
    if(this.gameState[0][0] == 2 && this.gameState[1][1] == 2 && this.gameState[2][2] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    if(this.gameState[0][2] == 2 && this.gameState[1][1] == 2 && this.gameState[2][0] == 2)
    {
      this.gameEnd = 2;
      return 2;
    }
    let stalemate = true; //a stalemate is if all boxes have been filled
    for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
      {
        if(this.gameState[i][j] == 0)
        {
          stalemate = false;
        }
      }
    }
    if(stalemate)
    {
      this.gameEnd = 3;
      return 3;
    }
    return 0; //game is not yet complete
  }

  validateMove(x, y)
  {
    if(this.gameState[x][y] == 0 && this.gameEnd == 0)
    {
      console.log("move validation success");
      return true;
    }
    console.log("move validation failure");
    return false;
  }

  // The Update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  
  reset()
  {
    this.drawSet = [];
    this.board = new Board(this.boardSprite, 30, 27.5)
    this.drawSet.push(this.board);
    this.gameState = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    this.gameEnd = 0;
  }

  recreateGameObjects()
  {
    let tempGameState = [...this.gameState];
    this.reset();
    for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
      {
        if(tempGameState[i][j] == 1)
        {
          this.createCross(i, j);
        }
        if(tempGameState[i][j] == 2)
        {
          this.createCircle(i,j);
        }
      }
    }
  }


  update() {
    
  }
}


export default GameManager;
