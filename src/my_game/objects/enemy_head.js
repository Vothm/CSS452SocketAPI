"use strict";

import engine from "../../engine/index.js";

class EnemyHead extends engine.GameObject {
  constructor(spriteTexture, xPos, yPos, group) {
    super(null);
    //this.interpolate = new engine.LerpVec2(this.mRenderComponent().getPosition(),0.05,120);

    this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
    this.mRenderComponent.setColor([1, 1, 1, 0]);
    this.mRenderComponent.getXform().setPosition(xPos, yPos);
    this.mRenderComponent.getXform().setSize(7.5, 7.5);
    this.mRenderComponent.setElementPixelPositions(154, 287, 0, 180);

    this.interpolate = new engine.LerpVec2(vec2.fromValues(0, 0), 0.05, 120);
    this.interpolate.config(0.05, 120);

    this.group = group;
    this.setSpeed((Math.random() * (10 - 5) + 5) / 60); //randomly generated speed on creation

    this.setRotation(Math.random() * 160 + 90);
    //this.setRotation(90);
    this.rotVal = 0;

    this.box = this.getBBox();

    this.uninteractiveTimer = 0;
  }

  update() {
    super.update();
    if (this.uninteractiveTimer >= 0) {
      this.uninteractiveTimer--;
    }
    this.box = this.getBBox();
    //console.log(this.getCurrentFrontDir()[0], this.getCurrentFrontDir()[1]);
  }

  setRotation(angle) {
    let y = Math.sin(this.toRadians(angle));
    let x = Math.cos(this.toRadians(angle));
    this.setCurrentFrontDir(vec2.fromValues(x, y));
  }

  horizonalWallCollision() {
    if (this.uninteractiveTimer <= 0) {
      //console.log(this.getCurrentFrontDir()[0] +" " + -this.getCurrentFrontDir()[1]);
      this.setCurrentFrontDir(
        vec2.fromValues(
          this.getCurrentFrontDir()[0],
          -this.getCurrentFrontDir()[1]
        )
      );
      this.uninteractiveTimer = 60;
    }
  }
  verticalWallCollision() {
    this.setCurrentFrontDir(
      vec2.fromValues(
        -this.getCurrentFrontDir()[0],
        this.getCurrentFrontDir()[1]
      )
    );
  }

  onHit() {
    this.mRenderComponent.getXform().incXPosBy(5);
  }

  colliderCheck(collider) {
    let h = [];

    for (let i = 0; i < collider.getSetSize(); i++) {
      if (this.pixelTouches(collider.getObject(i), h)) {
        this.onHit();
          collider.getObject(i).slowDownEvent = true;
          collider.getObject(i).hitEvent = true;
        // console.log("hit");
      }
    }
    // if (this.box.intersectsBound(collider.getBounds())) {
    //   //console.log("collide");
    // }
  }

  toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}

export default EnemyHead;
