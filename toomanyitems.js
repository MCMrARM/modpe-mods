/*
 Too Many Items Script by MrARM
 Licensed on MIT License
*/

var btnWindow = null;
var mainMenu = null;
var btnMenu = null;
var btnMenuSub = null;
var subMenu = null;
var infoMenu = null;

var addToInventory = false;
var addId;
var addDmg;
var addCount;
var ride = false;
var riding = false;
var ridingAnimal;
var spawnOnTap = -1;

function dip2px(ctx, dips){
 return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
}

function newLevel(){
	// run all the stuff at UI thread
	
	var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try{
			var layout = new android.widget.RelativeLayout(ctx);
			var button = new android.widget.Button(ctx);
			button.setText("M");
			//button.setWidth(100);
			//button.setHeight(100);
			button.setOnClickListener(new android.view.View.OnClickListener({
				onClick: function(viewarg) {
				    spawnOnTap = -1;
					openMenu();
				}
			}));
			layout.addView(button);
			
			
			btnWindow = new android.widget.PopupWindow(layout, dip2px(ctx, 48), dip2px(ctx, 48));
		//	btnWindow.setContentView(layout);
		//	btnWindow.setWidth(dip2px(ctx, 48));
		//	btnWindow.setHeight(dip2px(ctx, 48));
			btnWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
			var flags;
			var bx = 0;
			var by = 0;
			var btnPosC = ModPE.readData("btnPos");
			if(btnPosC == "0"){
                flags = android.view.Gravity.TOP | android.view.Gravity.LEFT;
                by = dip2px(ctx, 20);
			}else if(btnPosC == "1"){
                flags = android.view.Gravity.TOP | android.view.Gravity.RIGHT;
                bx = dip2px(ctx, 38);
                
                btnWindow.setWidth(dip2px(ctx, 38));
			    btnWindow.setHeight(dip2px(ctx, 38));
			}else if(btnPosC == "2"){
                flags = android.view.Gravity.LEFT | android.view.Gravity.BOTTOM;
			}else if(btnPosC == "3" || btnPosC == ""){
                flags = android.view.Gravity.RIGHT | android.view.Gravity.BOTTOM;
			}
			btnWindow.showAtLocation(ctx.getWindow().getDecorView(), flags, bx, by);
		}catch(err){
			print("Failed to show button.");
		}
	} }));
  
}

function compareMobs(mob1, mob2){
    if(mob1 == null || mob2 == null) return false;
    
    if(Entity.getX(mob1) == Entity.getX(mob2) &&
        Entity.getY(mob1) == Entity.getY(mob2) &&
        Entity.getZ(mob1) == Entity.getZ(mob2) &&
        Entity.getEntityTypeId(mob1) == Entity.getEntityTypeId(mob2))
        return true;
        
    return false;
}

function attackHook(attacker, entity){
    if(riding && compareMobs(entity, ridingAnimal)) { rideAnimal(attacker, entity); riding = false; preventDefault(); }
    else if(ride){ rideAnimal(attacker, entity); riding = true; ridingAnimal = entity; clientMessage("To stop riding tap the animal again."); ride = false; preventDefault(); }
}

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage){
    if(spawnOnTap != -1){
        Level.spawnMob(x-(side==4?1:0)+(side==5?1:0)+0.5,y-(side==0?1:0)+(side==1?1:0)+0.5,z-(side==2?1:0)+(side==3?1:0)+0.5,spawnOnTap,null);
        preventDefault();
    }
}

var CAT_STARTER_KIT = 0;
var CAT_STARTER_KIT_ITEMS = [
  {name: "Diamond Helmet", id: 310, data: 0},
  {name: "Diamond Chestplate", id: 311, data: 0},
  {name: "Diamond Leggings", id: 312, data: 0},
  {name: "Diamond Boots", id: 313, data: 0},
  {name: "Diamond Sword", id: 276, data: 0},
  {name: "Diamond Shovel", id: 277, data: 0},
  {name: "Diamond Pickaxe", id: 278, data: 0},
  {name: "Diamond Hoe", id: 293, data: 0},
  {name: "Diamond Axe", id: 279, data: 0},
  {name: "Compass", id: 345, data: 0},
  {name: "Clock", id: 347, data: 0},
  {name: "Crafting Table", id: 58, data: 0},
  {name: "Bed", id: 355, data: 0},
  {name: "Torch", id: 50, data: 0},
  {name: "Oak Plank", id: 5, data: 0}];
var CAT_BUILDING = 1;
var CAT_BUILDING_ITEMS = [
  {name: "Stone", id: 1, data: 0},
  {name: "Grass", id: 2, data: 0},
  {name: "Dirt", id: 3, data: 0},
  {name: "Cobblestone", id: 4, data: 0},
  {name: "Oak Plank", id: 5, data: 0},
  {name: "Spruce Plank", id: 5, data: 1},
  {name: "Birch Plank", id: 5, data: 2},
  {name: "Jungle Plank", id: 5, data: 3},
  {name: "Bedrock", id: 7, data: 0},
  {name: "Sand", id: 12, data: 0},
  {name: "Gravel", id: 13, data: 0},
  {name: "Oak Wood", id: 17, data: 0},
  {name: "Spruce Wood", id: 17, data: 1},
  {name: "Birch Wood", id: 17, data: 2},
  {name: "Jungle Wood", id: 17, data: 3},
  {name: "Glass", id: 20, data: 0},
  {name: "Lapis Lazuli Block", id: 22, data: 0},
  {name: "Sandstone", id: 24, data: 0},
  {name: "Chiseled Sandstone", id: 24, data: 1},
  {name: "Smooth Sandstone", id: 24, data: 2},
  {name: "White Woold", id: 35, data: 0},
  {name: "Orange Wool", id: 35, data: 1},
  {name: "Magenta Wool", id: 35, data: 2},
  {name: "Light Blue Wool", id: 35, data: 3},
  {name: "Yellow Wool", id: 35, data: 4},
  {name: "Lime Wool", id: 35, data: 5},
  {name: "Pink Wool", id: 35, data: 6},
  {name: "Gray Wool", id: 35, data: 7},
  {name: "Light Gray Wool", id: 35, data: 8},
  {name: "Cyan Wool", id: 35, data: 9},
  {name: "Purple Wool", id: 35, data: 10},
  {name: "Blue Wool", id: 35, data: 11},
  {name: "Brown Wool", id: 35, data: 12},
  {name: "Green Wool", id: 35, data: 13},
  {name: "Red Wool", id: 35, data: 14},
  {name: "Black Wool", id: 35, data: 15},
  {name: "Diamond Block", id: 57, data: 0},
  {name: "Gold Block", id: 41, data: 0},
  {name: "Iron Block", id: 42, data: 0},
  {name: "Coal Block", id: 173, data: 0},
  {name: "Double Stone Slab", id: 43, data: 0},
  {name: "Double Sandstone Slab", id: 43, data: 1},
  {name: "Double Wooden Slab", id: 43, data: 2},
  {name: "Double Cobblestone Slab", id: 43, data: 3},
  {name: "Double Brick Slab", id: 43, data: 4},
  {name: "Stone Slab", id: 44, data: 0},
  {name: "Sandstone Slab", id: 44, data: 1},
//Wooden Slab (44:2)
  {name: "Oak Slab", id: 158, data: 0},
  {name: "Spruce Slab", id: 158, data: 1},
  {name: "Birch Slab", id: 158, data: 2},
  {name: "Jungle Slab", id: 158, data: 3},
  {name: "Cobblestone Slab", id: 44, data: 3},
  {name: "Brick Slab", id: 44, data: 4},
  {name: "Stone Brick Slab", id: 44, data: 5},
//Stone Slab (44:6)
  {name: "Quartz Slab", id: 44, data: 7},
  {name: "Brick Block", id: 45, data: 0},
  {name: "Nether Brick Block", id: 112, data: 0},
  {name: "Mossy Cobblestone", id: 48, data: 0},
  {name: "Obdisian", id: 49, data: 0},
  {name: "Oak Stairs", id: 53, data: 0},
  {name: "Cobblestone Stairs", id: 67, data: 0},
  {name: "Brick Stairs", id: 108, data: 0},
  {name: "Stone Brick Stairs", id: 109, data: 0},
  {name: "Nether Brick Stairs", id: 114, data: 0},
  {name: "Sandstone Stairs", id: 128, data: 0},
  {name: "Spruce Stairs", id: 134, data: 0},
  {name: "Birch Stairs", id: 135, data: 0},
  {name: "Jungle Stairs", id: 136, data:0},
  {name: "Quartz Stairs", id: 156, data: 0},
  {name: "Clay Block", id: 82, data: 0},
  {name: "Fence", id: 85, data: 0},
  {name: "Fence Gate", id: 107, data: 0},
  {name: "Netherrack", id: 87, data: 0},
// Invisible bedrock (95)
  {name: "Stone Bricks", id: 98, data: 0},
  {name: "Mossy Stone Bricks", id: 98, data: 1},
  {name: "Cracked Stone Bricks", id: 98, data: 2},
  {name: "Glass Pane", id: 102, data: 0},
  {name: "Glitch Grass", id: 253, data: 0},
  {name: "Glitch Leaves", id: 254, data: 0},
  {name: "Glitch Stone", id: 255, data: 0}];
var CAT_DECORATION = 2;
var CAT_DECORATION_ITEMS = [
  {name: "Sponge", id: 19, data: 0},
  {name: "Yellow Flower", id: 37, data: 0},
  {name: "Cyan Flower", id: 38, data: 0},
  {name: "Bookshelf", id: 47, data: 0},
  {name: "Snow", id: 78, data: 0},
  {name: "Ice", id: 79, data: 0},
  {name: "Snow Block", id: 80, data: 0},
  {name: "Cactus", id: 81, data: 0},
  {name: "Sugar Cane", id: 338, data: 0},
//Sugar Cane (83)
  {name: "Glowstone", id: 89, data: 0},
  {name: "Jack O Lantern", id: 91, data: 0},
// Cake block (92)
  {name: "Melon", id: 103, data: 0},
  {name: "Block of Quartz", id: 115, data: 0},
  {name: "Iron Bars", id: 101, data: 0},
  {name: "Cobblestone Wall", id: 139, data: 0},
  {name: "Mossy Cobblestone Wall", id: 139, data: 1},
  {name: "Chiseled Quartz Block", id: 155, data: 1},
  {name: "Pillar Quartz Block", id: 155, data: 2},
  {name: "Haybale", id: 170, data: 0},
  {name: "Carpet", id: 171, data: 0},
  {name: "Glowing Obdisian", id: 246, data: 0},
  {name: "Update Game Block 1", id: 248, data: 0},
  {name: "Update Game Block 2", id: 249, data: 0},
// grass_carried (253)
// leaves_carried (254)
// info_reserved6 (255)
  {name: "Painting", id: 321, data: 0}];
var CAT_ARMOUR = 3;
var CAT_ARMOUR_ITEMS = [
  {name: "Diamond Helmet", id: 310, data: 0},
  {name: "Diamond Chestplate", id: 311, data: 0},
  {name: "Diamond Leggings", id: 312, data: 0},
  {name: "Diamond Boots", id: 313, data: 0},
  {name: "Gold Helmet", id: 314, data: 0},
  {name: "Gold Chestplate", id: 315, data: 0},
  {name: "Gold Leggings", id: 316, data: 0},
  {name: "Gold Boots", id: 317, data: 0},
  {name: "Iron Helmet", id: 306, data: 0},
  {name: "Iron Chestplate", id: 307, data: 0},
  {name: "Iron Leggings", id: 308, data: 0},
  {name: "Iron Boots", id: 309, data: 0},
  {name: "Chainmail Helmet", id: 302, data: 0},
  {name: "Chainmail Chestplate", id: 303, data: 0},
  {name: "Chainmail Leggings", id: 304, data: 0},
  {name: "Chainmail Boots", id: 305, data: 0},
  {name: "Leather Cap", id: 298, data: 0},
  {name: "Leather Tunic", id: 299, data: 0},
  {name: "Leather Pants", id: 300, data: 0},
  {name: "Leather Boots", id: 301, data: 0}];
var CAT_TOOLS = 4;
var CAT_TOOLS_ITEMS = [
  {name: "Flint and Steel", id: 259, data: 0},
  {name: "Bow", id: 261, data: 0},
  {name: "Arrow", id: 262, data: 0},
  {name: "Shears", id: 359, data: 0},
  {name: "Diamond Sword", id: 276, data: 0},
  {name: "Diamond Shovel", id: 277, data: 0},
  {name: "Diamond Pickaxe", id: 278, data: 0},
  {name: "Diamond Hoe", id: 293, data: 0},
  {name: "Diamond Axe", id: 279, data: 0},
  {name: "Gold Sword", id: 283, data: 0},
  {name: "Gold Shovel", id: 284, data: 0},
  {name: "Gold Pickaxe", id: 285, data: 0},
  {name: "Gold Hoe", id: 294, data: 0},
  {name: "Gold Axe", id: 286, data: 0},
  {name: "Iron Sword", id: 267, data: 0},
  {name: "Iron Shovel", id: 256, data: 0},
  {name: "Iron Pickaxe", id: 257, data: 0},
  {name: "Iron Hoe", id: 292, data: 0},
  {name: "Iron Axe", id: 258, data: 0},
  {name: "Stone Sword", id: 272, data: 0},
  {name: "Stone Shovel", id: 273, data: 0},
  {name: "Stone Pickaxe", id: 274, data: 0},
  {name: "Stone Hoe", id: 291, data: 0},
  {name: "Stone Axe", id: 275, data: 0},
  {name: "Wooden Sword", id: 268, data: 0},
  {name: "Wooden Shovel", id: 269, data: 0},
  {name: "Wooden Pickaxe", id: 270, data: 0},
  {name: "Wooden Hoe", id: 290, data: 0},
  {name: "Wooden Axe", id: 271, data: 0}];
var CAT_FOOD = 5;
var CAT_FOOD_ITEMS = [
  {name: "Pumpkin", id: 86, data: 0},
  {name: "Apple", id: 260, data: 0},
  {name: "Brown Mushroom", id: 39, data: 0},
  {name: "Red Mushroom", id: 40, data: 0},
  {name: "Mushroom Soup", id: 282, data: 0},
  {name: "Raw Porkchop", id: 319, data: 0},
  {name: "Cooked Porkchop", id: 320, data: 0},
  {name: "Raw Beef", id: 363, data: 0},
  {name: "Steak", id: 364, data: 0},
  {name: "Raw Chicken", id: 365, data: 0},
  {name: "Cooked Chicken", id: 366, data: 0},
  {name: "Cake", id: 354, data: 0},
  {name: "Carrot", id: 391, data: 0},
  {name: "Potato", id: 392, data: 0},
  {name: "Baked Potato", id: 393, data: 0},
  {name: "Pumpkin Pie", id: 400, data: 0},
  {name: "Beetroot", id: 457, data: 0},
  {name: "Beetroot Soup", id: 459, data: 0}];
var CAT_DYES = 6;
var CAT_DYES_ITEMS = [
  {name: "Ink Sack", id: 351, data: 0},
  {name: "Rose Red", id: 351, data: 1},
  {name: "Cactus Green", id: 351, data: 2},
  {name: "Cocoa Beans", id: 351, data: 3},
  {name: "Lapis Lazuli", id: 351, data: 4},
  {name: "Purple", id: 351, data: 5},
  {name: "Cyan", id: 351, data: 6},
  {name: "Light Gray", id: 351, data: 7},
  {name: "Gray", id: 351, data: 8},
  {name: "Pink", id: 351, data: 9},
  {name: "Lime", id: 351, data: 10},
  {name: "Dandelion Yellow", id: 351, data: 11},
  {name: "Light Blue", id: 351, data: 12},
  {name: "Magenta", id: 351, data: 13},
  {name: "Orange", id: 351, data: 14},
  {name: "Bone Meal", id: 351, data: 15}];
var CAT_ITEMS = 7;
var CAT_ITEMS_ITEMS = [
  {name: "Diamond Ore", id: 56, data: 0},
  {name: "Gold Ore", id: 14, data: 0},
  {name: "Iron Ore", id: 15, data: 0},
  {name: "Coal Ore", id: 16, data: 0},
  {name: "Lapis Lazuli Ore", id: 21, data: 0},
  {name: "Powered Rail", id: 27, data: 0},
  {name: "Rail", id: 66, data: 0},
  {name: "Redstone Ore", id: 73, data: 0},
// Glowing Redstone Ore (74)
  {name: "Diamond", id: 264, data: 0},
  {name: "Iron Ingot", id: 265, data: 0},
  {name: "Gold Ingot", id: 266, data: 0},
  {name: "Stick", id: 280, data: 0},
  {name: "Flint", id: 318, data: 0},
  {name: "Bowl", id: 281, data: 0},
  {name: "Bone", id: 352, data: 0},
  {name: "String", id: 287, data: 0},
  {name: "Leather", id: 334, data: 0},
  {name: "Feather", id: 288, data: 0},
  {name: "Sugar", id: 353, data: 0},
  {name: "Gunpowder", id: 289, data: 0},
  {name: "Wheat", id: 296, data: 0},
  {name: "Bread", id: 297, data: 0},
  {name: "Minecart", id: 328, data: 0},
  {name: "Saddle", id: 329, data: 0},
  {name: "Snowball", id: 332, data: 0},
  {name: "Slime Ball", id: 341, data: 0},
  {name: "Egg", id: 344, data: 0},
  {name: "Clay", id: 337, data: 0},
  {name: "Clay Brick", id: 336, data: 0},
  {name: "Nether Brick", id: 405, data: 0},
  {name: "Nether Quartz", id: 406, data: 0},
  {name: "Paper", id: 339, data: 0},
  {name: "Book", id: 340, data: 0},
  {name: "Compass", id: 345, data: 0},
  {name: "Clock", id: 347, data: 0},
  {name: "Glowstone Dust", id: 348, data: 0},
  {name: "Melon Slice", id: 360, data: 0}];
var CAT_SPAWN = 8;
var CAT_SPAWN_ITEMS = [
  {name: "Spawn Chicken", id: 383, data: 10},
  {name: "Spawn Cow", id: 383, data: 11},
  {name: "Spawn Pig", id: 383, data: 12},
  {name: "Spawn Sheep", id: 383, data: 13}];
var CAT_MISCELLANEOUS = 9;
var CAT_MISCELLANEOUS_ITEMS = [
  {name: "Crafting Table", id: 58, data: 0},
  {name: "Furnance", id: 61, data: 0},
// Burning Furnance (62)
  {name: "Stone Cutter", id: 245, data: 0},
  {name: "Chest", id: 54, data: 0},
  {name: "Torch", id: 50, data: 0},
  {name: "Ladder", id: 65, data: 0},
  {name: "Wooden Door", id: 324, data: 0},
  {name: "Iron Door", id: 330, data: 0},
  {name: "Trapdoor", id: 96, data: 0},
  {name: "Sign", id: 323, data: 0},
  {name: "Bed", id: 355, data: 0},
  {name: "Coal", id: 263, data: 0},
  {name: "Charcoal", id: 263, data: 1},
  {name: "Oak Sapling", id: 6, data: 0},
  {name: "Spruce Sapling", id: 6, data: 1},
  {name: "Birch Sapling", id: 6, data: 2},
  {name: "Melon Stem", id: 105, data: 0},
  {name: "Wheat Seeds", id: 295, data: 0},
  {name: "Pumpkin Seeds", id: 361, data: 0},
  {name: "Melon Seeds", id: 362, data: 0},
  {name: "Beetroot Seeds", id: 458, data: 0},
  {name: "Bucket", id: 325, data: 0},
  {name: "Milk Bucket", id: 325, data: 1},
  {name: "Water Bucket", id: 325, data: 8},
// Water (8)
  {name: "Stationary water", id: 9, data: 0},
  {name: "Lava Bucket", id: 325, data: 10},
// Lava (10)
  {name: "Stationary lava", id: 11, data: 0},
  {name: "Oak Leaves", id: 18, data: 0},
  {name: "Spruce Leaves", id: 18, data: 1},
  {name: "Birch Leaves", id: 18, data: 2},
  {name: "Jungle Leaves", id: 18, data: 3},
  {name: "Bed", id: 26, data: 0},
  {name: "Cobweb", id: 30, data: 0},
  {name: "Dead Shrub", id: 31, data: 0},
  {name: "TNT", id: 46, data: 0},
// Fire (51)
// Crops Block (59)
  {name: "Farmland", id: 60, data: 0},
// Sign Post (63)
// Wall Sign (68)
// Wooden Door Block (64)
// Iron Door Block (71)
  {name: "Nether Reactor Core", id: 247, data: 0},
  {name: "Camera", id: 456, data: 0}];

function openInfoDialogMenu(ctx, id, damage){
	try{
		//var menu = new android.widget.PopupWindow();
		//menu.setFocusable(true);
		//infoMenu = menu;
		
		var layout = new android.widget.LinearLayout(ctx);
		layout.setOrientation(1);
		
		var textParams = new android.widget.LinearLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
		textParams.setMargins(dip2px(ctx, 5), 0, 0, 0);
		
		var textParams2 = new android.widget.LinearLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
		textParams2.setMargins(dip2px(ctx, 5), dip2px(ctx, 10), 0, 0);
		var title = new android.widget.TextView(ctx);
		title.setTextSize(24);
		title.setText("Too Many Items");
		title.setLayoutParams(textParams);
		layout.addView(title);
		var stitle = new android.widget.TextView(ctx);
		stitle.setTextSize(14);
		stitle.setText("Add item...");
		stitle.setLayoutParams(textParams);
		layout.addView(stitle);
		
		var iidt = new android.widget.TextView(ctx);
		iidt.setTextSize(14);
		iidt.setText("Item ID:");
		iidt.setLayoutParams(textParams2);
		layout.addView(iidt);
		
		var itemId = new android.widget.EditText(ctx);
		itemId.setText(id+"");
		itemId.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
		layout.addView(itemId);
		
		var idmgt = new android.widget.TextView(ctx);
		idmgt.setTextSize(14);
		idmgt.setText("Item Damage:");
		idmgt.setLayoutParams(textParams2);
		layout.addView(idmgt);
		
		var itemDmg = new android.widget.EditText(ctx);
		itemDmg.setText(damage+"");
		itemDmg.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
		layout.addView(itemDmg);
		
		var ict = new android.widget.TextView(ctx);
		ict.setTextSize(14);
		ict.setText("Item Count:");
		ict.setLayoutParams(textParams2);
		layout.addView(ict);
		
		var itemCount = new android.widget.EditText(ctx);
		itemCount.setText("1");
		itemCount.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
		layout.addView(itemCount);
		
		var fullstack = new android.widget.Button(ctx);
		fullstack.setText("Full stack");
		fullstack.setOnClickListener(new android.view.View.OnClickListener({
			onClick: function(viewarg) {
				itemCount.setText("64");
			}
		}));
		layout.addView(fullstack);
		
		var addBtnParams = new android.widget.LinearLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.FILL_PARENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
		addBtnParams.setMargins(0, dip2px(ctx, 10), 0, 0);
		
		var add = new android.widget.Button(ctx);
		add.setText("Add");
		add.setLayoutParams(addBtnParams);
		add.setOnClickListener(new android.view.View.OnClickListener({
			onClick: function(viewarg) {
				addToInventory = true;
				addId = parseInt(itemId.getText());
				addDmg = parseInt(itemDmg.getText());
				addCount = parseInt(itemCount.getText());
			}
		}));
		layout.addView(add);
		
		var menu = new android.widget.PopupWindow(layout, ctx.getWindowManager().getDefaultDisplay().getWidth()/2, ctx.getWindowManager().getDefaultDisplay().getHeight());
		var mlayout = makeMenu(ctx, menu, layout);
		menu.setContentView(mlayout);
		//menu = new android.widget.PopupWindow(mlayout, ctx.getWindowManager().getDefaultDisplay().getWidth()/2, ctx.getWindowManager().getDefaultDisplay().getHeight());
		menu.setFocusable(true);
		infoMenu = menu;
		//menu.setContentView(mlayout);
		//btnWindow.setWidth(100);
		//menu.setWidth(ctx.getWindowManager().getDefaultDisplay().getWidth()/2);
		//menu.setHeight(ctx.getWindowManager().getDefaultDisplay().getHeight());
		menu.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.BLACK));
		menu.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	}catch(err){
		print("Failed to open menu, because: "+err+".");
	}
}

function addMenuItem(ctx, layout, text, id, data){
	var button = new android.widget.Button(ctx);
	button.setText(text);
	//button.setWidth(100);
	//button.setHeight(100);
	button.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    if(Level.getGameMode() == 1){
		        Entity.setCarriedItem(getPlayerEnt(), id, 1, data);
		    }else{
			    openInfoDialogMenu(ctx, id, data);
		    }
		}
	}));
	layout.addView(button);
}

function openSubMenu(ctx, cname, cat){
	try{
		//var menu = new android.widget.PopupWindow();
		//menu.setFocusable(true);
		//subMenu = menu;
		
		var layout = new android.widget.LinearLayout(ctx);
		layout.setOrientation(1);
		
		var textParams = new android.widget.LinearLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
		textParams.setMargins(dip2px(ctx, 5), 0, 0, 0);
		var title = new android.widget.TextView(ctx);
		title.setTextSize(24);
		title.setText("Too Many Items");
		title.setLayoutParams(textParams);
		layout.addView(title);
		var stitle = new android.widget.TextView(ctx);
		stitle.setTextSize(14);
		stitle.setText(cname);
		stitle.setLayoutParams(textParams);
		layout.addView(stitle);
		for(var i=0;i<cat.length;i++)
			addMenuItem(ctx, layout, cat[i].name, cat[i].id, cat[i].data);
		
		var menu = new android.widget.PopupWindow(layout, ctx.getWindowManager().getDefaultDisplay().getWidth()/2, ctx.getWindowManager().getDefaultDisplay().getHeight());
		var mlayout = makeMenu(ctx, menu, layout);
		menu.setContentView(mlayout);
		menu.setFocusable(true);
		subMenu = menu;
		//btnWindow.setWidth(100);
		//menu.setWidth(ctx.getWindowManager().getDefaultDisplay().getWidth()/2);
		//menu.setHeight(ctx.getWindowManager().getDefaultDisplay().getHeight());
		menu.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.BLACK));
		menu.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	}catch(err){
		print("Failed to open menu, because: "+err+".");
	}
}

function addMenuCategory(ctx, layout, text, catid){
	var button = new android.widget.Button(ctx);
	button.setText(text);
	//button.setWidth(100);
	//button.setHeight(100);
	button.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
			if(catid == null){
				openInfoDialogMenu(ctx, 1, 0);
			}else{
				openSubMenu(ctx, text, catid);
			}
		}
	}));
	layout.addView(button);
}

function makeMenu(ctx, menu, layout, main){
	var mlayout = new android.widget.RelativeLayout(ctx); // main layout
	var xbutton = new android.widget.Button(ctx);
	xbutton.setText("x");
	var btnParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
	btnParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	btnParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP);
	xbutton.setLayoutParams(btnParams);
	xbutton.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    if(menu != null){
			    menu.dismiss();
			    menu = null;
		    }
			if(main && btnMenu != null){
			    btnMenu.dismiss();
			    btnMenu = null;
			}
		}
	}));
	
	var svParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.FILL_PARENT, android.widget.RelativeLayout.LayoutParams.FILL_PARENT);
	var scrollview = new android.widget.ScrollView(ctx);
	var pad = dip2px(ctx, 5);
	scrollview.setPadding(pad, pad, pad, pad);
	scrollview.setLayoutParams(svParams);
	
	scrollview.addView(layout);
	mlayout.addView(scrollview);
	mlayout.addView(xbutton);
	return mlayout;
}

function showButtons(ctx){
    function updateTime(){
        if(currSurvival){
            var ltime = Level.getTime()-Math.floor(Level.getTime()/19200)*19200;
            day = ltime < (19200/2);
            time.setText(day?"Day":"Night");
        }else{
            time.setText("Day");
            day = true;
        }
    }
    //var menu = new android.widget.PopupWindow();
	//btnMenu = menu;
	
	var layout = new android.widget.LinearLayout(ctx);
	layout.setOrientation(0);
	
	var heal = new android.widget.Button(ctx);
	heal.setText("Heal");
	heal.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
			Player.setHealth(20);
		}
	}));
	layout.addView(heal);
	
	var gamemode = new android.widget.Button(ctx);
	var currSurvival = Level.getGameMode()==0;
	gamemode.setText(currSurvival?"Survival":"Creative");
	gamemode.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
			currSurvival = !currSurvival;
			Level.setGameMode(currSurvival?0:1);
			updateTime();
			gamemode.setText(currSurvival?"Survival":"Creative");
		}
	}));
	layout.addView(gamemode);
	
	var day = true;
	var time = new android.widget.Button(ctx);
	time.setText("Day");
	time.setOnClickListener(new android.view.View.OnClickListener({
        onClick: function(viewarg) {
            try{
                day = !day;
                //var ti = Math.floor(Level.getTime()/19200)*19200;
                var newTime = day?0:8280;
                Level.setTime(newTime);
                updateTime();
            }catch(e){
                print("Here is the error: "+e);
            }
		}
	}));
	updateTime();
	layout.addView(time);
	
	var more = new android.widget.Button(ctx);
	more.setText("...");
	more.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
			openMore(ctx, more.getLeft(), more.getTop()+more.getHeight());
		}
	}));
	layout.addView(more);
	
	var menu = new android.widget.PopupWindow(layout, -2, -2);
	btnMenu = menu;
	//menu.setContentView(layout);
	//menu.setWidth(-2);
	//menu.setHeight(-2);
	menu.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, 0, 0);
}

function addToArray(arr, sindex, entries){
    for(var i=0;i<entries.length;i++)
        arr[sindex+i] = entries[i];
}

function name2id(name){
    if(name == "Chicken") return 10;
    if(name == "Cow") return 11;
    if(name == "Pig") return 12;
    if(name == "Sheep") return 13;
    
    if(name == "Zombie") return 32;
    if(name == "Creeper") return 33;
    if(name == "Skeleton") return 34;
    if(name == "Spider") return 35;
    if(name == "Zombie Pigman") return 36;
    
    if(name == "Dropped item") return 64;
    if(name == "Primed TNT") return 65;
    
    if(name == "Arrow") return 80;
    if(name == "Snowball") return 81;
    if(name == "Egg") return 82;
    if(name == "Painting") return 83;
    
    return -1;
}

function openMore(ctx, x, y){
    //var menu = new android.widget.PopupWindow();
    //menu.setFocusable(true);
	//btnMenuSub = menu;
	
	var scroll = new android.widget.ScrollView(ctx);
	var layout = new android.widget.LinearLayout(ctx);
	layout.setOrientation(1);
	
	var killBtn = new android.widget.Button(ctx);
	killBtn.setText("Kill");
    killBtn.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    Player.setHealth(0);
		}
	}));
	layout.addView(killBtn);
	
	var spawnBtn = new android.widget.Button(ctx);
	spawnBtn.setText("Set spawn");
	spawnBtn.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    Level.setSpawn(Player.getX(), Player.getY(), Player.getZ());
		    android.widget.Toast.makeText(ctx, "Your spawn has been set to current position.", 0).show();
		}
	}));
	layout.addView(spawnBtn);
	
	var rideBtn = new android.widget.Button(ctx);
	rideBtn.setText("Ride animal");
	rideBtn.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    ride = true;
		    android.widget.Toast.makeText(ctx, "Tap the animal you want to ride.", 0).show();
		}
	}));
	layout.addView(rideBtn);
	
	var entBtn = new android.widget.Button(ctx);
	entBtn.setText("Entity manager");
	entBtn.setOnClickListener(new android.view.View.OnClickListener({
        onClick: function(viewarg) {
            try{
                var arr = java.lang.reflect.Array.newInstance(java.lang.CharSequence, 6);
                arr[0] = "Spawn entities of type...";
                arr[1] = "Age all animals of type...";
                arr[2] = "Set all entities to fire of type...";
                arr[3] = "Remove all entities of type...";
                arr[4] = "Make mobs weak of type...";
                arr[5] = "Make mobs ultra strong of type...";
                
                var builder = new android.app.AlertDialog.Builder(ctx);
                builder.setTitle("Entity manager");
                builder.setItems(arr, new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialog, which) {
                        atotal = 4;
                        if(which == 0){
                            atotal = 13;
                        }else if(which == 2){
                            atotal = 10;
                        }else if(which == 3){
                            atotal = 16;
                        }else if(which == 4 || which == 5){
                            atotal = 9;
                        }
                        var arre = java.lang.reflect.Array.newInstance(java.lang.CharSequence, atotal);
                        var currAdded = 4;
                        addToArray(arre, 0, ["Chicken", "Cow", "Pig", "Sheep"]);
                        
                        if(which == 0 || which == 2 || which == 3 || which == 4 || which == 5) {
                            addToArray(arre, currAdded, ["Zombie", "Creeper", "Skeleton", "Spider", "Zombie Pigman"]);
                            currAdded += 5;
                        }
                        
                        if(which == 2 || which == 3) {
                            addToArray(arre, currAdded, ["Dropped item"]);
                            currAdded += 1;
                        }
                        
                        if(which == 0){
                            addToArray(arre, currAdded, ["Primed TNT", "Arrow", "Snowball", "Egg"]);
                            currAdded += 4;
                        }
                        
                        if(which == 3) {
                            addToArray(arre, currAdded, ["Primed TNT", "Falling block", "Arrow", "Snowball", "Egg", "Painting"]);
                            currAdded += 6;
                        }
                        
                        var builder2 = new android.app.AlertDialog.Builder(ctx);
                        builder2.setTitle("Select entity type...");
                        builder2.setItems(arre, new android.content.DialogInterface.OnClickListener({
                            onClick: function(dialog2, which2) {
                                var eId = name2id(arre[which2]);
                                if(which == 0){
                                    spawnOnTap = eId;
                                    clientMessage("Tap on blocks to spawn entities. To stop tap the main button.");
                                }else if(which == 1){
                                    var aarr = java.lang.reflect.Array.newInstance(java.lang.CharSequence, 2);
                                    aarr[0] = "Baby";
                                    aarr[1] = "Full-grown";
                                    
                                    var builder3 = new android.app.AlertDialog.Builder(ctx);
                                    builder3.setTitle("Age");
                                    builder3.setItems(aarr, new android.content.DialogInterface.OnClickListener({
                                        onClick: function(dialog3, which3) {
                                            ageAll(eId, which3==0?-24000:0);
                                        }
                                    }));
                                    builder3.show();
                                }else if(which == 2){
                                    fireAll(eId, 10);
                                }else if(which == 3){
                                    killAll(eId);
                                }else if(which == 4){
                                    healAll(eId, 1);
                                }else if(which == 5){
                                    healAll(eId, 50);
                                }
                            }
                        }));
                        builder2.show();
                    }
                }));
                builder.show();
		    }catch(err){
		        print("e/"+err);
		    }
		}
	}));
	layout.addView(entBtn);
	
	var placeBtn = new android.widget.Button(ctx);
	placeBtn.setText("Select button position");
	placeBtn.setOnClickListener(new android.view.View.OnClickListener({
		onClick: function(viewarg) {
		    try{
			var arr = java.lang.reflect.Array.newInstance(java.lang.CharSequence, 4);
			arr[0] = "Top-left corner, below heart bar";
			arr[1] = "Top-right corner, after chat button";
			arr[2] = "Bottom-left corner";
			arr[3] = "Bottom-right corner";
			
			var builder = new android.app.AlertDialog.Builder(ctx);
			builder.setTitle("Button position");
			builder.setItems(arr, new android.content.DialogInterface.OnClickListener({
                onClick: function(dialog, which) {
                    ModPE.saveData("btnPos", which);
                    android.widget.Toast.makeText(ctx, "Reload the world to apply.", 0).show();
                }
            }));
            builder.show();
		    }catch(err){
		        print("e/"+err);
		    }
		}
	}));
	layout.addView(placeBtn);
	scroll.addView(layout);
	
	var menu = new android.widget.PopupWindow(scroll, dip2px(ctx,150), dip2px(ctx,150));
    menu.setFocusable(true);
	btnMenuSub = menu;
	//menu.setContentView(layout);
	//menu.setWidth(dip2px(ctx,150));
	//menu.setHeight(dip2px(ctx,250));
	menu.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.GRAY));
	menu.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, x, y);
}

function openMenu(){
	var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	try{
	    showButtons(ctx);
		//var menu = new android.widget.PopupWindow();
		//menu.setFocusable(true);
		//mainMenu = menu;
		
		var layout = new android.widget.LinearLayout(ctx);
		layout.setOrientation(1);
		
		
		var textParams = new android.widget.LinearLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
		textParams.setMargins(dip2px(ctx, 5), 0, 0, 0);
		var title = new android.widget.TextView(ctx);
		title.setTextSize(24);
		title.setText("Too Many Items");
		title.setLayoutParams(textParams);
		layout.addView(title);
		var stitle = new android.widget.TextView(ctx);
		stitle.setTextSize(14);
		stitle.setText("by MrARM");
		stitle.setLayoutParams(textParams);
		layout.addView(stitle);
		addMenuCategory(ctx, layout, "Starter Kit", CAT_STARTER_KIT_ITEMS);
		addMenuCategory(ctx, layout, "Building blocks", CAT_BUILDING_ITEMS);
		addMenuCategory(ctx, layout, "Decoration Blocks", CAT_DECORATION_ITEMS);
		addMenuCategory(ctx, layout, "Armour", CAT_ARMOUR_ITEMS);
		addMenuCategory(ctx, layout, "Tools", CAT_TOOLS_ITEMS);
		addMenuCategory(ctx, layout, "Food", CAT_FOOD_ITEMS);
		addMenuCategory(ctx, layout, "Dyes", CAT_DYES_ITEMS);
		addMenuCategory(ctx, layout, "Ores & Items", CAT_ITEMS_ITEMS);
		addMenuCategory(ctx, layout, "Spawn Eggs", CAT_SPAWN_ITEMS);
		addMenuCategory(ctx, layout, "Miscellaneous", CAT_MISCELLANEOUS_ITEMS);
		addMenuCategory(ctx, layout, "Custom", null);
		
		var menu = new android.widget.PopupWindow(layout, ctx.getWindowManager().getDefaultDisplay().getWidth()/2, ctx.getWindowManager().getDefaultDisplay().getHeight());
		var mlayout = makeMenu(ctx, menu, layout, true);
		menu.setContentView(mlayout);
		//menu.setFocusable(true); <-- I can't find better solution
		mainMenu = menu;
		//menu.setContentView(mlayout);
		//btnWindow.setWidth(100);
		//menu.setWidth(ctx.getWindowManager().getDefaultDisplay().getWidth()/2);
		//menu.setHeight(ctx.getWindowManager().getDefaultDisplay().getHeight());
		menu.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.BLACK));
		menu.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	}catch(err){
		print("Failed to open menu, because: "+err+".");
	}
}

function leaveGame(){
	var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		if(btnWindow != null){
			btnWindow.dismiss();
			btnWindow = null;
		}
		if(mainMenu != null){
			mainMenu.dismiss();
			mainMenu = null;
		}
		if(btnMenu != null){
			btnMenu.dismiss();
			btnMenu = null;
		}
		if(subMenu != null){
			subMenu.dismiss();
			subMenu = null;
		}
		if(infoMenu != null){
			infoMenu.dismiss();
			infoMenu = null;
		}
	}}));
	riding = false;
}

function modTick(){
	if(addToInventory){
		addItemInventory(addId, addCount, addDmg);
		addToInventory = false;
	}
	
	if(riding){
        // thanks to 500ISE
        
        var playerYaw = getYaw();
        var playerPitch = getPitch();
        //setRot(ridingAnimal, playerYaw, 0);
        var velX = -1 * Math.sin(playerYaw / 180 * Math.PI) * 0.2;
		var velZ = Math.cos(playerYaw / 180 * Math.PI) * 0.2;
		var velY = 0;
		var jumpVel = 0.2;
		if(velX > 0){
		    if (getTile(Player.getX()+1, Math.floor(Entity.getY(ridingAnimal)), Player.getZ()) != 0)
		        velY = jumpVel;
		}else{
		    if(getTile(Player.getX()-1, Math.floor(Entity.getY(ridingAnimal)), Player.getZ()) != 0)
		        velY = jumpVel;
		}
		
		if(velZ > 0){
		    if(getTile(Player.getX(), Math.floor(Entity.getY(ridingAnimal)), Player.getZ()+1) != 0)
		        velY = jumpVel;
		}else{
		    if(getTile(Player.getX(), Math.floor(Entity.getY(ridingAnimal)), Player.getZ()-1) != 0)
		        velY = jumpVel;
		}
		
		if(velY == 0 && getTile(Player.getX(), Player.getY()-2, Player.getZ()) == 0) velY = -jumpVel;
		//clientMessage(velY);
		//var velY = Math.sin((playerPitch - 180) / 180 * Math.PI) * ANIMAL_VERTICAL_SPEED;
		setVelX(ridingAnimal, velX);
		setVelY(ridingAnimal, velY);
		setVelZ(ridingAnimal, velZ);
	}
}


// MOB MANAGER
var entities = [];
function entityAddedHook(ent){
    entities.push(ent);
}
function entityRemovedCallback(ent){
    entities.splice(entities.indexOf(ent));
}
function killAll(entType){
    for(var i=0;i<entities.length;i++){
        if(Entity.getEntityTypeId(entities[i]) == entType){
            Entity.remove(entities[i]);
        }
    }
}
function ageAll(entType, age){
    for(var i=0;i<entities.length;i++){
        if(Entity.getEntityTypeId(entities[i]) == entType){
            Entity.setAnimalAge(entities[i], age);
        }
    }
}
function fireAll(entType, time){
    for(var i=0;i<entities.length;i++){
        if(Entity.getEntityTypeId(entities[i]) == entType){
            Entity.setFireTicks(entities[i], time);
        }
    }
}
function healAll(entType, lives){
    for(var i=0;i<entities.length;i++){
        if(Entity.getEntityTypeId(entities[i]) == entType){
            Entity.setHealth(entities[i], lives);
        }
    }
}