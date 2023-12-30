//Creating Point class
class Point {
    //point takes two parameters; x and  y
    constructor(x, y)   {
        this.x = x;
        this.y = y;
    }
    //check if the point position already exists. 
    equals(point)   {
        return this.x == point.x && this.y == point.y
    }
    //Draw the point on to the canvas content with a style(in an object)
    //Point will be appeared as a Circle
    draw(ctx, { size = 18, color = "black", outline = false} = {})   {
        //radius is half the size of the "size"
        const rad = size / 2;
        ctx.beginPath();
        //fill the circle with the assigned color
        ctx.fillstyle = color;
        //use arc method at the certain positioin with the radicus in a circle (pi * 2)
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        //fill up the canvas context
        ctx.fill();
        //if outline is true, create a new style
        if (outline)    {
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            //make a smaller radius 
            ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}