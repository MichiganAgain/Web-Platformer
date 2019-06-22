function Camera () {
    this.xOffset;
    this.yOffset;
    
    this.update = function () {
        this.xOffset = (canvas.width / 2) - sprite.x;
        this.yOffset = (canvas.height / 2) - sprite.y;
    }
}