var powerLen = 14;
var powerTime = 50;
var redstoneTick = 20;

var extraData = 9;
var extraDataWire = 10;
var pWireId = 246;

var sButtonId = 255;
var sLeverId = 85;
var sRepeatorId = 89;
var sWireId = 255;

var cButtonId = 16;
var cLeverId = 56;
var cRepeatorId = 41;
var cWireId = 42;

var pistonId = 128;
var sPistonId = 156;
var pistonExtendId = 253;

var pressurePlateId = 44;

/* CODE */

var creative = false;
var power = false;
var powerTimeout = 0;
var rsTick = 20;
var powerBlockX, powerBlockY, powerBlockZ;
var pistonBlockX, pistonBlockY, pistonBlockZ;
var buttonId = sButtonId;
var leverId = sLeverId;
var repeatorId = sRepeatorId;
var wireId = sWireId;

ModPE.setItem(55, 3, 8, "Redstone");
ModPE.setItem(356, 5, 6, "Redstone Repeator");
ModPE.setItem(77, 15, 7, "Button");
ModPE.setItem(69, 9, 7, "Lever");

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

function newLevel(){
 var gamemode = Level.getGameMode();
 if(gamemode == 0){
  buttonId = sButtonId;
  leverId = sLeverId;
  repeatorId = sRepeatorId;
  wireId = sWireId;
  creative = false;
 }else if(gamemode == 1){
  buttonId = cButtonId;
  leverId = cLeverId;
  repeatorId = cRepeatorId;
  wireId = cWireId;
  creative = true;
 }
}

function destroyBlock(x,y,z,side){
 var block = getTile(x,y,z);
 var item = getCarriedItem();
 if((Level.getData(x,y,z) == extraDataWire && block == wireId) || (Level.getData(x,y,z) == extraData && block == pWireId)){
  preventDefault();
  Level.destroyBlock(x,y,z,false);
  if(!creative) Level.dropItem(x,y,z,1,55,1,0);
 }else if(Level.getData(x,y,z) == extraData){
  if(block == 98){
   preventDefault();
   Level.destroyBlock(x,y,z,false);
  }else if(block == repeatorId){
   preventDefault();
   Level.destroyBlock(x,y,z,false);
   if(!creative) Level.dropItem(x,y,z,1,356,1,0);
  }else if(block == buttonId){
   preventDefault();
   Level.destroyBlock(x,y,z,false);
   if(!creative) Level.dropItem(x,y,z,1,77,1,0);
  }else if(block == leverId){
   preventDefault();
   Level.destroyBlock(x,y,z,false);
   if(!creative) Level.dropItem(x,y,z,1,69,1,0);
  }
 }else if((block == 73 || block == 74) && (item == 257 || item == 285 || item == 278)){
   // if it is redstone ore
   // drop 4-5 redstone
   var howMuch = 4+parseInt(Math.random());
   preventDefault();
   Level.destroyBlock(x,y,z,false);
   if(!creative) Level.dropItem(x,y,z,1,55,howMuch,0);
  }
}

function useItem(x,y,z,itemId,blockId,side)
{
  if(blockId == 58 && itemId == 55 && !creative){
    if(getTile(x, y, z-1) == 98 && Level.getData(x, y, z-1) == extraData &&
       
       getTile(x-1, y, z) == 98 && Level.getData(x-1, y, z) == extraData &&
       getTile(x-2, y, z) == 98 && Level.getData(x-2, y, z) == extraData &&
       getTile(x-3, y, z) == 98 && Level.getData(x-3, y, z) == extraData &&
       
       getTile(x-1, y, z-1) == 98 && Level.getData(x-1, y, z-1) == extraData &&
       getTile(x-2, y, z-1) == 98 && Level.getData(x-2, y, z-1) == extraData &&
       getTile(x-3, y, z-1) == 98 && Level.getData(x-3, y, z-1) == extraData &&
      
             
       getTile(x-1, y, z-2) == 98 && Level.getData(x-1, y, z-2) == extraData &&
       getTile(x-2, y, z-2) == 98 && Level.getData(x-2, y, z-2) == extraData &&
       getTile(x-3, y, z-2) == 98 && Level.getData(x-3, y, z-2) == extraData){
      
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
        setTile(x, y+1, z-1, buttonId, extraData);
      }
      
      // Craft lever:
      // free - free - free
      // free - plank - free
      // free - stone - free
      
      if(c1x1 == 0 && c2x1 == 0 && c3x1 == 0 &&
         c1x2 == 0 && c2x2 == 5 && c3x2 == 0 &&
         c1x3 == 0 && c2x3 == 1 && c3x3 == 0){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, leverId, extraData);
      }
      
      // Craft repeator:
      // free - free - free
      // lever - wire - lever
      // stone - stone - stone
      
      if(c1x1 == 0 && c2x1 == 0 && c3x1 == 0 &&
         c1x2 == leverId && c2x2 == wireId && Level.getData(x-2, y+1, z-1) == extraDataWire && c3x2 == leverId &&
         c1x3 == 1 && c2x3 == 1 && c3x3 == 1){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, repeatorId, extraData);
      }
      
      // Craft piston:
      // plank - plank - plank
      // cobble - iron - cobble
      // cobble - wire - cobble
      
      
      if(c1x1 == 5 && c2x1 == 5 && c3x1 == 5 &&
         c1x2 == 4 && c2x2 == 42 && c3x2 == 4 &&
         c1x3 == 4 && (c2x3 == wireId && Level.getData(x-2, y+1, z) == extraDataWire) && c3x3 == 4){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, pistonId, extraData);
      }
      
      // Craft sticky piston:
      // free - free   - free
      // free - leaves - free
      // free - piston - free
      
      
      if(c1x1 == 0 && c2x1 == 0        && c3x1 == 0 &&
         c1x2 == 0 && c2x2 == 18       && c3x2 == 0 &&
         c1x3 == 0 && c2x3 == pistonId && c3x3 == 0){
        clearCTable(x,y,z);
        setTile(x, y+1, z-1, sPistonId, extraData);
      }
      
      preventDefault();
    }else{
      // make a 3x3 square for redstone crafting
      setTile(x, y-1, z, 98, extraData);
      setTile(x-1, y-1, z, 98, extraData);
      setTile(x+1, y-1, z, 98, extraData);
      
      setTile(x, y-1, z-1, 98, extraData);
      setTile(x-1, y-1, z-1, 98, extraData);
      setTile(x+1, y-1, z-1, 98, extraData);
      
      setTile(x, y-1, z+1, 98, extraData);
      setTile(x-1, y-1, z+1, 98, extraData);
      setTile(x+1, y-1, z+1, 98, extraData);
      
      
      setTile(x+2, y-1, z, 98, extraData);
      setTile(x+2, y-1, z+1, 58);
      
      setTile(x, y, z, 0);
      
      preventDefault();
    }
  }else if(blockId == buttonId && (!creative?(Level.getData(x,y,z) == extraData):true)){
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
  }else if(blockId == leverId && (!creative?(Level.getData(x,y,z) == extraData):true)){
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
  }else if(itemId == 55){
    setBlockWithSide(x,y,z,side,wireId,extraDataWire);
    addItemInventory(55, -1);
  }else if(itemId == 356){
    setBlockWithSide(x,y,z,side,repeatorId,extraData);
    addItemInventory(356, -1);
  }else if(itemId == 77){
    setBlockWithSide(x,y,z,side,buttonId,extraData);
    addItemInventory(77, -1);
  }else if(itemId == 69){
    setBlockWithSide(x,y,z,side,leverId,extraData);
    addItemInventory(69, -1);
  }
}

function setBlockWithSide(x,y,z,side,id,data){
 setTile(x-(side==4?1:0)+(side==5?1:0),y-(side==0?1:0)+(side==1?1:0),z-(side==2?1:0)+(side==3?1:0),id,data);
 
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
  if(mode==0?((getTile(x,y,z) == wireId && (!creative?(Level.getData(x,y,z) == extraDataWire):true)) || (getTile(x,y,z) == pWireId && (!creative?(Level.getData(x,y,z) == extraData):true))):
    (mode==1?(getTile(x,y,z) == repeatorId):
    (mode==2?(getTile(x,y,z) == 46):
    (mode==3?(getTile(x,y,z) == pistonId || getTile(x,y,z) == sPistonId):
    (mode==4?(getTile(x,y,z) == 64 || getTile(x,y,z) == 71 || getTile(x,y,z) == 96):false))))){
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
    if(enable?(getTile(x,y,z)!=pWireId):(getTile(x,y,z)!=wireId)) setTile(x,y,z,enable?pWireId:wireId,enable?extraData:extraDataWire);
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
    door(x,y,z,enable);
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

function door(x, y, z, enable){
 var open = Level.getData(x,y,z);
 if(open>=4){open=open-4;}
 setTile(x,y,z,getTile(x,y,z),enable?open+4:open);
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
