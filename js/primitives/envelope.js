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
        const points = [];
        //controlling the angle by adding the points step by step 
        const step = Math.PI / 10;
         //getting the points all around the point1 and point2 starting from alpha_ccw angle to alpha_cw angle
        for (let i = alpha_ccw; i <= alpha_cw; i += step)    {
            points.push(translate(p1, i, radius));
        }
        for (let i = alpha_ccw; i <= alpha_cw; i += step)    {
            //adding 180 degree to the angle b/c point2 is apposite of the point 1 
            points.push(translate(p2, Math.PI + i, radius));
        }
        return new Polygon(points);
    }
    draw(ctx)   {
        this.poly.draw(ctx);
    }
}