var canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
var context = canvas.getContext("2d");
var text = ["A forced update accidentally deleted all of your files :(", "And you got another blue sceen of death :(",
            "And your computer isn't up to spec to run it :(", "And you got more viruses than you have braincells :(",
            "And the cmd is worse than "];
$("#mainCanvas").animate({opacity: 1}, 1000);

window.addEventListener("keydown", function (evt) {
    if ((evt.keyCode == 32 || evt.keyCode == 87) && sprite.canJump) {
        sprite.yVelocity = -12;
        sprite.canJump = false;
    }
    else if (evt.keyCode == 65) {
        sprite.xVelocity = -4;
        keydown = true;
    }
    else if (evt.keyCode == 68) {
        sprite.xVelocity = 4;
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
    var velocity = 15;
    
    //blocks.push(new Block(xMouse, yMouse));
    snowballs.push(new Snowball((sprite.x + sprite.XSIZE / 2)-7, (sprite.y + sprite.YSIZE / 2)-7, Math.cos(theta) * velocity + sprite.xVelocity, Math.sin(theta) * velocity + sprite.yVelocity));
});

var gravity = 0.5;
var GUARD = 0.001;
var keydown = false;

var sprite;
var snowballs = [];
var blocks = [];
var enemies = [];
var fishies = [];
var camera;

function initWorld () {
    snowballs = [];
    blocks = [];
    enemies = [];
    fishies = [];
    for (var i = 0; i < 20; i++) blocks.push(new Block(50 * i, 450, "dirt"));
    for (var i = 12; i < 17; i++) blocks.push(new Block(50 * i, 1000 - i * 50, "ice"));
    for (var i = 0; i < 90; i++) blocks.push(new Block(100, 50 * i + 400, "ice"));
    for (var i = 0; i < 100; i++) blocks.push(new Block(-150, 50 * i, "ice"));
    for (var i = -10; i < 20; i++) blocks.push(new Block(50 * i, 5000, "slime"));
    //blocks.push(new Block(300, 400));
    sprite = new Sprite(50, 400);
    enemies.push(new Enemy(200, 350));
    enemies.push(new Enemy(500, 350));
    camera = new Camera();
}

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //camera.update();

    for (let block of blocks) block.update();
    for (let fish of fishies) fish.update();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
        if (enemies[i].dead) enemies.splice(i, 1);
    }

    sprite.update();
    if (sprite.dead) {
        alert("Oh noo, you tried windows.  " + text[Math.floor(Math.random() * text.length)]);
        initWorld();
    }
    for (var i = 0; i < snowballs.length; i++) {
        snowballs[i].update();
        if (snowballs[i].dead) snowballs.splice(i, 1);
    }
}
initWorld();
animate();