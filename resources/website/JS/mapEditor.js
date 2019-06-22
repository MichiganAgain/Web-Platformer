var canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight * 0.9;
var context = canvas.getContext("2d");
var mostRecentlySelected = null;

$("img").hover(function () {
    $(this).animate({borderRadius: "5px"}, 100);
                
}, function () {
    $(this).animate({borderRadius: "0px"}, 100);
});

$("img").click(function () {
    mostRecentlySelected = document.getElementById(this).id;
    alert(mostRecentlySelected);
});

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode == 65) camera.xOffset += 50; //a
    else if (evt.keyCode == 68) camera.xOffset -= 50; //d
    else if (evt.keyCode == 83) camera.yOffset -= 50; //s
    else if (evt.keyCode == 87) camera.yOffset += 50; //w
});

window.addEventListener("click", function (evt) {
    if (evt.clientY < canvas.height) {
        var mouseX = (evt.clientX - camera.xOffset) - ((evt.clientX - camera.xOffset) % 50);
        if ((evt.clientX - camera.xOffset) < 0) mouseX -= 50;
        
        var mouseY = (evt.clientY - camera.yOffset) - ((evt.clientY - camera.yOffset) % 50);
        if ((evt.clientY - camera.yOffset) < 0) mouseY -= 50;

        blocks.push(new Block(mouseX, mouseY));
    }
});


function Sprite (x, y) {
    this.x = x;
    this.y = y;
    this.XSIZE = 40;
    this.YSIZE = 49;
    this.img = document.getElementById("sprite");
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () { 
        this.draw();
    }
}

function Block (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.img = document.getElementById("ice");
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
    }

    this.update = function () {
        this.draw();
    }
}

function Enemy (x, y) {
    this.x = x;
    this.y = y;
    this.img = document.getElementById("enemy");
    this.SIZE = 49;
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        this.draw();
    }
}

function Camera () {
    this.xOffset = 0;
    this.yOffset = 0;
}

var spriteExists = false;
var sprite;
var snowballs = [];
var blocks = [];
var enemies = [];
var fishies = [];
camera = new Camera();

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let block of blocks) block.update();
    for (let fish of fishies) fish.update();
    for (let enemy of enemies) enemy.update();
    if (spriteExists) sprite.update();
}
animate();