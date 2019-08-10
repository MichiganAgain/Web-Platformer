function Block (x, y, type) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.img = document.getElementById("ice");
    this.type = type;
    this.friction = 0;
    this.bounce = 0;
    ///////set block attributes
    if (type === "grass_dirt") {
        this.img = document.getElementById("grass_dirt");
        this.friction = 0;
        this.bounce = 0;
    }
    else if (type === "dirt") {
        this.img = document.getElementById("dirt");
        this.friction = 0;
        this.bounce = 0;
    }
    else if (type === "stone") {
        this.img = document.getElementById("stone");
        this.friction = 0.5;
        this.bounce = 0.1;
    }
    else if (type === "oak_plank") {
        this.img = document.getElementById("oak_plank");
        this.friction = 0.5;
        this.bounce = 0.1;
    }
    else if (type === "ice") {
        this.img = document.getElementById("ice");
        this.friction = 0.95;
        this.bounce = 0.3;
    }
    else if (type === "slime") {
        this.img = document.getElementById("slime");
        this.friction = 0.3;
        this.bounce = 0.7;
    }
    else if (type === "lava") {
        this.img = document.getElementById("lava");
        this.friction = 0.7;
        this.bounce = 0;
    }
    /////////////////////////////////////////////////////////////////////////////
    
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