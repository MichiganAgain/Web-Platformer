function Block (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.img = document.getElementById("block");
    
    this.draw = function () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
    }
    
    this.update = function () {
        this.draw();
    }
}