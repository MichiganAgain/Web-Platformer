let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
let context = canvas.getContext("2d");
let text = ["A forced update accidentally deleted all of your files :(", "And you got another blue sceen of death :(",
            "And your computer isn't up to spec to run it :(", "And you got more viruses than you have braincells :(",
            "And the cmd is worse than "];

let colors = ["#FDA534", "#F7902F", "#F17C2A", "#EC6325", "#F05027", "#FB282E", "#CE172F", "#BB112F", "#A30830", "#940633", "#860537", "#7A053B", "#74053E", "#6D0541", "#600545", "#540543", "#49043D", "#400438", "#350433", "#300531", "#300531", "#20042B", "#0C0225", "#000000", "#000000"];
let colorIndex = 0;
let colorDirection = 1; // which way the index will move along the color list
let gameStarted = false;
$("#mainCanvas").css({"background-color": "#555555"});
$("#mainCanvas").animate({opacity: 1}, 1000);

$("#mapEditButton").click(function () {window.location.href = "/client/mapEditor.html"});

window.addEventListener("keydown", function (evt) {
    if ((evt.keyCode === 32 || evt.keyCode === 87) && sprite.canJump) { //on space or w press
        sprite.jumping = true;
        sprite.canJump = false;
    }
    else if (evt.keyCode === 65) {
        sprite.goLeft = true;
    }
    else if (evt.keyCode === 68) {
        sprite.goRight = true;
    }
    else if (evt.keyCode === 49) initWorld(); //on number 1 press
    else if (evt.keyCode === 50) $("#mapSelect").css("display", "block"); // on number 2 press
});

window.addEventListener("keyup", function (evt) {
    if (evt.keyCode === 32 || evt.keyCode === 87) {
        sprite.jumping = false;
    }
    else if (evt.keyCode === 65) {
        sprite.goLeft = false;
    }
    else if (evt.keyCode === 68) {
        sprite.goRight = false;
    }
});

window.addEventListener("click", function (evt) { //shoot a snowball by finding mouse angle
    xMouse = evt.clientX - camera.xOffset;
    yMouse = evt.clientY - camera.yOffset;
    shoot();
});

function shoot () {
    let xDiff = xMouse - (sprite.x + sprite.XSIZE / 2);
    let yDiff = yMouse - (sprite.y + sprite.YSIZE / 2);
    let theta = Math.atan2(yDiff, xDiff);
    let velocity = 15;

    //blocks.push(new Block(xMouse, yMouse));
    snowballs.push(new Snowball((sprite.x + sprite.XSIZE / 2)-7, (sprite.y + sprite.YSIZE / 2)-15 - sprite.yVelocity, Math.cos(theta) * velocity + sprite.xVelocity, Math.sin(theta) * velocity + sprite.yVelocity));
}

/*setInterval(function () { //keep updating canvas color
    //$("#mainCanvas").css({"background-color": colors[Math.floor(Math.abs(sprite.y) / 100) % colors.length]});
    if (colorIndex + colorDirection < 0 || colorIndex + colorDirection > colors.length - 1) colorDirection *= -1;
    $("#mainCanvas").css({"background-color": colors[colorIndex]});
    colorIndex += colorDirection;
}, 10000);*/

let startTime;
let mapID;

let xMouse;
let yMouse;
let xGravity = 0.0;
let yGravity = 0.5;
let GUARD = 0.001;

let sprite;
let tux;
let snowballs = [];
let blocks = [];
let enemies = [];
let camera;

function initWorld () { // initialize the world by getting map data from database
    snowballs = [];
    blocks = [];
    enemies = [];
    let formData = new FormData();
    formData.append("mapOwner", $("#mapOwner").val());
    formData.append("mapName", $("#mapName").val());
    $("#mapSelect").css("display", "none");
    fetch("/maps/getMap", {method: "POST", body: formData}).then(response => response.json()).then(data => {
        for (let block of data.blocks) blocks.push(new Block(block.x, block.y, block.type));
        for (let enemy of data.enemies) enemies.push(new Enemy(enemy.x, enemy.y));
        sprite = new Sprite(data.sprite.x, data.sprite.y);
        tux = new Tux(data.tux.x, data.tux.y);
        camera = new Camera();
        gameStarted = true;
        startTime = new Date().getTime();
        mapID = data.mapID;
    });
}

function completedWorld () {
    gameStarted = false;
    let finishTime = ((new Date().getTime()) - startTime) / 1000;
    let formData = new FormData();
    formData.append("mapID", mapID);
    formData.append("score", finishTime);
    fetch("/scores/getScores/" + mapID, {method: 'GET'}).then(response => response.json()).then(data => {
        document.getElementById("leaderboard").innerHTML += "<tr><th>Username</th><th>Score</th><th>Date</th></tr>";
        for (let obj of data.scores) {
            document.getElementById("leaderboard").innerHTML += "<tr><td>" + obj.username + "</td><td>" + obj.score + "</td><td>" + obj.date + "</td></tr>";
        }
    });
    fetch("/scores/insert", {method: 'POST', body: formData}).then(response => response.json()).then(data => {
        //alert("Sent scores");
    });
    //alert("World complete!" + "  Finished in " + (finishTime / 1000) + " seconds!");
}

setInterval(function () {animate();}, 15); //animate frame every 15 milliseconds if
                                                        //game is currently running
function animate () {
    if (gameStarted) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //camera.update();  moved to sprite
        for (let block of blocks) block.update();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].update();
            if (enemies[i].dead) enemies.splice(i, 1);
        }
        for (let i = 0; i < snowballs.length; i++) {
            snowballs[i].update();
            if (snowballs[i].dead) snowballs.splice(i, 1);
        }
        tux.update();
        sprite.update();
        if (sprite.dead) {
            //alert("Oh noo, you tried windows.  " + text[Math.floor(Math.random() * text.length)]);
            gameStarted = false;
            initWorld();
        }
    }
}