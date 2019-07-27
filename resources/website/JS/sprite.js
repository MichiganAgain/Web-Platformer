function Sprite (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.goLeft = false;
    this.goRight = false;
    this.jumping = false;
    this.XSIZE = 40;
    this.YSIZE = 49;
    this.img = document.getElementById("sprite");
    this.canJump = true;
    //this.friction = 0;
    this.airResistance = 0.95;
    this.powers = 0x0;
    this.dead = false;

    this.checkBoxCollision = function () {
        let topCollision = false;
        let bottomCollision = false;
        let leftCollision = false;
        let rightCollision = false;

        for (let block of blocks) {
            //top and bottom first
            if (this.x + this.XSIZE >= block.x && this.x <= block.x + block.SIZE) {
                if (this.y + this.YSIZE <= block.y && this.y + this.YSIZE + this.yVelocity >= block.y) {
                    if (block.type === "slime" && this.yVelocity > 2) this.yVelocity *= -block.bounce;
                    else if (block.type === "lava") this.dead = true;
                    else this.yVelocity = 0;
                    this.y = block.y - this.YSIZE - GUARD;
                    if (!this.goLeft && !this.goRight) this.xVelocity *= block.friction; // only resiste when no x-axis related keys are pressed
                    topCollision = true;
                }
                else if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                    if (block.type === "lava") this.dead = true;
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
            }
            //now for left and right
            if (this.y + this.YSIZE >= block.y && this.y <= block.y + block.SIZE) {
                if (this.x + this.XSIZE <= block.x && this.x + this.XSIZE + this.xVelocity >= block.x) {
                    if (block.type === "lava") this.dead = true;
                    this.xVelocity = 0;
                    this.x = block.x - this.XSIZE - GUARD;
                    leftCollision = true;
                }
                else if (this.x >= block.x + block.XSIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                    if (block.type === "lava") this.dead = true;
                    this.xVelocity = 0;
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
            }
        }
        if (topCollision) this.canJump = true;
        else this.canJump = false;
        if (!this.goLeft && !this.goRight) this.xVelocity *= this.airResistance; // only resist whwn no x-axis related keys are pressed
        if (!topCollision && !bottomCollision && !leftCollision && !rightCollision && Math.abs(this.yVelocity) > 50) camera.shake = true
        else camera.shake = false;
    }
    
    this.checkEnemyCollision = function () {
        for (let enemy of enemies) {
            if (this.x + this.XSIZE >= enemy.x && this.x <= enemy.x + enemy.SIZE) {
                if (this.y + this.YSIZE >= enemy.y && this.y <= enemy.y + enemy.SIZE) this.dead = true;
            }
        }
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        if (this.goLeft && this.goRight) this.xVelocity = 0; // the two keys cancel each other out
        else if (this.goLeft) this.xVelocity = -4;
        else if (this.goRight) this.xVelocity = 4;
        if (this.jumping && this.canJump) this.yVelocity = -12;
        this.yVelocity += gravity;
        
        this.checkBoxCollision();
        this.checkEnemyCollision();

        this.x += this.xVelocity;
        this.y += this.yVelocity;
        camera.update();
        
        this.draw(); // draw once everything has been adjusted
    }
}