var powerLen = 10;
var powerTime = 50;
var redstoneTick = 20;
var powererId = 22;
var repeatorId = 41;
var wireId = 42;
var pWireId = 246;

var pistonId = 128;
var pistonExtendId = 253;

/* CODE */

var power = false;
var powerTimeout = 0;
var rsTick = 20;
var powerBlockX, powerBlockY, powerBlockZ;
var pistonBlockX, pistonBlockY, pistonBlockZ;

function useItem(x,y,z,itemId,blockId,side)
{
  // Lapis Lazuli - Powerer - 22
  // Cable unpowered - Iron Block - 42
  // Cable powered - Glowing Obdisan - 246
  // Repeator - Gold Block - 41
  
  if(blockId == powererId){
  	powerBlockX = x;
    powerBlockY = y;
    powerBlockZ = z;
    powerTimeout = powerTime;
    rsTick = 1;
    power = true;
    preventDefault();
  }
}
function attackHook(attacker, victim)
{
	//Your Code Here
}

var wereThereX, wereThereY, wereThereZ;
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
    (mode==3?(getTile(x,y,z) == pistonId):
    (mode==4?(getTile(x,y,z) == 64):false))))){
    for(var i=0;i<wereThereX.length;i++){
      if(wereThereX[i] == x && wereThereY[i] == y && wereThereZ[i] == z){
        // We were there
        return false;
      }
    }
    return true;
  }else{
    return false;
  }
}

function goPowerA(enable,x,y,z,len){
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
    nextTurnLen.push(len);
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
    nextTurnLen.push(len);
    //goPower(enable,x,y,z,0);
  }else if(canGo(x,y,z,2)){
    // TNT
    explode(x,y,z,1);
  }else if(canGo(x,y,z,3)){
    // YAY! Piston!
    if(enable){
      if(getTile(x,y+1,z) != pistonExtendId && getTile(x,y+1,z) != 0) setTile(x,y+2,z,getTile(x,y+1,z));
      setTile(x,y+1,z,pistonExtendId);
    }else{
      setTile(x,y+1,z,0);
    }
  }else if(canGo(x,y,z,4)){
    // Door!
    if(getTile(x-1,y,z) == 0) { door(x-1,y,z); }
    else if(getTile(x+1,y,z) == 0) { door(x+1,y,z); }
    else if(getTile(x,y,z-1) == 0) { door(x,y,z-1); }
    else if(getTile(x,y,z+1) == 0) { door(x,y,z+1); }
  }
}
function door(x, y, z){
 setTile(x,y,z,0);
 setTile(x,y,z,1);
 setTile(x,y,z,0);
}
function goPower(enable,x,y,z,len){
  if(len>powerLen) return;
  goPowerA(enable, x-1, y, z, len);
  goPowerA(enable, x+1, y, z, len);
  goPowerA(enable, x, y, z-1, len);
  goPowerA(enable, x, y, z+1, len);
  goPowerA(enable, x, y-1, z, len);
  goPowerA(enable, x, y+1, z, len);
}
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
  }else{
    if(power){
      powerTimeout--;
      if(powerTimeout > 0){
        if(getTile(powerBlockX, powerBlockY, powerBlockZ) != powererId){
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
    }
  }
}
