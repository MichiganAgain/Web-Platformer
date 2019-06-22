function Enemy (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = -2;
    this.yVelocity = 0;
    this.img = document.getElementById("enemy");
    this.SIZE = 49;
    this.maxHealth = 100;
    this.health = 100;
    this.myHealthBar = new healthBar(this);
    this.dead = false;
    
    this.checkBoxCollision = function () {
        var topCollision = false;
        var bottomCollision = false;
        var leftCollision = false;
        var rightCollision = false;
        
        for (let block of blocks) {
            //top block
            if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {
                if (this.x >= block.x && this.x <= block.x + block.SIZE) {
                    this.y = block.y - this.SIZE - GUARD;
                    this.yVelocity = 0;
                    topCollision = true;
                }
                else if (this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE) {
                    this.yVelocity = 0;
                    this.y = block.y - this.SIZE - GUARD;
                    topCollision = true;
                }
            }
            //bottom block
            if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {
                if ((this.x >= block.x && this.x <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
                else if ((this.x + this.SIZE >= block.x && this.x + this.SIZE <= block.x + block.SIZE)) {
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + GUARD;
                    bottomCollision = true;
                }
            }
            //left block
            if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x - this.SIZE - GUARD;
                    leftCollision = true;
                }
            }
            //right block
            if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {
                if ((this.y >= block.y && this.y <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
                else if ((this.y + this.SIZE >= block.y && this.y + this.SIZE <= block.y + block.SIZE)) {
                    this.x = block.x + block.SIZE + GUARD;
                    rightCollision = true;
                }
            }
        }
        if (leftCollision || rightCollision) this.xVelocity *= -1;
    }
    
    this.checkSnowballCollision = function () {
        for (let snowball of snowballs) {
            if (snowball.dead == false) {
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
    }
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }
    
    this.update = function () {
        if (this.dead == false) {
            //this.xVelocity *= this.airResistance;
            this.yVelocity += gravity;

            this.checkBoxCollision();
            this.checkSnowballCollision()
            if (this.health <= 0) this.dead = true;

            this.x += this.xVelocity;
            this.y += this.yVelocity;

            this.draw();
            this.myHealthBar.update();
        }
    }
}