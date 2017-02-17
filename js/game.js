/*
*	CHASING BELLA
*	Author: FABIAN FARIAS
*	Created for CENDYN 2017
*/


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 700;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background2.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero2.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster2.png";


var drawFrame = function(mnstr, frameno, x, y, a) {
	
	ctx.save();
	
	ctx.globalAlpha = a;
	
	ctx.drawImage(mnstr.img, (100*frameno), 0, mnstr.width, mnstr.height, x, y, mnstr.width, mnstr.height);
	
	ctx.restore;
};
// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
//var monster = {};
//var monstersCaught = 0;

// Monster
var monstersCaught = 0;
var monster = {
	speed: 50,
	speedx: 0,
	speedy: 0,
	health: 2,
	max_health: 2,
	hit:0,
	img: monsterImage,
	width: 100,
	height: 100,
	deathFrames: 0,
	deathx: 0,
	deathy: 0,
	deathAlpha: 1.0,
	
};
// Animation frames
var showFrame = 0.0;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Controls Monster Movement towards player
var move = function(mnstr, modifier) {
	
	// Make monster move in a straight line:
	// 		The longest distance (x or y) will use the base speed.
	//		The shortest distance (x or y) will use a slower, altered speed
	//		The speed will be modified so the distance travelled in x to get to the player
	//			should always take the same amount of time as distance travelled in y.
	var dx = Math.abs(hero.x - mnstr.x);
	var dy = Math.abs(hero.y - mnstr.y);
	
	if (dx > dy) {
		mnstr.speedx = mnstr.speed;
		mnstr.speedy = mnstr.speed * (dy/dx);
	} else if (dx < dy) {
		mnstr.speedy = mnstr.speed;
		mnstr.speedx = mnstr.speed * (dx/dy);
	} else {
		mnstr.speedx = mnstr.speed;
		mnstr.speedy = mnstr.speed;
	}
	
	// x movement
	if ((mnstr.x - hero.x) > 1){
		mnstr.x -= modifier * mnstr.speedx;
	} else if ((hero.x - mnstr.x) > 1){
		mnstr.x += modifier * mnstr.speedx;
	}
	
	// y movement
	if ((mnstr.y - hero.y) > 1){
		mnstr.y -= modifier * mnstr.speedy;
	} else if ((hero.y - mnstr.y) > 1) {
		mnstr.y += modifier * mnstr.speedy;
	} 
};

var distance_squared = function(hro, mnstr) {
	return (Math.pow(mnstr.x - hro.x, 2) + Math.pow(mnstr.y - hro.y, 2));
};

var change_background = function(new_background){
	bg = 0;
	bgImage.src = new_background;
};
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Bella Caught Times: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();