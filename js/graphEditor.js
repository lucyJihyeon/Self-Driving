class GraphEditor   {
    //takes two parameters, canvas and graph
    constructor(canvas, graph)  {
        this.canvas = canvas;
        this.graph = graph;
        //reference to the canvas in the index.html
        this.ctx = this.canvas.getContext('2d');
        this.selected = null;
        this.hovered = null;
        //Create a private event listener
        this.#addEventListeners();
    }

    #addEventListeners()    {
        //added an event listener inside of the canvas when the mouse is being pressed down
        this.canvas.addEventListener("mousedown", (evt) => {
            //it takes the x and y coordinate of the mouse pointer
            const mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(mouse, this.graph.points, 10);
            if (this.hovered)   {
                this.selected = this.hovered;
                return;
            }
            //and add a point to the position
            this.graph.addPoint(mouse);
            this.selected = mouse;
        });
        //add an eventlistener when the mouse moves
        this.canvas.addEventListener("mousemove", (evt) => {
            //it takes the x and y coordinate of the mouse pointer
            const mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(mouse, this.graph.points, 10);
        });
    }
    //Draw a new graph to the canvas
    display()   {
        this.graph.draw(this.ctx);
        if (this.hovered)  {
            this.hovered.draw(this.ctx, {fill: true});
        }
        if (this.selected)  {
            this.selected.draw(this.ctx, {outline: true});
        }
        
    }
}