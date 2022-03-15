"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Cruiser {
    constructor(texture) {

        this.mRenderComponent = new engine.SpriteRenderable(texture);
        this.mRenderComponent.getXform().setSize(30, 10);
        this.mRenderComponent.getXform().setPosition(-20, -20);

        this.locations = [];
        this.health = [];
    }

    draw(camera){
        this.mRenderComponent.draw(camera);
    }
    
    update(){ 
    }

    move(x,y,rot){ 
        this.mRenderComponent.getXform().setPosition(x, y);
        if(rot == true){
            this.mRenderComponent.getXform().setRotationInDegree(90);
            this.mRenderComponent.getXform().setPosition(x-15, y-10);
            for(var i = 0; i < 3; i++) {
                this.locations.push(vec2.fromValues(x-15, y - (10*i)));
                this.health.push(true);
            }
        }
        else{
            this.mRenderComponent.getXform().setRotationInDegree(0);
            this.mRenderComponent.getXform().setPosition(x-5, y);
            for(var i = 0; i < 3; i++) {
                this.locations.push(vec2.fromValues(x+15 - (10*i), y));
                this.health.push(true);
            }
        }
        
        console.log(this.locations);
    }
    
    checkHit(x,y){
        var hit = 0;
        for(var i = 0; i < this.locations.length; i++) {
            if(this.locations[i][0] == x && this.locations[i][1] == y){
                if(this.health[i] == false){
                    hit = 2;
                }
                else{
                    this.health[i] = false;
                    hit = 1
                }
            }
        }
        return hit;
    }

    checkAlive(){ 
        var alive = false;
        for(var i = 0; i < this.health.length; i++) {
            if(this.health[i] == true){
                alive = true;
            }
        }
        return alive
    }

  }
  
  export default Cruiser;