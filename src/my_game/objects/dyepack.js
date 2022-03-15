"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

const unitPerSec = 120;
const fps = 60;

class DyePack extends engine.GameObject {
  // Init with texture and position
  constructor(texture, x, y) {
    super(null);
    this.mRenderComponent = new engine.SpriteRenderable(texture);
    this.mRenderComponent.getXform().setSize(2, 3.25);
    this.mRenderComponent.getXform().setPosition(x, y);
    this.mRenderComponent.setElementPixelPositions(509, 595, 23, 153);
    this.mRenderComponent.getXform().setRotationInDegree(90);
    let num = this.getRandomInt(1, 3);
    if (num === 1) {
      this.mRenderComponent.setColor([1, 1, 1, 0]);
    } else if (num === 2) {
      this.mRenderComponent.setColor([1, 1, 1, 1]);
    } else {
      this.mRenderComponent.setColor([0, 1, 0, 0.8]);
    }
    this.box = new engine.BoundingBox(
      this.mRenderComponent.getXform().getPosition(),
      2,
      3.25
    );
    this.speed = unitPerSec / fps;
    this.lifeSpan = 5;

    this.ocelX = null;
    this.ocelX1 = null;

    this.oscillate = false;
    this.destroyable = false;

    this.hitEvent = false;
    this.slowDownEvent = false;
  }

  update(mCamera) {
    let xform = this.mRenderComponent.getXform();
    this.checkDestroyable();
    this.checkHitEvent();
    this.checkSlowDownEvent();
    this.getUserInput();
    xform.incXPosBy(this.speed);
  }

  draw(mCamera) {
    this.mRenderComponent.draw(mCamera);
  }

  getUserInput() {
    if (engine.input.isKeyPressed(engine.input.keys.D)) {
      this.speed -= 0.1;
    }

    if (engine.input.isKeyClicked(engine.input.keys.S)) {
      this.hitEvent = true;
    }
  }

  collideCheck(collider) {
    // If intersects a patrol
    if (this.box.intersectsBound(collider)) {
      this.slowDownEvent = true;
    }

    let l = [];
    for (var i = 0; i < collider.size(); i++) {
      if (this.mRenderComponent.pixelTouches(collider.getObjectAt(i), l)) {
        this.hitEvent = true;
        return;
      }
    }
  }

  checkSlowDownEvent() {
    if (this.slowDownEvent) {
      this.speed -= 0.1;
    }
  }

  checkHitEvent() {
    if (this.hitEvent) {
      this.hitEvent = false;
      this.oscillateDyePack();
    }

    if (this.oscillate) {
      if (!this.ocelX.done() && !this.ocelX1.done()) {
        this.mRenderComponent.getXform().incHeightBy(this.ocelX.getNext());
        this.mRenderComponent.getXform().incWidthBy(this.ocelX1.getNext());
      } else {
        this.mRenderComponent.getXform().setSize(2, 3.25);
        this.oscillate = false;
        this.ocelX = null;
        this.ocelX1 = null;
      }
    }
  }

  oscillateDyePack() {
    if (!this.oscillate) {
      this.oscillate = true;
      this.ocelX = new engine.Oscillate(4, 20, 300);
      this.ocelX1 = new engine.Oscillate(0.2, 20, 300);
    }
  }

  checkDestroyable() {
    let xform = this.mRenderComponent.getXform();
    if (this.lifeSpan <= 0) {
      this.destroyable = true;
    }
    this.lifeSpan -= 0.0166;

    if (this.speed <= 0) {
      this.destroyable = true;
    }

    if (
      xform.getXPos() > 100 ||
      xform.getYPos() < -100 ||
      xform.getYPos() > 75 ||
      xform.getYPos() > 75
    ) {
      this.destroyable = true;
    }
  }

  isDestroyable() {
    return this.destroyable;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default DyePack;
