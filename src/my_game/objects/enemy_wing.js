"use strict"

import engine from "../../engine/index.js";

class EnemyWing extends engine.GameObject{
    constructor(spriteTexture,  xPos, yPos, group) {
        super(null)
        //pixel positions for animations
        this.p =[
            [817,  613, 409, 205, 1,   1,   205, 409, 613, 817,  613, 409, 205, 1,   1,   205, 409, 613 ],
            [1020, 816, 612, 408, 204, 204, 408, 612, 816, 1020, 816, 612, 408, 204, 204, 408, 612, 816 ],
            [377,  377, 377, 377, 377, 215, 215, 215, 215, 215,  215, 215, 215, 215, 377, 377, 377, 377 ],
            [512,  512, 512, 512, 512, 351, 351, 351, 351, 351,  351, 351, 351, 351, 512, 512, 512, 512 ]];

        this.animationFrame = 0;    

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(xPos, yPos);
        this.mRenderComponent.getXform().setSize(10, 8);
        this.setAnimation(0);
        
        this.interpolate = new engine.LerpVec2(vec2.fromValues(xPos, yPos), 0.05, 120);
        this.interpolate.config(0.05, 120);

        //console.log("wing at " + this.mRenderComponent.getXform().getXPos() + " " + this.mRenderComponent.getXform().getYPos());

        this.setDestination(xPos, yPos)

        this.group = group;
        //'this.interpolate.setFinal(vec2.fromValues(this.destinationX, this.destinationY));
        
    }

    update() {
        this.animationFrame++;
        if(this.animationFrame > 17)
        {
            this.animationFrame = 0;
        }
        this.setAnimation(this.animationFrame);

        this.interpolate.update();
        this.mRenderComponent.getXform().setPosition(this.interpolate.get()[0], this.interpolate.get()[1]);
        //console.log(this.interpolate.get());
        //console.log(this.mRenderComponent.getXform().getPosition());
        //temporary
        
        //2let xform = this.getXform();
        //xform.setPosition(this.destinationX, this.destinationY);
        
    }

    setDestination(destX, destY)
    {
        this.destinationX = destX;
        this.destinationY = destY;
        this.interpolate.setFinal(vec2.fromValues(this.destinationX, this.destinationY));
    }

    setAnimation(frame)
    {
        this.mRenderComponent.setElementPixelPositions(this.p[0][frame], this.p[1][frame], this.p[2][frame], this.p[3][frame]);

    }

    onHit()
    {
        this.mRenderComponent.setColor(this.mRenderComponent.getColor()[3] + 0.2);
        if(this.mRenderComponent.getColor()[3] >= 1)
        {
            this.group.onHit();
        }
    }

    colliderCheck(collider){
        
    }

}

export default EnemyWing;