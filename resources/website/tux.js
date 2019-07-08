function Tux (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 50;
    this.img = document.getElementById("tux");

    function draw () {
        context.drawImage(this.img, this.x + camera.xOffset, this.y + camera.yOffset);
    }

    function update () {
        draw();
    }
}