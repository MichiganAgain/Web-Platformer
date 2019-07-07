function Snowball (x, y, xVelocity, yVelocity) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.img = document.getElementById("snowball");
    this.SIZE = 15;
    this.airResistance = 0.99;
    this.dead = false; // for when it should disappear
    this.damage = 100;
    this.totalCollisions = 0;
    this.maxCollisions = 50;
    
    this.checkBoxCollision = function () {
        let topCollision = false;
        let bottomCollision = false;
        let leftCollision = false;
        let rightCollision = false;
        
        for (let block of blocks) {
            //top block
            if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE) || (this.x >= block.x && this.x + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.y = block.y - this.SIZE - GUARD;
                    this.xVelocity *= block.friction;
                    this.yVelocity *= -block.bounce;
                    topCollision = true;
                }
                else if ((this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE) || (this.x + this.SIZE >= block.x && this.x + this.SIZE + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.y = block.y - this.SIZE - GUARD;
                    this.xVelocity *= block.friction;
                    this.yVelocity *= -block.bounce;
                    topCollision = true;
                }
            }
            //bottom block
            if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE) || (this.x >= block.x && this.x + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
                else if ((this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE) || (this.x + this.SIZE >= block.x && this.x + this.SIZE + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
            }
            //left block
            if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
            }
            //right block
            if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    if (block.type === "lava") this.dead = true;
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
            }
        }
        if (leftCollision || rightCollision) this.xVelocity *= -0.3;
        if (leftCollision || rightCollision || topCollision || bottomCollision) this.totalCollisions += 1;
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        //this.xVelocity *= this.airResistance;
        this.yVelocity += gravity;

        this.checkBoxCollision();

        if (this.totalCollisions > this.maxCollisions) this.dead = true;

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        this.draw();
    }
}