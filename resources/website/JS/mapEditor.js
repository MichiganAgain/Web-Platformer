let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;
let context = canvas.getContext("2d");

$("#GameButton").click(function () {window.location.href = "/client/game.html"});

setInterval(checkLogin, 1000); //check every second for valid session cookie just cos I can
function checkLogin (onSuccess) {
    let token = Cookies.get("sessionToken");
    if (token !== undefined) {
        fetch("/users/check", {method: "GET"}).then(response => response.json()).then(data => {
            if (data.hasOwnProperty("username")) {
                username = data.username;
            }
            else window.location.href = "/client/login.html";
        });
    }else window.location.href = "/client/login.html";
}

function logout () {
    fetch("/users/logout", {method: 'POST'}).then(response => response.json()).then(data => {
        window.location.href = "/client/login.html";
    });
}

function pageLoad () {
    checkLogin();
}

$("#ice").click(function () {mostRecentlySelected = "ice";});
$("#grass_dirt").click(function () {mostRecentlySelected = "grass_dirt";});
$("#dirt").click(function () {mostRecentlySelected = "dirt";});
$("#stone").click(function () {mostRecentlySelected = "stone";});
$("#oak_plank").click(function () {mostRecentlySelected = "oak_plank";});
$("#lava").click(function () {mostRecentlySelected = "lava";});
$("#slime").click(function () {mostRecentlySelected = "slime";});
$("#eraser").click(function () {mostRecentlySelected = "eraser";});
$("#sprite").click(function () {mostRecentlySelected = "sprite";});
$("#enemy").click(function () {mostRecentlySelected = "enemy";});
$("#tux").click(function () {mostRecentlySelected = "tux";});

function saveMap () {
    if (spriteExists && tuxExists && $("#mapName").val() !== "") {
        let mapData = {"blocks": [], "sprite": {"x": 0, "y": 0}, "tux": {"x": 0, "y": 0}, "enemies": []};

        for (let block of blocks) mapData.blocks.push({"type": block.type, "x": block.x, "y": block.y});
        for (let enemy of enemies) mapData.enemies.push({"x": enemy.x, "y": enemy.y});
        mapData.sprite.x = sprite.x;
        mapData.sprite.y = sprite.y;
        mapData.tux.x = tux.x;
        mapData.tux.y = tux.y;

        let formData = new FormData();
        formData.append("mapName", $("#mapName").val());
        formData.append("mapData", JSON.stringify(mapData));
        fetch("/maps/insert", {method: "POST", body: formData}).then(response => response.json()).then(data => {
            if (data.hasOwnProperty('success')) {
                alert("Map saved\nUsername: " + username + "\nMap Name: " + $("#mapName").val());
                allContentSaved = true;
            }
            else alert("Map not saved");
        });
    }
}

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 65) leftPressed = true; //a
    else if (evt.keyCode === 68) rightPressed = true; //d
    else if (evt.keyCode === 83) downPressed = true; //s
    else if (evt.keyCode === 87) upPressed = true; //w
    else if (evt.keyCode === 16) shiftPressed = true; //shift
    else if (evt.keyCode === 27) {
        if (!menuShowing) {
            $("#menu").css("display", "inline-block");
            menuShowing = true;
        }
        else {
            $("#menu").css("display", "none");
            menuShowing = false;
        }
    }
});

window.addEventListener("keyup", function (evt) {
    if (evt.keyCode === 65) leftPressed = false; //a
    else if (evt.keyCode === 68) rightPressed = false; //d
    else if (evt.keyCode === 83) downPressed = false; //s
    else if (evt.keyCode === 87) upPressed = false; //w
    else if (evt.keyCode === 16) shiftPressed = false; //shift
});

window.addEventListener("click", function (evt) { //for placing a block / sprite on canvas
    if (evt.clientY < canvas.height && xMouse <= rightLimit && xMouse >= leftLimit && yMouse >= topLimit && yMouse <= bottomLimit && !menuShowing) {
        allContentSaved = false;
        let xMouse = (evt.clientX - camera.xOffset) - ((evt.clientX - camera.xOffset) % 50);
        if ((evt.clientX - camera.xOffset) < 0) xMouse -= 50;

        let yMouse = (evt.clientY - camera.yOffset) - ((evt.clientY - camera.yOffset) % 50);
        if ((evt.clientY - camera.yOffset) < 0) yMouse -= 50;


        //check if something is already there
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].x === xMouse && blocks[i].y === yMouse) {
                    blocks.splice(i, 1);
                    break;
                }
            }
            if (spriteExists && sprite.x === xMouse && sprite.y === yMouse) {
                spriteExists = false;
                sprite = null;
            }
            if (tuxExists && tux.x === xMouse && tux.y === yMouse) {
                tuxExists = false;
                tux = null;
            }
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].x === xMouse && enemies[i].y === yMouse) {
                    enemies.splice(i, 1);
                    break;
                }
            }
        /////////////////////////////////////////////


        if (mostRecentlySelected === "ice") blocks.push(new Block(xMouse, yMouse, "ice"));
        else if (mostRecentlySelected === "grass_dirt") blocks.push(new Block(xMouse, yMouse, "grass_dirt"));
        else if (mostRecentlySelected === "dirt") blocks.push(new Block(xMouse, yMouse, "dirt"));
        else if (mostRecentlySelected === "stone") blocks.push(new Block(xMouse, yMouse, "stone"));
        else if (mostRecentlySelected === "oak_plank") blocks.push(new Block(xMouse, yMouse, "oak_plank"));
        else if (mostRecentlySelected === "slime") blocks.push(new Block(xMouse, yMouse, "slime"));
        else if (mostRecentlySelected === "lava") blocks.push(new Block(xMouse, yMouse, "lava"));
        else if (mostRecentlySelected === "sprite") {
            sprite = new Sprite(xMouse, yMouse);
            spriteExists = true; //only for drawing it on the screen
        }
        else if (mostRecentlySelected === "enemy") enemies.push(new Enemy(xMouse, yMouse));
        else if (mostRecentlySelected === "tux") {
            tux = new Tux(xMouse, yMouse);
            tuxExists = true;
        }
    }
});

window.addEventListener("mousemove", function (evt) {
    xMouse = (evt.clientX - camera.xOffset);
    yMouse = (evt.clientY - camera.yOffset);
    document.getElementById("coords").innerHTML = "x: " + xMouse + "  y: " + yMouse;
});

function loadMap () {
    $("#menu").css({"display": "none"});
    menuShowing = false;
    blocks = [];
    enemies = [];
    let formData = new FormData();
    formData.append("mapOwner", $("#importMapOwner").val());
    formData.append("mapName", $("#importMapName").val());

    fetch("/maps/getMap", {method: "POST", body: formData}).then(response => response.json()).then(data => {
        for (let block of data.blocks) blocks.push(new Block(block.x, block.y, block.type));
        for (let enemy of data.enemies) enemies.push(new Enemy(enemy.x, enemy.y));
        sprite = new Sprite(data.sprite.x, data.sprite.y);
        tux = new Tux(data.tux.x, data.tux.y);
        spriteExists = tuxExists = true;
        camera.xOffset = (canvas.width / 2) - sprite.x;
        camera.yOffset = (canvas.height / 2) - sprite.y;
    });
}

function clearCanvas () {
    blocks = [];
    enemies = [];
    sprite = null;
    spriteExists = false;
    tux = null;
    tuxExists = false;
}

function Camera () {
    this.xOffset = 0;
    this.yOffset = 0;
}

let xMouse = 0;
let yMouse = 0;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let shiftPressed = false;
let movementSpeed = 6;

let menuShowing = false;
let allContentSaved = true;
let mostRecentlySelected = null;

let topLimit = -50000;
let bottomLimit = 50000;
let leftLimit = -50000;
let rightLimit = 50000;

let spriteExists = false;
let tuxExists = false;
let sprite;
let tux;
let blocks = [];
let enemies = [];
let username;
let camera = new Camera();

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (leftPressed) camera.xOffset += (shiftPressed) ? movementSpeed * 40: movementSpeed;
    if (rightPressed) camera.xOffset -= (shiftPressed) ? movementSpeed * 40: movementSpeed;
    if (upPressed) camera.yOffset += (shiftPressed) ? movementSpeed * 40: movementSpeed;
    if (downPressed) camera.yOffset -= (shiftPressed) ? movementSpeed * 40: movementSpeed;

    for (let block of blocks) block.draw();
    for (let enemy of enemies) enemy.draw();
    if (spriteExists) sprite.draw();
    if (tuxExists) tux.draw();
}
animate();