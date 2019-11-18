function Camera () {
    this.xOffset = (canvas.width / 2) - sprite.x;
    this.yOffset = (canvas.height / 2) - sprite.y;
    this.shake = false;
    this.frames = 0; // how many more frames to shake for but I can't be bothered to add this yet :P
    
    this.update = function () {
        this.xOffset = (canvas.width / 2) - sprite.x;
        this.yOffset = (canvas.height / 2) - sprite.y;
        if (this.shake) {
            this.xOffset += Math.random() * 5;
            this.yOffset += Math.random() * 5;
        }
    }
}