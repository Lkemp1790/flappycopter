////////////////////////////////////////////////////////////
// GAME v1.1
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//word settings
var worldSettings = {
						gravity:.7,
						power:8,
						powerUpRotate:-25,
						powerDownRotate:45,
						copter:{
							width:112,
							height:62
						},
						spacebar:32,
						pipeScoreEnable:true,
						pipeScore:1,
						coinEnable:true,
						coinScore:2,
					};

//level settings
var levelSettings = [
	{
		speed:.8,
		pipeDis:[50,60],
		pipeGap:[100,110],
		target:5
	},
	{
		speed:.9,
		pipeDis:[45,55],
		pipeGap:[90,100],
		target:12
	},
	{
		speed:1,
		pipeDis:[40,50],
		pipeGap:[80,90],
		target:20
	}
]

//world assets array
var pipe_arr = [
	'assets/item_pipe.png'
];

var cloud_arr = [
	'assets/item_cloud_1.png',
	'assets/item_cloud_2.png',
	'assets/item_cloud_3.png',
];

var mountain_arr = [
	'assets/item_mountain_1.png',
	'assets/item_mountain_2.png',
	'assets/item_mountain_3.png',
];

//game test display
var textDisplay = {
					ready:'TAP TO BEGIN',
					exitTitle:'EXIT GAME',
					exitMessage:'ARE YOU SURE\nYOU WANT TO\nQUIT THE GAME?',
					share:'SHARE YOUR SCORE',
					resultTitle:'GAME OVER',
					resultDesc:'[NUMBER]',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Flappy Copter is [SCORE]';//social share score title
var shareMessage = '[SCORE] is mine new highscore on Flappy Copter game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, levelNum:0, start:false, ground:0, top:0, startRotate:-100, endRotate:100, world:{pipeDis:0, pipeNextDis:50, pipeDisMax:50, cloudDis:0, cloudNextDis:50, cloudDisMax:[30,50], cloudSpeed:.6, mountainDis:0, mountainNextDis:50, mountainDisMax:[30,50], mountainSpeed:.4, coinIndex:0, coinAppear:[0,0,1]}, pipe:[], coin:[], cloud:[], mountain:[], loopBackground:true, hitGround:false};
var tweenData = {score:0, tweenScore:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	if($.browser.mobile || isTablet){

	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
		
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }else{
            this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
        }
	}

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	stageClick.cursor = "pointer";
	stageClick.addEventListener("click", function(evt) {
		flapCopter();

		if(!gameData.start){
			startGamePlay();
		}
	});
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}


/*!
 * 
 * KEYBOARD EVENTS - This is the function that runs for keyboard events
 * 
 */
function keydown(event) {
	if(curPage != 'game'){
		return;
	}

	if(worldSettings.spacebar == event.keyCode){
		flapCopter();

		if(!gameData.start){
			startGamePlay();
		}
	}
}

function keyup(event) {

}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;

			setupBackground();
			animateCopter();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			playSound('soundOver');

			resultDescTxt.text = resultDescShadowTxt.text = 0;
			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {delay:.5, tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				resultDescTxt.text = Math.floor(tweenData.tweenScore);
				resultDescShadowTxt.text = Math.floor(tweenData.tweenScore);
			}});
			
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.over = false;
	gameData.start = false;
	gameData.hitGround = false;
	gameData.pipe = [];
	gameData.coin = [];

	scoreContainer.visible = false;
	instructionContainer.visible = true;

	playerData.score = 0;
	updateScore();
	adjustTop();

	gameData.levelNum = 0;
	setGameLevel();

	gameData.world.coinIndex = 0;
	shuffle(gameData.world.coinAppear)

	playSound('soundCopter');
	itemCopter.ySpeed = 0;
	itemCopter.oriY = -(gameData.ground + ((gameData.top - gameData.ground)/2));
	TweenMax.killTweensOf(itemCopter);
	TweenMax.to(itemCopter, .3, {y:itemCopter.oriY, ease:Linear.easeNone, overwrite:true, onComplete:function(){
		animateCopter();
	}});
}

function startGamePlay(){
	gameData.start = true;
	gameData.paused = false;
	gameData.loopBackground = true;

	scoreContainer.visible = true;
	instructionContainer.visible = false;
}

function adjustTop(){
	gameData.top = canvasH/100 * 90;
}

/*!
 * 
 * ANIMATE COPTER - This is the function that runs for animate copter
 * 
 */
function positionCopter(){
	itemCopter.y = itemCopter.oriY = -(gameData.ground + ((gameData.top - gameData.ground)/100 * 30));
}

function animateCopter(){
	var moveSpeed = .3;
	itemCopter.rotation = 0;
	TweenMax.to(itemCopter, moveSpeed, {y:itemCopter.oriY - 5, ease:Linear.easeNone, overwrite:true, onComplete:function(){
		TweenMax.to(itemCopter, moveSpeed, {y:itemCopter.oriY + 5, ease:Linear.easeNone, overwrite:true, onComplete:function(){
			animateCopter();
		}});
	}});
}

/*!
 * 
 * SETUP BACKGROUND - This is the function that runs for game background
 * 
 */
function setupBackground(){
	gameData.levelNum = 0;
	setGameLevel();
	adjustTop();
	backgroundContainer.removeAllChildren();
	pipeContainer.removeAllChildren();
	coinContainer.removeAllChildren();

	var startRotateCloud = randomIntFromInterval(gameData.startRotate, gameData.startRotate+45);
	for(var n=startRotateCloud; n<gameData.endRotate; n+=gameData.world.cloudDisMax[1]){
		createCloud(n);
	}
	gameData.world.cloudNextDis = gameData.world.cloudDisMax[1];

	var startRotateMountain = randomIntFromInterval(gameData.startRotate, gameData.startRotate+45);
	for(var n=startRotateMountain; n<gameData.endRotate; n+=gameData.world.mountainDisMax[1]){
		createMountain(n);
	}
	gameData.world.cloudNextDis = gameData.world.mountainDisMax[1];
	gameData.loopBackground = true;
	positionCopter();
}

/*!
 * 
 * SET GAME LEVEL - This is the function that runs for game level
 * 
 */
function setGameLevel(){
	gameData.speed = levelSettings[gameData.levelNum].speed;
	gameData.pipeDis = levelSettings[gameData.levelNum].pipeDis;
	gameData.pipeGap = levelSettings[gameData.levelNum].pipeGap;

	gameData.world.pipeDisMax = randomIntFromInterval(gameData.pipeDis[0], gameData.pipeDis[1]);
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){

		loopCopter();

		if(!gameData.over){
			loopPipes();
		}
	}

	if(gameData.loopBackground){
		loopGround();
		loopBackground();
	}
}

/*!
 * 
 * LOOP WORLD AND OBJECTS - This is the function that runs to loop word and objects
 * 
 */
function loopGround(){
	itemGround.rotation -= gameData.speed;
	itemGround.rotation = itemGround.rotation < -360 ? 0 : itemGround.rotation;
}

function loopBackground(){
	gameData.world.cloudDis += gameData.speed * gameData.world.cloudSpeed;
	if(gameData.world.cloudDis > gameData.world.cloudNextDis){
		gameData.world.cloudNextDis = randomIntFromInterval(gameData.world.cloudDisMax[0],gameData.world.cloudDisMax[1]);
		gameData.world.cloudDis = 0;
		createCloud();
	}

	gameData.world.mountainDis += gameData.speed * gameData.world.mountainSpeed;
	if(gameData.world.mountainDis > gameData.world.mountainNextDis){
		gameData.world.mountainNextDis = randomIntFromInterval(gameData.world.mountainDisMax[0],gameData.world.mountainDisMax[1]);
		gameData.world.mountainDis = 0;
		createMountain();
	}

	for(var n=0; n<gameData.cloud.length; n++){
		var thisContainer = gameData.cloud[n];
		thisContainer.rotation -= gameData.speed * gameData.world.cloudSpeed;
		
		if(thisContainer.rotation <= gameData.startRotate){
			thisContainer.active = false;
		}
	}

	for(var n=0; n<gameData.mountain.length; n++){
		var thisContainer = gameData.mountain[n];
		thisContainer.rotation -= gameData.speed * gameData.world.mountainSpeed;
		
		if(thisContainer.rotation <= gameData.startRotate){
			thisContainer.active = false;
		}
	}

	for(var n=0; n<gameData.cloud.length; n++){
		var thisContainer = gameData.cloud[n];
		if(!thisContainer.active){
			backgroundContainer.removeChild(thisContainer);
			gameData.cloud.splice(n,1);
			n = gameData.cloud.length;
		}
	}

	for(var n=0; n<gameData.mountain.length; n++){
		var thisContainer = gameData.mountain[n];
		if(!thisContainer.active){
			backgroundContainer.removeChild(thisContainer);
			gameData.mountain.splice(n,1);
			n = gameData.mountain.length;
		}
	}
}

function loopCopter(){
	itemCopter.y = itemCopter.y + itemCopter.ySpeed;
	itemCopter.ySpeed = itemCopter.ySpeed + worldSettings.gravity;

	if(itemCopter.y > -(gameData.ground)){
		if(!gameData.hitGround){
			gameData.hitGround = true;
			playSound('soundCrash');

			gameOver();
		}
		itemCopter.y = -(gameData.ground);
	}

	if(itemCopter.y < -(gameData.top)){
		itemCopter.ySpeed = (worldSettings.power);
		itemCopter.y = -(gameData.top);
	}
}

function loopPipes(){
	gameData.world.pipeDis += gameData.speed;
	if(gameData.world.pipeDis > gameData.world.pipeDisMax){
		gameData.world.pipeDisMax = randomIntFromInterval(gameData.pipeDis[0], gameData.pipeDis[1]);
		gameData.world.pipeDis = 0;
		createPipe();

		if(worldSettings.coinEnable){
			if(gameData.world.coinAppear[gameData.world.coinIndex] == 1){
				createCoin();
			}

			gameData.world.coinIndex++
			if(gameData.world.coinIndex > gameData.world.coinAppear.length-1){
				gameData.world.coinIndex = 0;
				shuffle(gameData.world.coinAppear)
			}
		}
	}

	for(var n=0; n<gameData.pipe.length; n++){
		var thisContainer = gameData.pipe[n];
		thisContainer.rotation -= gameData.speed;
		
		if(thisContainer.rotation > -10 && thisContainer.rotation < 10){
			var pt = thisContainer.globalToLocal(groundContainer.x, groundContainer.y + itemCopter.y);
			var hitted = false;
			if(thisContainer.hitTest(pt.x, pt.y - (worldSettings.copter.height/2))){
				hitted = true;
			}

			if(thisContainer.hitTest(pt.x, pt.y + (worldSettings.copter.height/2))){
				hitted = true;
			}

			if(thisContainer.hitTest(pt.x + (worldSettings.copter.width/2), pt.y)){
				hitted = true;
			}

			if(thisContainer.hitTest(pt.x + (worldSettings.copter.width/2), pt.y - (worldSettings.copter.height/2))){
				hitted = true;
			}

			if(thisContainer.hitTest(pt.x + (worldSettings.copter.width/2), pt.y + (worldSettings.copter.height/2))){
				hitted = true;
			}

			if(hitted){
				gameOver();
			}
		}

		if(thisContainer.rotation <= -5 && thisContainer.score){
			thisContainer.score = false;
			if(worldSettings.pipeScoreEnable){
				playerData.score += worldSettings.pipeScore;
				playSound('soundScore');
				updateScore();
			}
		}

		if(thisContainer.rotation <= gameData.startRotate){
			thisContainer.active = false;
		}
	}

	for(var n=0; n<gameData.pipe.length; n++){
		var thisContainer = gameData.pipe[n];
		if(!thisContainer.active){
			pipeContainer.removeChild(thisContainer);
			gameData.pipe.splice(n,1);
			n = gameData.pipe.length;
		}
	}

	//coin
	for(var n=0; n<gameData.coin.length; n++){
		var thisCoin = gameData.coin[n];
		thisCoin.rotation -= gameData.speed;
		
		var distance = getDistance(thisCoin.x, -thisCoin.regY, itemCopter.x, itemCopter.y);
		if(thisCoin.rotation > -10 && thisCoin.rotation < 10 && distance < 20){
			thisCoin.visible = false;
			thisCoin.active = false;
			playerData.score += worldSettings.coinScore;
			playSound('soundCoin');
			updateScore();
		}

		if(thisCoin.rotation <= gameData.startRotate){
			thisCoin.active = false;
		}
	}

	for(var n=0; n<gameData.coin.length; n++){
		var thisCoin = gameData.coin[n];
		if(!thisCoin.active){
			coinContainer.removeChild(thisCoin);
			gameData.coin.splice(n,1);
			n = gameData.coin.length;
		}
	}
}

function gameOver(){
	playSound('soundHit');
	gameData.over = true;
	gameData.loopBackground = false;
	itemCopter.ySpeed = 20;

	TweenMax.to(itemCopter, .1, {rotation:worldSettings.powerDownRotate, overwrite:true, onComplete:function(){
	
	}});

	endGame();
}

/*!
 * 
 * UPDATE SCORE - This is the function that runs to update score
 * 
 */
function updateScore(){
	gameScoreTxt.text = gameScoreShadowTxt.text = playerData.score;

	if(playerData.score > levelSettings[gameData.levelNum].target){
		gameData.levelNum++;
		gameData.levelNum = gameData.levelNum >= levelSettings.length ? levelSettings.length-1 : gameData.levelNum;
		setGameLevel();
	}
}

/*!
 * 
 * FLAP COPTER - This is the function that runs to flap copter
 * 
 */
function flapCopter(){
	if(gameData.over){
		return;
	}

	playSound('soundSwing');
	itemCopter.ySpeed = -(worldSettings.power);
	TweenMax.to(itemCopter, .05, {rotation:worldSettings.powerUpRotate, overwrite:true, onComplete:function(){
		TweenMax.to(itemCopter, .2, {delay:.5, rotation:worldSettings.powerDownRotate, overwrite:true, onComplete:function(){
			
		}});
	}});
}

/*!
 * 
 * CREATE OBJECT - This is the function that runs to create objects
 * 
 */
function createPipe(){
	var newContainer = new createjs.Container();

	var centerRange = randomIntFromInterval(-80, 80);
	var centerY = gameData.ground + ((gameData.top - gameData.ground)/2);
	centerY += centerRange;
	var range = randomIntFromInterval(gameData.pipeGap[0], gameData.pipeGap[1]);

	var randomPipe = Math.floor(Math.random() * pipe_arr.length);
	var pipeBottom = new createjs.Bitmap(loader.getResult('itemPipe'+randomPipe));
	centerReg(pipeBottom);
	pipeBottom.regY = 0;
	pipeBottom.y = -(centerY - range);

	var pipeTop = new createjs.Bitmap(loader.getResult('itemPipe'+randomPipe));
	centerReg(pipeTop);
	pipeTop.regY = 0;
	pipeTop.y = -(centerY + range);
	pipeTop.rotation = 180;
	pipeTop.scaleX = -1;

	newContainer.addChild(pipeBottom, pipeTop);
	newContainer.rotation = 90;
	newContainer.score = true;
	newContainer.active = true;
	newContainer.objects = [pipeBottom, pipeTop];

	gameData.pipe.push(newContainer);
	pipeContainer.addChild(newContainer);
}

function createCoin(){
	var startRotate = randomIntFromInterval(gameData.pipeDis[0], gameData.pipeDis[1]);
	var centerRange = randomIntFromInterval(-80, 80);
	var centerY = gameData.ground + ((gameData.top - gameData.ground)/2);
	centerY += centerRange;

	var newCoin = itemCoin.clone();
	newCoin.rotation = 90 + (startRotate/2);
	newCoin.active = true;
	newCoin.regY = centerY;

	gameData.coin.push(newCoin);
	coinContainer.addChild(newCoin);
}

function createCloud(rotate){
	var newContainer = new createjs.Container();

	var centerY = gameData.ground + gameData.top;
	var range = randomIntFromInterval(200, 400);
	centerY -= range;

	var randomCloud = Math.floor(Math.random() * cloud_arr.length);
	var itemCloud = new createjs.Bitmap(loader.getResult('itemCloud'+randomCloud));
	centerReg(itemCloud);
	itemCloud.y = -(centerY);

	newContainer.addChild(itemCloud);
	newContainer.rotation = rotate != undefined ? rotate : 90;
	newContainer.active = true;

	gameData.cloud.push(newContainer);
	backgroundContainer.addChild(newContainer);
}

function createMountain(rotate){
	var newContainer = new createjs.Container();

	var centerY = gameData.ground - (worldSettings.copter.height/2);

	var randomCloud = Math.floor(Math.random() * mountain_arr.length);
	var itemMountain = new createjs.Bitmap(loader.getResult('itemMountain'+randomCloud));
	centerReg(itemMountain);
	itemMountain.regY = itemMountain.image.naturalHeight;
	itemMountain.y = -(centerY - (itemMountain.image.naturalHeight/3.5));

	newContainer.addChild(itemMountain);
	newContainer.rotation = rotate != undefined ? rotate : 90;
	newContainer.active = true;

	gameData.mountain.push(newContainer);
	backgroundContainer.addChild(newContainer);
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	TweenMax.to(gameContainer, 1.5, {overwrite:true, onComplete:function(){
		gameData.paused = true;
		goPage('result')
	}});
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}