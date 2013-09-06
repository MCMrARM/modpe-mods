var powerLen = 14;
var powerTime = 50;
var redstoneTick = 20;

var buttonId = 22;
var leverId = 50; // torch, torch, torch. Is there any better solution?
var repeatorId = 35;
var wireId = 73;
var pWireId = 74;

var aButtonId = 16;
var aLeverId = 40;
var aRepeatorId = 15;
var aWireId = 14;

var pistonId = 128;
var sPistonId = 156;
var pistonExtendId = 253;

var pressurePlateId = 78;

/* CODE */

var power = false;
var powerTimeout = 0;
var rsTick = 20;
var powerBlockX, powerBlockY, powerBlockZ;
var pistonBlockX, pistonBlockY, pistonBlockZ;


function clearCTable(x,y,z){
  setTile(x-3, y+1, z-2, 0);
  setTile(x-2, y+1, z-2, 0);
  setTile(x-1, y+1, z-2, 0);
  
  setTile(x-3, y+1, z-1, 0);
  setTile(x-2, y+1, z-1, 0);
  setTile(x-1, y+1, z-1, 0);
      
  setTile(x-3, y+1, z, 0);
  setTile(x-2, y+1, z, 0);
  setTile(x-1, y+1, z, 0);
}

function useItem(x,y,z,itemId,blockId,side)
{
  if(blockId == aButtonId || blockId == aLeverId || itemId == aWireId){
    // Use alternative scheme. Okay.
    buttonId = aButtonId;
    leverId = aLeverId;
    repeatorId = aRepeatorId;
    wireId = aWireId;
  }
  
  if(blockId == 58 && itemId == wireId){
    if(getTile(x, y, z-1) == 48 &&
       
       getTile(x-1, y, z) == 48 &&
       getTile(x-2, y, z) == 48 &&
       getTile(x-3, y, z) == 48 &&
       
       getTile(x-1, y, z-1) == 48 &&
       getTile(x-2, y, z-1) == 48 &&
       getTile(x-3, y, z-1) == 48 &&
      
             
       getTile(x-1, y, z-2) == 48 &&
       getTile(x-2, y, z-2) == 48 &&
       getTile(x-3, y, z-2) == 48){
      
      // craft!
      
      var c1x1 = getTile(x-3, y+1, z-2);
      var c2x1 = getTile(x-2, y+1, z-2);
      var c3x1 = getTile(x-1, y+1, z-2);
      
      var c1x2 = getTile(x-3, y+1, z-1);
      var c2x2 = getTile(x-2, y+1, z-1);
      var c3x2 = getTile(x-1, y+1, z-1);
      
      var c1x3 = getTile(x-3, y+1, z);
      var c2x3 = getTile(x-2, y+1, z);
      var c3x3 = getTile(x-1, y+1, z);
      
      // Craft button:
      // free - free - free
      // free - stone - free
      // free - free - free
      
      if(c1x1 == 0 && c2x1 == 0 && c3x1 == 0 &&
         c1x2 == 0 && c2x2 == 1 && c3x2 == 0 &&
         c1x3 == 0 && c2x3 == 0 && c3x3 == 0){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, buttonId);
      }
      
      // Craft lever:
      // free - free - free
      // free - plank - free
      // free - stone - free
      
      if(c1x1 == 0 && c2x1 == 0 && c3x1 == 0 &&
         c1x2 == 0 && c2x2 == 5 && c3x2 == 0 &&
         c1x3 == 0 && c2x3 == 1 && c3x3 == 0){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, leverId);
      }
      
      // Craft repeator:
      // free - free - free
      // lever - wire - lever
      // stone - stone - stone
      
      if(c1x1 == 0 && c2x1 == 0 && c3x1 == 0 &&
         c1x2 == leverId && c2x2 == wireId && c3x2 == leverId &&
         c1x3 == 1 && c2x3 == 1 && c3x3 == 1){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, repeatorId);
      }
      
      // Craft piston:
      // plank - plank - plank
      // cobble - iron - cobble
      // cobble - wire - cobble
      
      
      if(c1x1 == 5 && c2x1 == 5 && c3x1 == 5 &&
         c1x2 == 4 && c2x2 == 42 && c3x2 == 4 &&
         c1x3 == 4 && c2x3 == wireId && c3x3 == 4){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, pistonId);
      }
      
      // Craft sticky piston:
      // free - free   - free
      // free - leaves - free
      // free - piston - free
      
      
      if(c1x1 == 0 && c2x1 == 0        && c3x1 == 0 &&
         c1x2 == 0 && c2x2 == 18       && c3x2 == 0 &&
         c1x3 == 0 && c2x3 == pistonId && c3x3 == 0){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, pistonId);
      }
      
      preventDefault();
    }else{
      // make a 3x3 square for redstone crafting
      // and yes, it doesn't support other items crafting, sorry
      // and yes, I'm going to create a mod for it
      setTile(x, y-1, z, 48);
      setTile(x-1, y-1, z, 48);
      setTile(x+1, y-1, z, 48);
      
      setTile(x, y-1, z-1, 48);
      setTile(x-1, y-1, z-1, 48);
      setTile(x+1, y-1, z-1, 48);
      
      setTile(x, y-1, z+1, 48);
      setTile(x-1, y-1, z+1, 48);
      setTile(x+1, y-1, z+1, 48);
      
      
      setTile(x+2, y-1, z, 48);
      setTile(x+2, y-1, z+1, 58);
      
      setTile(x, y, z, 0);
      
      preventDefault();
    }
  }else if(blockId == buttonId){
    if(buttonId==255?(getTile(x,y-1,z)!=48):true){
      powerBlockX = x;
      powerBlockY = y;
      powerBlockZ = z
      ewtX = new Array();
      ewtY = new Array();
      ewtZ = new Array();
      
      powerTimeout = powerTime;
      rsTick = 1;
      power = true;
      preventDefault();
    }
  }else if(blockId == leverId){
   powerBlockX = x;
    powerBlockY = y;
    powerBlockZ = z
    ewtX = new Array();
    ewtY = new Array();
    ewtZ = new Array();
    
    powerTimeout = powerTimeout==-11?0:-11;
    rsTick = 1;
    power = true;
    preventDefault();
  }else if((blockId == 73 || blockId == 74) && (itemId == 257 || itemId == 285 || itemId == 278)){
    // if it is redstone ore
    // drop 4-5 redstone
    var howMuch = 4+parseInt(Math.random());
    addItemInventory(wireId, howMuch);
    setTile(x,y,z,0);
    preventDefault();
  }
}
function attackHook(attacker, victim)
{
//Your Code Here
}

var wereThereX, wereThereY, wereThereZ;
var ewtX, ewtY, ewtZ; // earlier turn were there
var nextTurn = false;
var nextEnable = false;
var nextTurnX, nextTurnY, nextTurnZ, nextTurnLen;

function prepare(){
 wereThereX = new Array();
 wereThereY = new Array();
 wereThereZ = new Array();
 nextTurnX = new Array();
 nextTurnY = new Array();
 nextTurnZ = new Array();
 nextTurnLen = new Array();
}
function canGo(x,y,z,mode){
  // MODE 0 - Redstone
  // MODE 1 - Repeator
  // MODE 2 - TNT
  // MODE 3 - Piston
  // MODE 4 - Door
  if(mode==0?(getTile(x,y,z) == wireId || getTile(x,y,z) == pWireId):
    (mode==1?(getTile(x,y,z) == repeatorId):
    (mode==2?(getTile(x,y,z) == 46):
    (mode==3?(getTile(x,y,z) == pistonId || getTile(x,y,z) == sPistonId):
    (mode==4?(getTile(x,y,z) == 64):false))))){
    for(var i=0;i<wereThereX.length;i++){
      if(wereThereX[i] == x && wereThereY[i] == y && wereThereZ[i] == z){
        // We were there
        return false;
      }
    }
    
    for(var i=0;i<ewtX.length;i++){
      if(ewtX[i] == x && ewtY[i] == y && ewtZ[i] == z){
        ewtX.splice(i,1);
        ewtY.splice(i,1);
        ewtZ.splice(i,1);
      }
    }
    return true;
  }else{
    return false;
  }
}

function goPowerA(enable,x,y,z,len,dir){
  if(canGo(x,y,z,0)){
    // Redstone
    if(enable?(getTile(x,y,z)!=pWireId):(getTile(x,y,z)!=wireId)) setTile(x,y,z,enable?pWireId:wireId);
    wereThereX.push(x);
    wereThereY.push(y);
    wereThereZ.push(z);
    
    nextTurn = true;
    nextEnable = enable;
    nextTurnX.push(x);
    nextTurnY.push(y);
    nextTurnZ.push(z);
    nextTurnLen.push(len+1);
    //goPower(enable,x,y,z,len+1);
  }else if(canGo(x,y,z,1)){
    // Repeator
    wereThereX.push(x);
    wereThereY.push(y);
    wereThereZ.push(z);
    
    nextTurn = true;
    nextEnable = enable;
    nextTurnX.push(x);
    nextTurnY.push(y);
    nextTurnZ.push(z);
    nextTurnLen.push(0);
    //goPower(enable,x,y,z,0);
  }else if(canGo(x,y,z,2)){
    // TNT
    explode(x,y,z,1);
  }else if(canGo(x,y,z,3)){
    // YAY! Piston!
    if(enable){
      if(dir == 0){
        pistonB(x,y,z,-1,0,0);
      }else if(dir == 1){
        pistonA(x,y,z,1,0,0,255);
      }else if(dir == 2){
        pistonB(x,y,z,0,0,-1);
      }else if(dir == 3){
        pistonA(x,y,z,0,0,1,255);
      }else if(dir == 4){
        pistonB(x,y,z,0,-1,0,255);
      }else if(dir == 5){
        pistonA(x,y,z,0,1,0,128);
      }/*else if(dir == 4){
pistonDown(x,y,z);
}*/
    }else{
      var sticky = (getTile(x,y,z) == sPistonId);
      
      if(dir == 0){
        setTile(x-1,y,z,sticky?getTile(x-2,y,z):0);
        if(sticky)setTile(x-2,y,z,0);
      }else if(dir == 1){
        setTile(x+1,y,z,sticky?getTile(x+2,y,z):0);
        if(sticky)setTile(x+2,y,z,0);
      }else if(dir == 2){
        setTile(x,y,z-1,sticky?getTile(x,y,z-2):0);
        if(sticky)setTile(x,y,z-2,0);
      }else if(dir == 3){
        setTile(x,y,z+1,sticky?getTile(x,y,z+2):0);
        if(sticky)setTile(x,y,z+2,0);
      }else if(dir == 4){
        setTile(x,y-1,z,sticky?getTile(x,y-2,z):0);
        if(sticky)setTile(x,y-2,z,0);
      }else if(dir == 5){
        setTile(x,y+1,z,sticky?getTile(x,y+2,z):0);
        if(sticky)setTile(x,y+2,z,0);
      }
    }
  }else if(canGo(x,y,z,4)){
    // Door!
    if(getTile(x-1,y,z) == 0) { door(x-1,y,z); }
    else if(getTile(x+1,y,z) == 0) { door(x+1,y,z); }
    else if(getTile(x,y,z-1) == 0) { door(x,y,z-1); }
    else if(getTile(x,y,z+1) == 0) { door(x,y,z+1); }
  }
}

function pistonA(x, y, z, dirX, dirY, dirZ, hm){
  if(getTile(x+dirX,y+dirY,z+dirZ) != pistonExtendId){
    if(getTile(x+dirX,y+dirY,z+dirZ) != 0){
      var oY = dirX==1?x:(dirY==1?y:z); // begin point
      var gtY = oY; // go-to-point
      for(var i=oY;i<hm;i++){
        var theTile = getTile((dirX==1?i:x),(dirY==1?i:y),(dirZ==1?i:z));
        if(theTile == 0 || theTile == 8 || theTile == 9 || theTile == 10 || theTile == 11) {
          gtY = i;
          break;
       }
      }
      
      for(var i=gtY-1;i>oY;i--)
      {
        setTile((dirX==1?i+1:x),(dirY==1?i+1:y),(dirZ==1?i+1:z), getTile((dirX==1?i:x),(dirY==1?i:y),(dirZ==1?i:z)));
      }
    }
    setTile(x+dirX,y+dirY,z+dirZ,pistonExtendId);
  }
}

function pistonB(x, y, z, dirX, dirY, dirZ){
  if(getTile(x+dirX,y+dirY,z+dirZ) != pistonExtendId){
    if(getTile(x+dirX,y+dirY,z+dirZ) != 0){
      var oY = dirX==-1?x:(dirY==-1?y:z); // begin point
      var gtY = oY; // go-to-point
      for(var i=oY;i>0;i--){
        var theTile = getTile((dirX==-1?i:x),(dirY==-1?i:y),(dirZ==-1?i:z));
        if(theTile == 0 || theTile == 8 || theTile == 9 || theTile == 10 || theTile == 11) {
          gtY = i;
          break;
       }
      }
      
      for(var i=gtY+1;i<oY;i++)
      {
        setTile((dirX==-1?i-1:x),(dirY==-1?i-1:y),(dirZ==-1?i-1:z), getTile((dirX==-1?i:x),(dirY==-1?i:y),(dirZ==-1?i:z)));
      }
    }
    setTile(x+dirX,y+dirY,z+dirZ,pistonExtendId);
  }
}

function door(x, y, z){
 setTile(x,y,z,0);
 setTile(x,y,z,1);
 setTile(x,y,z,0);
}
function goPower(enable,x,y,z,len){
  if(len>powerLen) return;
  goPowerA(enable, x-1, y, z, len, 0);
  goPowerA(enable, x+1, y, z, len, 1);
  goPowerA(enable, x, y, z-1, len, 2);
  goPowerA(enable, x, y, z+1, len, 3);
  goPowerA(enable, x, y-1, z, len, 4);
  goPowerA(enable, x, y+1, z, len, 5);
}

var wereOnPressurePlate = false;
function modTick()
{
  if(nextTurn){
    nextTurn = false;

    var tntX = nextTurnX; // tnt - tmpNextTurn
    var tntY = nextTurnY;
    var tntZ = nextTurnZ;
    var tntLen = nextTurnLen;
    nextTurnX = new Array();
    nextTurnY = new Array();
    nextTurnZ = new Array();
    nextTurnLen = new Array();
    
    for(var i=0;i<tntX.length;i++){
      goPower(nextEnable, tntX[i], tntY[i], tntZ[i], tntLen[i]);
    }
    
    if(nextTurn == false){
      for(var i=0;i<ewtX.length;i++){
        if(getTile(ewtX[i], ewtY[i], ewtZ[i]) == pWireId)
           setTile(ewtX[i], ewtY[i], ewtZ[i], wireId);
      }
      
      ewtX = wereThereX;
      ewtY = wereThereY;
      ewtZ = wereThereZ;
    }
  }else{
    if(wereOnPressurePlate){
      if(getTile(getPlayerX(), getPlayerY()-1.6, getPlayerZ()) == pressurePlateId){
        rsTick--;
        if(rsTick <= 0){
          prepare();
          goPower(true, powerBlockX, powerBlockY, powerBlockZ, 0);
          rsTick = redstoneTick;
        }
      }else{
        prepare();
        goPower(false, powerBlockX, powerBlockY, powerBlockZ, 0);
        wereOnPressurePlate = false;
      }
    }else if(power){
      if(powerTimeout != -11) powerTimeout--;
      if(powerTimeout > 0 || powerTimeout == -11){
        if(getTile(powerBlockX, powerBlockY, powerBlockZ) != buttonId &&
           getTile(powerBlockX, powerBlockY, powerBlockZ) != leverId){
          prepare();
          goPower(false, powerBlockX, powerBlockY, powerBlockZ, 0);
          power = false;
        }else{
          rsTick--;
          if(rsTick <= 0){
            prepare();
            goPower(true, powerBlockX, powerBlockY, powerBlockZ, 0);
            rsTick = redstoneTick;
          }
        }
      }else{
        prepare();
        goPower(false, powerBlockX, powerBlockY, powerBlockZ, 0);
        power = false;
      }
    }else{
      // Pressure Plates
      if(getTile(getPlayerX(), getPlayerY()-1.6, getPlayerZ()) == pressurePlateId){
       powerBlockX = getPlayerX();
       powerBlockY = getPlayerY()-1.6;
       powerBlockZ = getPlayerZ();
       ewtX = new Array();
       ewtY = new Array();
       ewtZ = new Array();
    
       wereOnPressurePlate = true;
       rsTick = 1;
      }
    }
  }
}
