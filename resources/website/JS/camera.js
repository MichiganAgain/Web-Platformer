function Camera () {
    this.xOffset;
    this.yOffset;
    
    this.update = function () {
        this.xOffset = (canvas.width / 2) - sprite.x;
        this.yOffset = (canvas.height / 2) - sprite.y;
        this.xOffset += Math.random() * 5;
        this.yOffset += Math.random() * 5;
    }
}