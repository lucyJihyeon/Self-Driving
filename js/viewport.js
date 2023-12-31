class Viewport  {
    //Initialize the Viewport instance with a canvas and sets the initial zoom level
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.zoom = 1;
        //offset of the view
        this.offset = new Point(0, 0);
        //object to manage dragging information
        this.drag = {
            start: new Point(0,0),
            end: new Point(0,0),
            offset: new Point(0,0),
            active: false
        };
        //Add evnet listeners for user interactions
        this.#addEventListeners();
    }

    //Get the coordinate of the mouse postion and apply the zoom scale.
    getMouse(evt)   {
        return new Point(
            evt.offsetX * this.zoom,
            evt.offsetY * this.zoom
        )
    }
    //Function to comopute the current offset by adding the initial offset to the offset change due to dragging
    getOffset() {
        return add(this.offset, this.drag.offset);
    }
    //private method to add event listener for mousewheel action
    #addEventListeners()    {
        this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
    }

    //private method to handle mouse wheel to adjust the zoom level
    #handleMouseWheel(evt)  {
        //determine the direction of the mouse wheel scroll
        // pos = scrolling down. neg = scrolling up 
        const dir = Math.sign(evt.deltaY);
        //define the amount by which the zoom level changes per scroll step.
        const step = 0.1;
        this.zoom += dir * step;
        //Constrain the zoom level to be within a specified range (1 to 5)
        this.zoom = Math.max(1, Math.min(5, this.zoom));
        console.log(this.zoom);
    }
     //handle mouse down to initiate dragging
    #handleMouseDown(evt)   {
        if (evt.button == 1)    {//middle button
            //check on the dragging starting point 
            this.drag.start = this.getMouse(evt);
            this.drag.active = true;
        }
    }
    //handle mouse down to initiate dragging
    #handleMouseMove(evt)   {
        if (this.drag.active)   {
            //check on the dragging ending point
            this.drag.end = this.getMouse(evt);
            //calculate the vector between the two points
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }
    //handle mouse u to end dragging
    #handleMouseUp(evt) {
        if (this.drag.active)   {
            //update the offset based on accumulated dragging offset
            this.offset = add(this.offset, this.drag.offset);
            //reset the dragging state
            this.drag = {
                start : new Point(0,0),
                end: new Point(0,0),
                offset: new Point(0,0),
                active: false
            };
        }
    }

}
