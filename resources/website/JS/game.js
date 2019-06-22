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

function Enemy (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = -3;
    this.yVelocity = 0;
    this.img = document.getElementById("enemy");
    this.SIZE = 49;
    
    this.checkBoxCollision = function () {
        var topCollision = false;
        var bottomCollision = false;
        var leftCollision = false;
        var rightCollision = false;
        
        for (let block of blocks) {
            //top block
            if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {
                if (this.x >= block.x && this.x <= block.x + block.SIZE) {
                    this.y = block.y - this.SIZE - GUARD;
                    this.yVelocity = 0;
                    topCollision = true;
                }
                else if (this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE) {
                    this.yVelocity = 0;
                    this.y = block.y - this.SIZE - GUARD;
                    topCollision = true;
                }
            }
            //bottom block
            if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
                else if ((this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
            }
            //left block
            if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
            }
            //right block
            if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
            }
        }
        if (leftCollision || rightCollision) this.xVelocity *= -1;
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        //this.xVelocity *= this.airResistance;
        this.yVelocity += gravity;
        
        this.checkBoxCollision();
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        
        this.draw();
    }
}

var gravity = 0.5;
var GUARD = 0.001;
var keydown = false;

var sprite = new Sprite(50, 50);
var snowballs = [];
var blocks = [];
var enemies = [new Enemy(200, 350)];
var fishies = [];
var camera = new Camera();

for (var i = 0; i < 20; i++) blocks.push(new Block(50 * i, 450));
for (var i = 12; i < 17; i++) blocks.push(new Block(50 * i, 1000 - i * 50));
for (var i = 0; i < 90; i++) blocks.push(new Block(100, 50 * i + 400));
for (var i = 0; i < 100; i++) blocks.push(new Block(-150, 50 * i));
for (var i = -10; i < 20; i++) blocks.push(new Block(50 * i, 5000));
//blocks.push(new Block(300, 400));

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    camera.update();
    for (let block of blocks) block.update();
    for (let fish of fishies) fish.update();
    sprite.update();
    for (let enemy of enemies) enemy.update();
    for (let snowball of snowballs) snowball.update();
}
animate();