class Crossing extends Marking {
    constructor(center, directionVector, width, height) {
       super(center, directionVector, width, height);
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