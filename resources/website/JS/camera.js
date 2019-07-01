function Camera () {
    this.xOffset = 0;
    this.yOffset = 0;
    this.shake = false;
    
    this.update = function () {
        this.xOffset = (canvas.width / 2) - sprite.x;
        this.yOffset = (canvas.height / 2) - sprite.y;
        if (this.shake) {
            this.xOffset += Math.random() * 5;
            this.yOffset += Math.random() * 5;
        }
    }
}