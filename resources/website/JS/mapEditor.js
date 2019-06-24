var canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight * 0.9;
var context = canvas.getContext("2d");
var mostRecentlySelected = null;


$("#block").click(function () {mostRecentlySelected = "block";});
$("#sprite").click(function () {mostRecentlySelected = "sprite";});
$("#enemy").click(function () {mostRecentlySelected = "enemy";});
$("#eraser").click(function () {mostRecentlySelected = "eraser";});

$("#saveButton").click(function () {
    if (spriteExists) {
        var mapData = {"blocks": [], sprite: {"x": 0, "y": 0}, "enemies": []};

        for (let block of blocks) mapData.blocks.push({"x": block.x, "y": block.y});
        for (let enemy of enemies) mapData.enemies.push({"x": enemy.x, "y": enemy.y});
        mapData.sprite.x = sprite.x;
        mapData.sprite.y = sprite.y;
        
        var formData = new FormData();
        formData.append("username", "MichiganAgain");
        formData.append("mapData", JSON.stringify(mapData));
        fetch("/database/mapTable/insert", {method: "POST", body: formData});
    }
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


        //check if something is already there
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].x == mouseX && blocks[i].y == mouseY) {
                    blocks.splice(i, 1);
                    break;
                }
            }
            if (spriteExists && sprite.x == mouseX && sprite.y == mouseY) {
                spriteExists = false;
                sprite = null;
            }
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].x == mouseX && enemies[i].y == mouseY) {
                    enemies.splice(i, 1);
                    break;
                }
            }
        //


        if (mostRecentlySelected == "block") blocks.push(new Block(mouseX, mouseY));
        else if (mostRecentlySelected == "sprite") {
            spriteExists = true; //only for drawing it on the screen
            sprite = new Sprite(mouseX, mouseY);
        }
        else if (mostRecentlySelected == "enemy") enemies.push(new Enemy(mouseX, mouseY));
    }
});

window.addEventListener("mousemove", function (evt) {
    var mouseX = (evt.clientX - camera.xOffset)
    var mouseY = (evt.clientY - camera.yOffset)
    document.getElementById("coords").innerHTML = "x: " + mouseX + "  y: " + mouseY;
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
    this.img = document.getElementById("block");
    
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