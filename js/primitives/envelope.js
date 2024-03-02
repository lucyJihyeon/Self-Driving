class Envelope {
    constructor(skeleton, width)    {
        //skeleton = segments between two points 
        this.skeleton = skeleton;
        //using private function generatePolygon with the width in the arguments
        this.poly = this.#generatePolygon(width);
    }
    #generatePolygon(width) {
        //deconstructing skeleton to get the points value 
        const { p1, p2 } = this.skeleton;
        const radius = width / 2;
        //subtract to get the distance between the two points
        const alpha = angle(subtract(p1, p2));
        //get the offset 90 degrees (clockwise, counterclockwise)
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;
        //getting the points all around the point1 and point2 
        const p1_ccw = translate(p1, alpha_ccw, radius);
        const p2_ccw = translate(p2, alpha_ccw, radius);
        const p2_cw = translate(p2, alpha_cw, radius);
        const p1_cw = translate(p1, alpha_cw, radius);
        console.log();
        return new Polygon([p1_ccw, p2_ccw, p2_cw, p1_cw]);
    }
    draw(ctx)   {
        this.poly.draw(ctx);
    }
}