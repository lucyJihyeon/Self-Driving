class Stop {
    constructor(center, directionVector, width, height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        //calculate the support segment that represent the physical structure for the stop sign (height)
        this.support = new Segment (
            //the segment that made from the center(projection) of the nearest segment and directionvector that aligns with the center of the road segment polygon 
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2),
        );
        //wrap around the support segment to create a polygon 
        this.poly = new Envelope(this.support, width, 0).poly;

        
    }

    draw(ctx)   {
        this.poly.draw(ctx);
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1,3);
        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("STOP", 0, 1);
        ctx.font = "bold " + this.height * 0.3 + "px Arial"
        ctx.restore();
    }
}