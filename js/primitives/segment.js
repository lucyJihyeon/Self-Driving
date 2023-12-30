//Create Segment class
class Segment {
    //Segment takes two parameters (p1, p2)
    //points to be connected from 
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    //check if the points for segment already has their own segment 
    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2);
    }
    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }
    //draw the segment on to the canvas with a style
    draw(ctx, {width = 2, color = "black", dash = []} = {})   {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        //move to the p1 and draw line from the p1 to p2
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        //stroke
        ctx.stroke();
        //set the dash line back to empty (default)
        ctx.setLineDash([]);
    }
}