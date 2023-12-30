//Create Segment class
class Segment {
    //Segment takes two parameters (p1, p2)
    //points to be connected from 
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    //draw the segment on to the canvas with a style
    draw(ctx, width = 2, color = "black")   {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        //move to the p1 and draw line from the p1 to p2
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        //stroke
        ctx.stroke();
    }
}