"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Selector{
    constructor(image) {
        this.loc = vec2.fromValues(55,55);

        this.gridParts = [];
        this.gridTop = new engine.SpriteRenderable(image);
        this.gridLeft = new engine.SpriteRenderable(image);
        this.gridRight = new engine.SpriteRenderable(image);
        this.gridBottom = new engine.SpriteRenderable(image);

        this.gridTop.getXform().setSize(2,10);
        this.gridTop.getXform().setRotationInDegree(90);
        this.gridLeft.getXform().setSize(2,10);
        this.gridRight.getXform().setSize(2,10);
        this.gridBottom.getXform().setSize(2,10);
        this.gridBottom.getXform().setRotationInDegree(90);

        this.gridTop.getXform().setPosition(55,55+5);
        this.gridLeft.getXform().setPosition(55-5,55);
        this.gridRight.getXform().setPosition(55-5,55);
        this.gridBottom.getXform().setPosition(55,55-5);

        this.gridParts.push(this.gridTop);
        this.gridParts.push(this.gridLeft);
        this.gridParts.push(this.gridRight);
        this.gridParts.push(this.gridBottom);
    }

    draw(camera){
        for(var i = 0; i < this.gridParts.length; i++){
            this.gridParts[i].draw(camera);
        }
    }
    
    update(){ 
        
        if(engine.input.isKeyClicked(engine.input.keys.W)){
            this.loc[1] += 10;
        }
        if(engine.input.isKeyClicked(engine.input.keys.S)){
            this.loc[1] -= 10;
        }
        if(engine.input.isKeyClicked(engine.input.keys.D)){
            this.loc[0] += 10;
        }
        if(engine.input.isKeyClicked(engine.input.keys.A)){
            this.loc[0] -= 10;
        }

        this.gridTop.getXform().setPosition(this.loc[0],this.loc[1]+5);
        this.gridLeft.getXform().setPosition(this.loc[0]-5,this.loc[1]);
        this.gridRight.getXform().setPosition(this.loc[0]+5,this.loc[1]);
        this.gridBottom.getXform().setPosition(this.loc[0],this.loc[1]-5);
    }

    getPos(){ 
        return this.loc;
    }
    setPos(x,y){ 
        this.loc[0] = x;
        this.loc[1] = y;
    }

  }
  
  export default Selector;