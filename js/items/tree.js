class Tree {
    constructor(center, size, heightCoef = 0.3)   {
        this.center = center;
        //size of the base 
        this.size = size;
        this.heightCoef = heightCoef;
    }
    draw(ctx, viewPoint)   {
        const diff = subtract(this.center, viewPoint);
        this.center.draw(ctx, { size: this.size, color: "green"});
        //offset 
        const top = add(this.center, scale(diff ,this.heightCoef));
        new Segment(this.center, top).draw(ctx);
    }
}