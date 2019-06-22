var canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
var context = canvas.getContext("2d");

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode == 32 && sprite.canJump) {
        sprite.yVelocity = -10;
        sprite.canJump = false;
    }
    else if (evt.keyCode == 65) {
        sprite.xVelocity = -3;
        keydown = true;
    }
    else if (evt.keyCode == 68) {
        sprite.xVelocity = 3;
        keydown = true;
    }
});

window.addEventListener("keyup", function (evt) {
    if (evt.keyCode == 65) {
        sprite.xMovementVelocity = 0;
        keydown = false;
    }
    else if (evt.keyCode == 68) {
        sprite.xMovementVelocity = 0;
        keydown = false;
    }
});

window.addEventListener("click", function (evt) {
    var xMouse = evt.clientX - camera.xOffset;
    var yMouse = evt.clientY - camera.yOffset;
    var xDiff = xMouse - (sprite.x + sprite.XSIZE / 2);
    var yDiff = yMouse - (sprite.y + sprite.YSIZE / 2);
    var theta = Math.atan2(yDiff, xDiff);
    var velocity = 20;
    
    //blocks.push(new Block(xMouse, yMouse));
    snowballs.push(new Snowball((sprite.x + sprite.XSIZE / 2)-7, (sprite.y + sprite.YSIZE / 2)-7, Math.cos(theta) * velocity, Math.sin(theta) * velocity));
});

var gravity = 0.5;
var GUARD = 0.001;
var keydown = false;

var sprite = new Sprite(50, 50);
var snowballs = [];
var blocks = [];
var fishies = [];
var camera = new Camera();

for (var i = 0; i < 20; i++) blocks.push(new Block(50 * i, 450));
for (var i = 12; i < 17; i++) blocks.push(new Block(50 * i, 1000 - i * 50));
for (var i = 0; i < 90; i++) blocks.push(new Block(100, 50 * i + 400));
for (var i = 0; i < 100; i++) blocks.push(new Block(-150, 50 * i));
for (var i = -10; i < 20; i++) blocks.push(new Block(50 * i, 5000));
blocks.push(new Block(300, 400));

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    camera.update();
    for (let block of blocks) block.update();
    for (let fish of fishies) fish.update();
    sprite.update();
    for (let snowball of snowballs) snowball.update();
}
animate();