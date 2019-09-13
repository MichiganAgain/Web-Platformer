function Enemy (x, y) {
    this.x = x;
    this.y = y;
    this.xMovementVelocity = 2; //max speed that it can move
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.jumpForce = 10;
    this.img = document.getElementById("enemy");
    this.SIZE = 47; //width and height
    this.maxHealth = 100;
    this.health = 100;
    //this.myHealthBar = new healthBar(this);
    this.dead = false;
    this.canJump = false;
    this.intelligent = false;

    this.topCollision = false;
    this.bottomCollision = false;
    this.leftCollision = false;
    this.rightCollision = false;

    this.checkBoxCollision = function () {
        this.topCollision = false;
        this.bottomCollision = false;
        this.leftCollision = false;
        this.rightCollision = false;

        for (let block of blocks) {
            //top and bottom first
            if (this.x + this.SIZE >= block.x && this.x <= block.x + block.SIZE) {
                if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {
                    this.y = block.y - this.SIZE - GUARD;
                    this.yVelocity *= -block.bounce;
                    this.yVelocity = 0;
                    this.topCollision = true;
                }
                else if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    this.bottomCollision = true;
                }
            }
            //now for left and right
            if (this.y + this.SIZE >= block.y && this.y <= block.y + block.SIZE) {
                if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {
                    this.x = block.x - this.SIZE - GUARD;
                    this.xVelocity = 0;
                    this.leftCollision = true;
                }
                else if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                    this.x = block.x + block.SIZE + GUARD;
                    this.xVelocity = 0;
                    this.rightCollision = true;
                }
            }
        }
    }

    this.checkSnowballCollision = function () {
        for (let snowball of snowballs) {
            if (this.y + this.SIZE >= snowball.y && this.y <= snowball.y + snowball.SIZE) { 
                this.health -= snowball.damage;
                snowball.dead = true;
            }
            if (this.x + this.SIZE >= snowball.x && this.x <= snowball.x + snowball.SIZE) {
            }
        }
    }

    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        this.xVelocity += xGravity;
        this.yVelocity += yGravity;

        /////movement stuff//////////

        if (this.topCollision) this.canJump = true;
        else this.canJump = false;

        if (sprite.x < this.x) this.xVelocity = -this.xMovementVelocity;
        else if (sprite.x > this.x) this.xVelocity = this.xMovementVelocity;
        if ((this.leftCollision && sprite.x > this.x && this.topCollision) || (this.rightCollision && sprite.x < this.x && this.topCollision)) {
            this.yVelocity = -this.jumpForce;
            this.canJump = false;
        }
        if (Math.abs(sprite.xVelocity) < 0.5 && (Math.abs(this.x - sprite.x) < 1)) this.xVelocity = 0;
        this.checkBoxCollision();

        //////////////////////////////////////////////////////////////////////////

        this.checkSnowballCollision();
        if (this.y < topLimit || this.y > bottomLimit || this.x < leftLimit || this.x > rightLimit) this.dead = true;
        if (this.health <= 0) this.dead = true;

        this.x += this.xVelocity; // move x, y after velocities have been adjusted
        this.y += this.yVelocity;

        this.draw();
        //this.myHealthBar.update();
    }
}