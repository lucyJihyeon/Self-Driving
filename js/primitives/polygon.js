class Polygon {
    constructor(points) {
        this.points = points;
    }
    //draw the road with some defualt style values 
    draw(ctx, { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3)" } = {}) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        //starting point, the first item in the points array 
        ctx.moveTo(this.points[0].x, this.points[0].y);
        //from the second point to the end of the point, draw a line.
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        //close back to the itinial point
        ctx.closePath();
        ctx.fill();
        ctx.stoke();

    }
}