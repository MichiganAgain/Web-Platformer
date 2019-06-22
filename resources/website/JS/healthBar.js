function healthBar (parent) {
    this.parent = parent;
    
    this.draw = function () {
        context.fillStyle = "#FF0000";
        context.fillRect(parent.x + camera.xOffset, (parent.y - 10) + camera.yOffset, parent.SIZE * (parent.health / parent.maxHealth), 5);
    }
    
    this.update = function () {
        this.draw();
    }
}