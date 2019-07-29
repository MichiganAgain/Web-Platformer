let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
let context = canvas.getContext("2d");

let colors = ["#FDA534", "#F7902F", "#F17C2A", "#EC6325", "#F05027", "#FB282E", "#CE172F", "#BB112F", "#A30830", "#940633", "#860537", "#7A053B", "#74053E", "#6D0541", "#600545", "#540543", "#49043D", "#400438", "#350433", "#300531", "#300531", "#20042B", "#0C0225", "#000000", "#000000"];
let colorIndex = 0;
let colorDirection = 1; // which way the index will move along the color list
let gameRunning = false;
$("#mainCanvas").css({"background-color": "#555555"});
$("#mainCanvas").animate({opacity: 1}, 1000);

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

function pageLoad () {
    checkLogin();
}

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
    else if (evt.keyCode === 27) {
        if (!menuShowing) {
            gameRunning = false;
            $("#menu").css("display", "inline-block");
            menuShowing = true;
        }
        else {
            gameRunning = true;
            $("#menu").css("display", "none");
            menuShowing = false;
        }
    }
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

let username;
let startTime;
let mapID;
let menuShowing = false;
let leaderBoardShowing = false;

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
    $("#leaderboard-container").css({"display": "none"});
    leaderBoardShowing = false;
    document.getElementById('leaderboard-table').innerHTML = "";
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
        gameRunning = true;
        startTime = new Date().getTime();
        mapID = data.mapID;
    });
}

function completedWorld () {
    gameRunning = false;
    let finishTime = ((new Date().getTime()) - startTime) / 1000;
    let formData = new FormData();
    formData.append("mapID", mapID);
    formData.append("score", finishTime);

    fetch("/scores/getScores/" + mapID, {method: 'GET'}).then(response => response.json()).then(data => {
        document.getElementById("leaderboard-table").innerHTML += "<tr><th><u>Username</u></th><th><u>Score</u></th><th><u>Date</u></th></tr>";
        for (var i = 0; i < ((data.scores.length >= 9) ? 9: data.scores.length); i++) {
            document.getElementById("leaderboard-table").innerHTML += "<tr><td>" + data.scores[i].username + "</td><td>" + data.scores[i].score + "</td><td>" + data.scores[i].date + "</td></tr>";
        }
        var currDate = "2019-05-14";
        document.getElementById("leaderboard-table").innerHTML += "<tr id='your-time'><td>" + username + "</td><td>" + finishTime + "</td><td>" + currDate + "</td></tr>";
        $("#leaderboard-container").css({"display": "inline-block"});
        leaderBoardShowing = true;

        fetch("/scores/insert", {method: 'POST', body: formData}).then(response => response.json()).then(data => {

        });
    });
}

setInterval(function () {animate();}, 15); //animate frame every 15 milliseconds if
                                                        //game is currently running
function animate () {
    if (gameRunning && !leaderBoardShowing) {
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
            gameRunning = false;
            initWorld();
        }
    }
}