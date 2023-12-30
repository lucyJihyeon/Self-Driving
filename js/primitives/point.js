//Creating Point class
class Point {
    //point takes two parameters; x and  y
    constructor(x, y)   {
        this.x = x;
        this.y = y;
    }
    //Draw the point on to the canvas content with a style
    //Point will be appeared as a Circle
    draw(ctx, size = 18, color = "black")   {
        //radius is half the size of the "size"
        const rad = size / 2;
        ctx.beginPath();
        //fill the circle with the assigned color
        ctx.fillstyle = color;
        //use arc method at the certain positioin with the radicus in a circle (pi * 2)
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        //fill up the canvas context
        ctx.fill();
    }
}