class GraphEditor   {
    //takes two parameters, canvas and graph
    constructor(canvas, graph)  {
        this.canvas = canvas;
        this.graph = graph;
        //reference to the canvas in the index.html
        this.ctx = this.canvas.getContext('2d');
        //Create a private event listener
        this.#addEventListeners();
    }

    #addEventListeners()    {
        //added an event listener inside of the canvas when the mouse is being pressed down
        this.canvas.addEventListener("mousedown", (evt) => {
            //it takes the x and y coordinate of the mouse pointer
            const mouse = new Point(evt.offsetX, evt.offsetY);
            //and add a point to the position
            this.graph.addPoint(mouse);
        })
    }
    //Draw a new graph to the canvas
    display()   {
        this.graph.draw(this.ctx);
    }
}