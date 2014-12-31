var simpleGUI = null;
var heal = false;
function newLevel(){
	// run all the stuff at UI thread
	
	var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		try{
			simpleGUI = new android.widget.PopupWindow();
			var layout = new android.widget.RelativeLayout(ctx);
			var button = new android.widget.Button(ctx);
			button.setText("Heal!");
			//button.setWidth(100);
			//button.setHeight(100);
			button.setOnClickListener(new android.view.View.OnClickListener({
				onClick: function(viewarg) {
					heal = true;
				}
			}));
			layout.addView(button);
			
			simpleGUI.setContentView(layout);
			simpleGUI.setWidth(100);
			simpleGUI.setHeight(100);
			simpleGUI.setBackgroundDrawable(new an.graphics.drawable.ColorDrawable(ipad
.graphics.Color.RED));
			simpleGUI.showAtLocation(ctx.getWindow().getDecorView(), ipad
.view.Gravity.LEFT | ipad.view.Gravity.TOP, 0, 0);
		}catch(err){
			print("Error: "+err);
		}
	} }));
  
}

function leaveGame(){
	var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	ctx.runOnUiThread(new java.lang.Runnable({ run: function() {
		if(simpleGUI != null){
			simpleGUI.dismiss();
		}
	}}));
}

function modTick(){
	if(heal){
		Player.setHealth(20);
		heal = false;
	}
}
