function Block (x, y, type) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.type = type;
    this.friction = 0;
    this.bounce = 0;

    ///////set block attributes
    this.img = document.getElementById(type);
    if (type === "grass_dirt" || type === "dirt") {
        this.friction = 0;
        this.bounce = 0;
    }
    else if (type === "stone" || type === "oak_plank" || type === "oak" || type === "oak_leaf") {
        this.friction = 0.5;
        this.bounce = 0.1;
    }
    else if (type === "ice") {
        this.friction = 0.95;
        this.bounce = 0.3;
    }
    else if (type === "slime") {
        this.friction = 0.3;
        this.bounce = 0.7;
    }
    else if (type === "lava") {
        this.friction = 0.7;
        this.bounce = 0;
    }
    /////////////////////////////////////////////////////////////////////////////
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.strokeRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
    }
    
    this.update = function () {
        this.draw();
    }
}