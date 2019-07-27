function Tux (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 100;
    this.img = document.getElementById("tux");

    this.checkSpriteCollision = function () {
        if ((sprite.x + sprite.XSIZE >= this.x && sprite.x <= this.x) || (sprite.x))
    }

    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }

    this.update = function () {
        this.checkSpriteCollision();
        this.draw();
    }
}