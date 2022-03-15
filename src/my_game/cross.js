"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class Cross extends engine.GameObject
{
  constructor(spriteTexture, xPos, yPos)
  {
    super(null);
    this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
    this.mRenderComponent.setColor([1, 1, 1, 0]);
    this.mRenderComponent.getXform().setPosition(xPos, yPos);
    this.mRenderComponent.getXform().setSize(30, 30);
    this.mRenderComponent.setElementPixelPositions(0, 100, 0, 100);
  }
}


export default Cross;
