"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Grid{
    constructor(image, owned) {

        this.gridParts = [];
        for(var i = 0; i < 10; i++){
            this.gridPart = new engine.SpriteRenderable(image);
            if(owned){
                this.gridPart.getXform().setPosition(i*10,i*10);
            }
            else{
                this.gridPart.getXform().setPosition(200 + i*10,i*10);
            }
            this.gridPart.getXform().setRotationInDegree(90);
            this.gridPart.getXform().setSize(1,200);
            this.gridParts.push(this.gridPart);

            this.gridPart = new engine.SpriteRenderable(image);
            if(owned){
                this.gridPart.getXform().setPosition(i*10,i*10);
            }
            else{
                this.gridPart.getXform().setPosition(200 + i*10,i*10);
            }
            this.gridPart.getXform().setSize(1,200);
            this.gridParts.push(this.gridPart);
        }
        
        

        this.Board = new Array(10);
        for(var i = 0; i < this.Board.length; i++) {
          this.Board[i] = new Array(10);
        }
        for(var i = 0; i < this.Board.length; i++) {
            for(var j = 0; j < this.Board[i].length; j++) {
                this.Board[i][j] = 0;
            }
        }

        this.destroyed = false;
        this.shipLoc = new Array(13);
        this.shipCounter = 0;
        this.dataTransfer = {
            x: 0,
            y: 0,
            hit: false
        };
        for(var i = 0; i < this.shipLoc.length; i++) {
            this.shipLoc[i] = this.dataTransfer;
        }

    }

    draw(camera){
        for(var i = 0; i < this.gridParts.length; i++){
            this.gridParts[i].draw(camera);
        }
    }
    
    update(){ 

    }

    passInShip(x, y){
        this.Board[x][y] = 3;
        this.shipLoc[this.shipCounter].x = x;
        this.shipLoc[this.shipCounter].y = y;
        this.shipCounter++;
    }

    passInHit(x, y){
        if(this.Board[x][y] == 3){
            this.Board[x][y] = 1;
        }
        else{
            this.Board[x][y] = 2;
        }
    }

    passInShot(x,y, type){
        if(type == true){
            this.Board[x][y] = 1;
        }
        else{
            this.Board[x][y] = 2;
        }
    }

    checkWinner(){
        return destroyed;
    }

  }
  
  export default Grid;