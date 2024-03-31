class Crossing {
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
        //border = 3rd item of the poly's segments which is the top side of the polygon
        //first item = bottom side of the polygon so that the car is aware of both of the borders 
        this.border = [this.poly.segments[0], this.poly.segments[2]];
    }

    draw(ctx)   {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        )      
        line.draw(ctx, {
            width: this.height,
            color: "white",
            dash: [11,11]
        });
        
    }
}