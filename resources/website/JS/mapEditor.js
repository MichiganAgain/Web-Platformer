let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;
let context = canvas.getContext("2d");
let mostRecentlySelected = null;

function checkLogin (onSuccess) {
    let token = Cookies.get("sessionToken");
    if (token !== undefined) {
        fetch("/users/check", {method: "GET"}).then(response => response.json()).then(data => {
            if (data.hasOwnProperty("error")) {
                window.location.href = "/client/login.html";
            }
        });
    }
}

function pageLoad () {
    checkLogin();
}

$("#ice").click(function () {mostRecentlySelected = "ice";});
$("#dirt").click(function () {mostRecentlySelected = "dirt";});
$("#slime").click(function () {mostRecentlySelected = "slime";});
$("#eraser").click(function () {mostRecentlySelected = "eraser";});
$("#sprite").click(function () {mostRecentlySelected = "sprite";});
$("#enemy").click(function () {mostRecentlySelected = "enemy";});

$("#saveButton").click(function () {
    if (spriteExists) {
        let mapData = {"blocks": [], sprite: {"x": 0, "y": 0}, "enemies": []};

        for (let block of blocks) mapData.blocks.push({"type": block.type, "x": block.x, "y": block.y});
        for (let enemy of enemies) mapData.enemies.push({"x": enemy.x, "y": enemy.y});
        mapData.sprite.x = sprite.x;
        mapData.sprite.y = sprite.y;
        
        let formData = new FormData();
        formData.append("mapData", JSON.stringify(mapData));
        formData.append("mapName", "map 4");
        fetch("/maps/insert", {method: "POST", body: formData}).then(response => response.json()).then(data => {

        });
    }
});

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 65) camera.xOffset += 50; //a
    else if (evt.keyCode === 68) camera.xOffset -= 50; //d
    else if (evt.keyCode === 83) camera.yOffset -= 50; //s
    else if (evt.keyCode === 87) camera.yOffset += 50; //w
});

window.addEventListener("click", function (evt) {
    if (evt.clientY < canvas.height) {
        let mouseX = (evt.clientX - camera.xOffset) - ((evt.clientX - camera.xOffset) % 50);
        if ((evt.clientX - camera.xOffset) < 0) mouseX -= 50;
        
        let mouseY = (evt.clientY - camera.yOffset) - ((evt.clientY - camera.yOffset) % 50);
        if ((evt.clientY - camera.yOffset) < 0) mouseY -= 50;


        //check if something is already there
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].x === mouseX && blocks[i].y === mouseY) {
                    blocks.splice(i, 1);
                    break;
                }
            }
            if (spriteExists && sprite.x === mouseX && sprite.y === mouseY) {
                spriteExists = false;
                sprite = null;
            }
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].x === mouseX && enemies[i].y === mouseY) {
                    enemies.splice(i, 1);
                    break;
                }
            }
        //


        if (mostRecentlySelected === "ice") blocks.push(new Block(mouseX, mouseY, "ice"));
        else if (mostRecentlySelected === "dirt") blocks.push(new Block(mouseX, mouseY, "dirt"));
        else if (mostRecentlySelected === "slime") blocks.push(new Block(mouseX, mouseY, "slime"));
        else if (mostRecentlySelected === "sprite") {
            spriteExists = true; //only for drawing it on the screen
            sprite = new Sprite(mouseX, mouseY);
        }
        else if (mostRecentlySelected === "enemy") enemies.push(new Enemy(mouseX, mouseY));
    }
});

window.addEventListener("mousemove", function (evt) {
    let mouseX = (evt.clientX - camera.xOffset)
    let mouseY = (evt.clientY - camera.yOffset)
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

function Block (x, y, type) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.type = type;
    this.img = document.getElementById("ice");
    if (type === "dirt") this.img = document.getElementById("dirt");
    else if (type === "ice") this.img = document.getElementById("ice");
    else if (type === "slime") this.img = document.getElementById("slime");
    
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

let spriteExists = false;
let sprite;
let snowballs = [];
let blocks = [];
let enemies = [];
let fishies = [];
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