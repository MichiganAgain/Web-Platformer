let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
let context = canvas.getContext("2d");

$("#menu").animate({opacity: 1}, 3000);

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

function loadMapEditor () {
    window.location.href = "/client/mapEditor.html"
}

function logout () {
    fetch("/users/logout", {method: 'POST'}).then(response => response.json()).then(data => {

    });
}

function showMenu () {
    document.getElementById("mapOwner").value = "";
    document.getElementById("mapName").value = "";
    $("#menu").css("display", "inline-block");
    menuShowing = true;
}

window.addEventListener("keydown", function (evt) {
    if (gameRunning) {
        if ((evt.keyCode === 32 || evt.keyCode === 87) && sprite.canJump) { //on space or w press
            sprite.jumping = true;
            sprite.canJump = false;
        } else if (evt.keyCode === 65) {
            sprite.goLeft = true;
        } else if (evt.keyCode === 68) {
            sprite.goRight = true;
        } else if (evt.keyCode === 82) {
            initWorld();
        }
    }

    if (evt.keyCode === 27) {
        if (!menuShowing) {
            gameRunning = false;
            $("#menu").css("display", "inline-block");
            menuShowing = true;
        }
        else {
            if (!gameCompleted) gameRunning = true;
            $("#menu").css("display", "none");
            menuShowing = false;
        }
    }
});

window.addEventListener("keyup", function (evt) {
    if (gameRunning) {
        if (evt.keyCode === 32 || evt.keyCode === 87) {
            sprite.jumping = false;
        } else if (evt.keyCode === 65) {
            sprite.goLeft = false;
        } else if (evt.keyCode === 68) {
            sprite.goRight = false;
        }
    }
});

window.addEventListener("click", function (evt) { //shoot a snowball by finding mouse angle
    if (gameRunning) {
        xMouse = evt.clientX - camera.xOffset;
        yMouse = evt.clientY - camera.yOffset;
        shoot();
    }
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
let gameRunning = false;
let gameCompleted = false;
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
    $("#menu").css({"display": "none"});
    leaderBoardShowing = false;
    menuShowing = false;
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
        mapID = data.mapID;
        startTime = new Date().getTime();
    });
}

function completedWorld () {
    let finishTime = ((new Date().getTime()) - startTime) / 1000;
    gameRunning = false;
    gameCompleted = true;
    let formData = new FormData();
    formData.append("mapID", mapID);
    formData.append("score", finishTime);

    var pos;
    var scoreInserted = false;
    var rowsToShow = 10;

    fetch("/scores/getScores/" + mapID, {method: 'GET'}).then(response => response.json()).then(data => {
        // first find users position in leader-board
        for (pos = 0; pos < data.scores.length; pos++) {
            if (data.scores[pos].score > finishTime) break;
        }
        ////////////////////////////////////////////////

        document.getElementById("leaderboard-table").innerHTML += "<tr><th><u>Pos</u></th><th><u>Username</u></th><th><u>Score</u></th><th><u>Date</u></th></tr>";
        for (var i = 0; i < ((data.scores.length >= rowsToShow - 1) ? rowsToShow - 1: data.scores.length); i++) {
            if (i == pos) {
                scoreInserted = true;
                document.getElementById("leaderboard-table").innerHTML += "<tr id='your-time'><td>" + (pos + 1) + "</td><td>" + username + "</td><td>" + finishTime.toString().substring(0, 5) + "</td><td>Today</td></tr>";
            }
            document.getElementById("leaderboard-table").innerHTML += "<tr><td>" + ((scoreInserted) ? (i + 2): (i + 1)) + "</td><td>" + data.scores[i].username + "</td><td>" + data.scores[i].score.toString().substring(0, 6) + "</td><td>" + data.scores[i].date + "</td></tr>";
        }

        if (!scoreInserted) document.getElementById("leaderboard-table").innerHTML += "<tr id='your-time'><td>" + ((pos < rowsToShow) ? "": "..") + (pos + 1) + "</td><td>" + username + "</td><td>" + finishTime.toString().substring(0, 5) + "</td><td>Today</td></tr>";

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
        canvas.width = window.innerWidth - 4;
        canvas.height = window.innerHeight - 4;
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