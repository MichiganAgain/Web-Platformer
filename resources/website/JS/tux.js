function Tux (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 100;
    this.img = document.getElementById("tux");

    this.checkSpriteCollision = function () {
        if (sprite.x + sprite.XSIZE >= this.x && sprite.x <= this.x + this.SIZE) {
            if (sprite.y + sprite.YSIZE >= this.y && sprite.y <= this.y + this.SIZE) {
                return true;
            }
        }
    }

    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }

    this.update = function () {
        if (this.checkSpriteCollision()) completedWorld();
        this.draw();
    }
}