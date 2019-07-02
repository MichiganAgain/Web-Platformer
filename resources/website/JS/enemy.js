function Enemy (x, y) {
    this.x = x;
    this.y = y;
    this.xMovementVelocity = 2;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.jumpForce = 10;
    this.img = document.getElementById("enemy");
    this.SIZE = 49;
    this.maxHealth = 100;
    this.health = 100;
    this.myHealthBar = new healthBar(this);
    this.dead = false;
    this.canJump = false;

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
            //top block
            if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {
                if (this.x >= block.x && this.x <= block.x + block.SIZE) {
                    this.y = block.y - this.SIZE - GUARD;
                    //this.yVelocity *= -block.bounce;
                    this.yVelocity = 0;
                    this.topCollision = true;
                }
                else if (this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE) {
                    //this.yVelocity *= -block.bounce;
                    this.yVelocity = 0;
                    this.y = block.y - this.SIZE - GUARD;
                    this.topCollision = true;
                }
            }
            //bottom block
            if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    this.bottomCollision = true;
                }
                else if ((this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    this.bottomCollision = true;
                }
            }
            //left block
            if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    this.xVelocity = 0;
                    this.leftCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    this.xVelocity = 0;
                    this.leftCollision = true;
                }
            }
            //right block
            if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    this.xVelocity = 0;
                    this.rightCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    this.xVelocity = 0;
                    this.rightCollision = true;
                }
            }
        }
    }
    
    this.checkSnowballCollision = function () {
        for (let snowball of snowballs) {
            if (snowball.x >= this.x && snowball.x <= this.x + this.SIZE) { //top left of snowball
                if (snowball.y >= this.y && snowball.y <= this.y + this.SIZE) {
                    this.health -= snowball.damage;
                    snowball.dead = true;
                    return;
                }
            }
            if (snowball.x >= this.x && snowball.x <= this.x + this.SIZE) { //bottom left of snowball
                if (snowball.y + snowball.SIZE >= this.y && snowball.y + snowball.SIZE <= this.y + this.SIZE) {
                    this.health -= snowball.damage;
                    snowball.dead = true;
                    return;
                }
            }
            if (snowball.x + snowball.SIZE >= this.x && snowball.x + snowball.SIZE <= this.x + this.SIZE) { //bottom right of snowball
                if (snowball.y + snowball.SIZE >= this.y && snowball.y + snowball.SIZE <= this.y + this.SIZE) {
                    this.health -= snowball.damage;
                    snowball.dead = true;
                    return;
                }
            }
            if (snowball.x + snowball.SIZE >= this.x && snowball.x + snowball.SIZE <= this.x + this.SIZE) { //top right of snowball
                if (snowball.y >= this.y && snowball.y <= this.y + this.SIZE) {
                    this.health -= snowball.damage;
                    snowball.dead = true;
                    return;
                }
            }
        }
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        //this.xVelocity *= this.airResistance;
        this.yVelocity += gravity;

        /////movement stuff//////////

        if (this.topCollision) this.canJump = true;
        else this.canJump = false;

        if (sprite.x < this.x) this.xVelocity = -this.xMovementVelocity;
        else if (sprite.x > this.x) this.xVelocity = this.xMovementVelocity;
        if ((sprite.y < this.y && this.canJump == true) || (this.leftCollision && sprite.x > this.x && this.topCollision) || (this.rightCollision && sprite.x < this.x && this.topCollision)) {
            this.yVelocity = -this.jumpForce;
            this.canJump = false;
        }
        this.checkBoxCollision();

        //////////////////////////////////////////////////////////////////////////

        this.checkSnowballCollision()
        if (this.health <= 0) this.dead = true;

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        this.draw();
        this.myHealthBar.update();
    }
}