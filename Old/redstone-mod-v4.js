var powerLen = 14;
var powerTime = 50;
var redstoneTick = 20;
var buttonId = 22;
var leverId = 57;
var repeatorId = 41;
var wireId = 42;
var pWireId = 246;

var pistonId = 128;
var pistonExtendId = 253;

var pressurePlateId = 44;

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
  
  if(blockId == buttonId){
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
    (mode==3?(getTile(x,y,z) == pistonId):
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
      if(getTile(x,y+1,z) != pistonExtendId){ 
        if(getTile(x,y+1,z) != 0){
          var oY = y; // begin Y
          var gtY = oY; // go-to-Y
          for(var i=oY;i<128;i++){
            if(getTile(x,i,z) == 0) {
              gtY = i;
              break;
            }
          }
          
          for(var i=gtY;i>oY;i--)
          {
            setTile(x,i+1,z,getTile(x,i,z));
          }
        }
        setTile(x,y+1,z,pistonExtendId);
      }
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