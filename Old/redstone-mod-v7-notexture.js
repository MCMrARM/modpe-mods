var powerLen = 14;
var powerTime = 50;
var redstoneTick = 20;

var buttonId = 22/*255*/;
var leverId = 57/*31*/;
var repeatorId = 41/*249*/;
var wireId = 42/*248*/;
var pWireId = 246;

var pistonId = 128;
var sPistonId = 156;
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