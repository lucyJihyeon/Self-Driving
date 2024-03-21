class Tree {
    constructor(center, size)   {
        this.center = center;
        //size of the base 
        this.size = size;
    }
    draw(ctx, viewPoint)   {
        const diff = subtract(this.center, viewPoint);
        this.center.draw(ctx, { size: this.size, color: "green"});
        //offset 
        const top = add(this.center, scale(diff ,0.5));
        new Segment(this.center, top).draw(ctx);
    }
}