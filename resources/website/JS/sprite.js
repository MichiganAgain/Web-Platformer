function Sprite (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.XSIZE = 40;
    this.YSIZE = 49;
    this.img = document.getElementById("sprite");
    this.canJump = true;
    this.friction = 0.99;
    this.airResistance = 0.95;
    this.powers = 0x0;
    this.dead = false;
    
    this.checkBoxCollision = function () {
        var topCollision = false;
        var bottomCollision = false;
        var leftCollision = false;
        var rightCollision = false;
        var bottomCollisionBox = null;
        
        for (let block of blocks) {
            //top of block
            if (this.y + this.YSIZE <= block.y && this.y + this.YSIZE + this.yVelocity >= block.y) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE) || (this.x + this.xVelocity >= block.x && this.x + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "slime") this.yVelocity *= -block.bounce;
                    else this.yVelocity = 0;
                    this.y = block.y - this.YSIZE - GUARD;
                    if (!keydown) this.xVelocity *= block.friction;
                    topCollision = true;
                }
                else if ((this.x + this.XSIZE >= block.x && this.x + this.XSIZE <= block.x + block.SIZE) || (this.x + this.XSIZE + this.xVelocity >= block.x && this.x + this.XSIZE + this.xVelocity <= block.x + block.SIZE)) {
                    if (block.type === "slime") this.yVelocity *= -block.bounce;
                    else this.yVelocity = 0;
                    this.y = block.y - this.YSIZE - GUARD;
                    if (!keydown) this.xVelocity *= block.friction;
                    topCollision = true;
                }
            }
            //bottom block
            if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE) || (this.x + this.xVelocity >= block.x && this.x + this.xVelocity <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
                else if ((this.x + this.XSIZE >= block.x && this.x + this.XSIZE <= block.x + block.SIZE) || (this.x + this.XSIZE + this.xVelocity >= block.x && this.x + this.XSIZE + this.xVelocity <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
            }
            //left block
            if (this.x + this.XSIZE <= block.x && this.x + this.XSIZE + this.xVelocity >= block.x) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE) || (this.y + this.yVelocity >= block.y && this.y + this.yVelocity <= block.y + block.SIZE)) {
                    this.xVelocity = 0;
                    this.x = block.x - this.XSIZE - GUARD;
                    leftCollision = true;
                }
                else if ((this.y + this.YSIZE >= block.y && this.y + this.YSIZE <= block.y + block.SIZE) || (this.y + this.YSIZE + this.yVelocity >= block.y && this.y + this.YSIZE + this.yVelocity <= block.y + block.SIZE)) {
                    this.xVelocity = 0;
                    this.x = block.x - this.XSIZE - GUARD;
                    leftCollision = true;
                }
            }
            //right block
            if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE) || (this.y + this.yVelocity >= block.y && this.y + this.yVelocity <= block.y + block.SIZE)) {
                    this.xVelocity = 0;
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
                else if ((this.y + this.YSIZE >= block.y && this.y + this.YSIZE + this.yVelocity <= block.y + block.SIZE) || (this.y + this.YSIZE + this.yVelocity >= block.y && this.y + this.YSIZE <= block.y + block.SIZE)) {
                    this.xVelocity = 0;
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
            }
        }
        if (topCollision) this.canJump = true;
        else this.canJump = false;
        if (!keydown) this.xVelocity *= this.airResistance
    }
    
    this.checkEnemyCollision = function () {
        for (let enemy of enemies) {
            if (this.x >= enemy.x && this.x <= enemy.x + enemy.SIZE) { //top left corner of sprite
                if (this.y >= enemy.y && this.y <= enemy.y + enemy.SIZE) this.dead = true;
            }
            else if (this.x >= enemy.x && this.x <= enemy.x + enemy.SIZE) { //bottom left corner
                if (this.y + this.YSIZE >= enemy.y && this.y + this.YSIZE <= enemy.y + enemy.SIZE) this.dead = true;
            }
            else if (this.x + this.XSIZE >= enemy.x && this.x + this.XSIZE <= enemy.x + enemy.SIZE) { //bottom right
                if (this.y + this.YSIZE >= enemy.y && this.y + this.YSIZE <= enemy.y + enemy.SIZE) this.dead = true;
            }
            else if (this.x + this.XSIZE >= enemy.x && this.x + this.XSIZE <= enemy.x + enemy.SIZE) {
                if (this.y >= enemy.y && this.y <= enemy.y + enemy.SIZE) this.dead = true;
            }
        }
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        this.xVelocity += 0;
        this.yVelocity += gravity;
        
        this.checkBoxCollision();
        this.checkEnemyCollision();
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        
        this.draw();
    }
}