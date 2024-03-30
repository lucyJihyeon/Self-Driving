class StopEditor {
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouse = null;
    this.intent = null;
  }
  //function to enable the event listeners to be able to draw the graph
  enable() {
    //Create a private event listener
    this.#addEventListeners();
  }
  //function to disalbe the event listeners to be able to draw the graph
  disable() {
    this.#removeEventListeners();

  }

  #addEventListeners() {
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handlerMouseMove.bind(this);
    this.boundContextMenu = (evt) => evt.preventDefault();
    //added an event listener inside of the canvas when the mouse is being pressed down
    //creates a new function where 'this' inside #handleMouseDown refers to the GraphEditor's this
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    //add an eventlistener when the mouse moves
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    //When the mouse is not being pressed down, the point can't drag.
    //prevent the menu to appear
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  //removing event listeners
  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }

  #handlerMouseMove(evt)    {
    //it takes the x and y coordinate of the mouse pointer
    this.mouse = this.viewport.getMouse(evt, true);
    //find the nearest segment around the mouse 
    const seg = getNearestSegment(
        this.mouse, 
        this.world.graph.segments,
         10 * this.viewport.zoom);
        if (seg)    {
            const proj = seg.projectPoint(this.mouse);
            //check if the projection's offset is within the segment [0,1]
            if(proj.offset >= 0 && proj.offset <= 1) {
                this.intent = proj.point;
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
  }
  #handleMouseDown(evt) {

  }
  display() {
    if(this.intent) {
        this.intent.draw(this.ctx);
    }
  }
}
