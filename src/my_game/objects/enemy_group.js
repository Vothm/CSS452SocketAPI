"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import EnemyHead from "./enemy_head.js";
import EnemyWing from "./enemy_wing.js";

class EnemyGroup extends engine.GameObjectSet{
    constructor(spriteTexture, xPos, yPos) {
        super(null);
        this.head = new EnemyHead(spriteTexture, xPos, yPos, this);
        this.topWing = new EnemyWing(spriteTexture, xPos + 10, yPos + 6, this);
        this.bottomWing = new EnemyWing(spriteTexture, xPos + 10, yPos - 6, this);
        this.destroy = false;

        this.addToSet(this.head);
        this.addToSet(this.topWing);
        this.addToSet(this.bottomWing);

        this.bBox = this.mSet[0].getBBox();

        this.minX = this.bBox.minX();
        this.maxX = this.bBox.maxX();
        this.minY = this.bBox.minY();
        this.maxY = this.bBox.maxY();

        for(var i = 0; i < this.size(); i++){
            this.bBox = this.mSet[i].getBBox();
            if(this.minX > this.bBox.minX()){
                this.minX = this.bBox.minX();
            }
            if(this.maxX < this.bBox.maxX()){
                this.maxX = this.bBox.maxX();
            }
            if(this.minY > this.bBox.minY()){
                this.minY = this.bBox.minY();
            }
            if(this.maxY < this.bBox.maxY()){
                this.maxY = this.bBox.maxY();
            }
        }

        
        this.box = new engine.BoundingBox(vec2.fromValues((this.minX+this.maxX)/2, (this.minY+this.maxY)/2), this.maxX-this.minX, this.maxY-this.minY);
    }
        

    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.

    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.bBox = this.mSet[0].getBBox();

        this.minX = this.bBox.minX();
        this.maxX = this.bBox.maxX();
        this.minY = this.bBox.minY();
        this.maxY = this.bBox.maxY();

        let i;
        for(i = 0; i < this.size(); i++){
            this.bBox = this.mSet[i].getBBox();
            if(this.minX > this.bBox.minX()){
                this.minX = this.bBox.minX();
            }
            if(this.maxX < this.bBox.maxX()){
                this.maxX = this.bBox.maxX();
            }
            if(this.minY > this.bBox.minY()){
                this.minY = this.bBox.minY();
            }
            if(this.maxY < this.bBox.maxY()){
                this.maxY = this.bBox.maxY();
            }
        }

        this.box = new engine.BoundingBox(vec2.fromValues((this.minX+this.maxX)/2, (this.minY+this.maxY)/2), this.maxX-this.minX, (this.maxY-this.minY)*1.5);

        //console.log(this.size());

        let xform = this.head.getXform();
        this.topWing.setDestination(xform.getXPos() + 10, xform.getYPos() + 6);
        this.bottomWing.setDestination(xform.getXPos() + 10, xform.getYPos() - 6);

        //let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update();
        }
        
        if(this.maxX > 100){
            this.terminate();
        }

        if(this.minY + (this.maxY-this.minY)*1.5 > 75 || this.minY < -75){
            //console.log(this.minY + (this.maxY-this.minY)*1.5, this.minY);
            this.head.horizonalWallCollision();
        }

    }

    terminate()
    {
        this.destroy = true;
    }
    checkDestroy(){
        return this.destroy;
    }
    
    colliderParser(collider1){
        this.head.colliderCheck(collider1);
    }

    getHead(){
        return this.head;
    }

}

export default EnemyGroup;