"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Battleship from "./battleship.js";
import Cruiser from "./cruiser.js";
import Destroyer from "./destroyer.js";
import Carrier from "./aircraft.js";

class Ships {
    constructor(text1, text2, text3, text4) {
        this.Lost = false;
        this.whichPlace = 0;

        this.battleship = new Battleship(text1);
        this.battleshipBool = true;
        this.cruiser = new Cruiser(text3);
        this.cruiserBool = true;
        this.destroyer = new Destroyer(text4);
        this.destroyerBool = true;
        this.carrier = new Carrier(text2);
        this.carrierBool = true;
    }

    draw(camera){
        if(this.battleshipBool)
        this.battleship.draw(camera);
        if(this.cruiserBool)
        this.cruiser.draw(camera);
        if(this.destroyerBool)
        this.destroyer.draw(camera);
        if(this.carrierBool)
        this.carrier.draw(camera);
    }
    
    update(){ 
        this.battleshipBool = this.battleship.checkAlive();
        this.destroyerBool = this.destroyer.checkAlive();
        this.cruiserBool = this.cruiser.checkAlive();
        this.carrierBool = this.carrier.checkAlive();

        if(this.battleshipBool == false && this.cruiserBool == false && this.destroyerBool == false && this.carrierBool == false){
            this.Lost = true;
            //console.log("dead, not big suprise");        
        }
    }

    checkHits(x,y){
        var BBhit = this.battleship.checkHit(x,y);
        var DDhit = this.destroyer.checkHit(x,y);
        var CChit = this.cruiser.checkHit(x,y);
        var CVhit = this.carrier.checkHit(x,y);
        if(BBhit == 1 || DDhit == 1 || CChit == 1 || CVhit == 1){
            return 1;
        }
        else if(BBhit == 2 || DDhit == 2 || CChit == 2 || CVhit == 2){
            return 2;
        }
        return 0;
    }

    createBB(x,y, rot){ 
        this.battleship.move(x,y, rot);
    }
    createDD(x,y, rot){ 
        this.destroyer.move(x,y, rot);
    }
    createCC(x,y, rot){ 
        this.cruiser.move(x,y, rot);
    }
    createCV(x,y, rot){ 
        this.carrier.move(x,y, rot);
    }

    checkDead(){ 
        return this.Lost;
    }

  }
  
  export default Ships;