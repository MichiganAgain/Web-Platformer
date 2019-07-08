let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;
let context = canvas.getContext("2d");
let mostRecentlySelected = null;

$("#GameButton").click(function () {window.location.href = "/client/game.html"});

setInterval(checkLogin, 1000); //check every second for valid session cookie just cos I can
function checkLogin (onSuccess) {
    let token = Cookies.get("sessionToken");
    if (token !== undefined) {
        fetch("/users/check", {method: "GET"}).then(response => response.json()).then(data => {
            if (data.hasOwnProperty("error")) {
                window.location.href = "/client/login.html";
            }
        });
    }else window.location.href = "/client/login.html";
}

function pageLoad () {
    checkLogin();
}

$("#ice").click(function () {mostRecentlySelected = "ice";});
$("#grass_dirt").click(function () {mostRecentlySelected = "grass_dirt";});
$("#dirt").click(function () {mostRecentlySelected = "dirt";});
$("#stone").click(function () {mostRecentlySelected = "stone";});
$("#slime").click(function () {mostRecentlySelected = "slime";});
$("#lava").click(function () {mostRecentlySelected = "lava";});
$("#eraser").click(function () {mostRecentlySelected = "eraser";});
$("#sprite").click(function () {mostRecentlySelected = "sprite";});
$("#enemy").click(function () {mostRecentlySelected = "enemy";});
$("#tux").click(function () {mostRecentlySelected = "tux";});

$("#saveButton").click(function () {
    if (spriteExists) {
        let mapData = {"blocks": [], sprite: {"x": 0, "y": 0}, "enemies": []};

        for (let block of blocks) mapData.blocks.push({"type": block.type, "x": block.x, "y": block.y});
        for (let enemy of enemies) mapData.enemies.push({"x": enemy.x, "y": enemy.y});
        mapData.sprite.x = sprite.x;
        mapData.sprite.y = sprite.y;
        
        let formData = new FormData();
        formData.append("mapName", $("#mapName").val());
        formData.append("mapData", JSON.stringify(mapData));
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

window.addEventListener("click", function (evt) { //for placing a block / sprite on canvas
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
        /////////////////////////////////////////////


        if (mostRecentlySelected === "ice") blocks.push(new Block(mouseX, mouseY, "ice"));
        else if (mostRecentlySelected === "grass_dirt") blocks.push(new Block(mouseX, mouseY, "grass_dirt"));
        else if (mostRecentlySelected === "dirt") blocks.push(new Block(mouseX, mouseY, "dirt"));
        else if (mostRecentlySelected === "stone") blocks.push(new Block(mouseX, mouseY, "stone"));
        else if (mostRecentlySelected === "slime") blocks.push(new Block(mouseX, mouseY, "slime"));
        else if (mostRecentlySelected === "lava") blocks.push(new Block(mouseX, mouseY, "lava"));
        else if (mostRecentlySelected === "sprite") {
            sprite = new Sprite(mouseX, mouseY);
            spriteExists = true; //only for drawing it on the screen
        }
        else if (mostRecentlySelected === "enemy") enemies.push(new Enemy(mouseX, mouseY));
        else if (mostRecentlySelected === "tux") enemies.push(new Tux(mouseX, mouseY));
    }
});

window.addEventListener("mousemove", function (evt) {
    let mouseX = (evt.clientX - camera.xOffset)
    let mouseY = (evt.clientY - camera.yOffset)
    document.getElementById("coords").innerHTML = "x: " + mouseX + "  y: " + mouseY;
});

function Camera () {
    this.xOffset = 0;
    this.yOffset = 0;
}

let spriteExists = false;
let tuxExists = false;
let sprite;
let tux;
let snowballs = [];
let blocks = [];
let enemies = [];
camera = new Camera();

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let block of blocks) block.draw();
    for (let enemy of enemies) enemy.draw();
    if (spriteExists) sprite.draw();
    if (tuxExists) tux.draw();
}
animate();