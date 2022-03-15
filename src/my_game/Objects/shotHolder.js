"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class ShotHolder{
    constructor(image, image2) {
        this.loc = vec2.fromValues(55,55);
        this.hitImage = image;
        this.missImage = image2;
        this.gridParts = [];
    }

    draw(camera){
        for(var i = 0; i < this.gridParts.length; i++){
            this.gridParts[i].draw(camera);
        }
    }
    
    update(){ 

    }

    createHit(x,y){ 
        var Part = new engine.SpriteRenderable(this.hitImage);
        Part.getXform().setPosition(x, y);
        Part.getXform().setSize(9, 9);
        this.gridParts.push(Part);
    }
    createMiss(x,y){ 
        var Part = new engine.SpriteRenderable(this.hitImage);
        this.gridParts.push(Part);
    }

  }
  
  export default ShotHolder;