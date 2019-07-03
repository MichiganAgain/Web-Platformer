let canvas = document.getElementById("mainCanvas")
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;
let context = canvas.getContext("2d");
let text = ["A forced update accidentally deleted all of your files :(", "And you got another blue sceen of death :(",
            "And your computer isn't up to spec to run it :(", "And you got more viruses than you have braincells :(",
            "And the cmd is worse than "];

let colors = ["#FDA534", "#F7902F", "#F17C2A", "#EC6325", "#F05027", "#FB282E", "#CE172F", "#BB112F", "#A30830", "#940633", "#860537", "#7A053B", "#74053E", "#6D0541", "#600545", "#540543", "#49043D", "#400438", "#350433", "#300531", "#300531", "#20042B", "#0C0225"];
let colorIndex = 0;

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
    let xMouse = evt.clientX - camera.xOffset;
    let yMouse = evt.clientY - camera.yOffset;
    let xDiff = xMouse - (sprite.x + sprite.XSIZE / 2);
    let yDiff = yMouse - (sprite.y + sprite.YSIZE / 2);
    let theta = Math.atan2(yDiff, xDiff);
    let velocity = 15;
    
    //blocks.push(new Block(xMouse, yMouse));
    snowballs.push(new Snowball((sprite.x + sprite.XSIZE / 2)-7, (sprite.y + sprite.YSIZE / 2)-15 - sprite.yVelocity, Math.cos(theta) * velocity + sprite.xVelocity, Math.sin(theta) * velocity + sprite.yVelocity));
});

setInterval(function () {
    $("#mainCanvas").css({"background-color": colors[Math.floor(Math.abs(sprite.y) / 100) % colors.length]});
}, 100);

let gravity = 0.5;
let GUARD = 0.001;
let keydown = false;

let sprite;
let snowballs = [];
let blocks = [];
let enemies = [];
let fishies = [];
let camera;

function initWorld () {
    snowballs = [];
    blocks = [];
    enemies = [];
    fishies = [];
    for (let i = -1000; i < 1000; i++) blocks.push(new Block(50 * i, 450, "ice"));
    for (let i = 10; i > 0; i--) blocks.push(new Block(50 * i, 50 * i, "dirt"));
    //for (let i = -10; i < 0; i++) blocks.push(new Block(50 * i, 50 * -i, "dirt"));
    blocks.push(new Block(0, 100, "dirt"));
    sprite = new Sprite(50, 250);
    enemies.push(new Enemy(400, 350)); enemies.push(new Enemy(450, 350)); enemies.push(new Enemy(500, 350));
    camera = new Camera();
}

function animate () {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //camera.update();

    for (let block of blocks) block.update();
    for (let fish of fishies) fish.update();
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        if (enemies[i].dead) enemies.splice(i, 1);
    }
    for (let i = 0; i < snowballs.length; i++) {
        snowballs[i].update();
        if (snowballs[i].dead) snowballs.splice(i, 1);
    }
    sprite.update();
    if (sprite.dead) {
        //alert("Oh noo, you tried windows.  " + text[Math.floor(Math.random() * text.length)]);
        initWorld();
    }
}
initWorld();
animate();