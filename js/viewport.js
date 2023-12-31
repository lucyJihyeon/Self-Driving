class Viewport  {
    //Initialize the Viewport instance with a canvas and sets the initial zoom level
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;

        this.#addEventListeners();
    }
    //private method to add event listener for mousewheel action
    #addEventListeners()    {
        this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
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
}