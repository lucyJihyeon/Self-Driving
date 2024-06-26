class MarkingEditor {
  constructor(viewport, world, targetSegments) {
    this.viewport = viewport;
    this.world = world;
    this.targetSegments = targetSegments;
    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouse = null;
    this.intent = null;

    this.markings = world.markings;
  }

  //to be overwritten by the subclasses 
  createMarking(center, directionVector)  {
    return center;
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
        this.targetSegments,
         10 * this.viewport.zoom);
        if (seg)    {
            const proj = seg.projectPoint(this.mouse);
            //check if the projection's offset is within the segment [0,1]
            if(proj.offset >= 0 && proj.offset <= 1) {
                //if it is, create a new stop object representing a stop at the projected point. 
                this.intent = this.createMarking(
                    //center of the stop, direction vector of the segment, with of the road, and height of the stop (half of the road width)
                    proj.point,
                    seg.directionVector()
                )
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
  }
  #handleMouseDown(evt) {
    //left click
    if (evt.button == 0)  {
      if(this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }
    //right click
    if (evt.button == 2)  {
      console.log("right clicked!");
      for (let i = 0; i < this.markings.length ; i++) {
        const poly = this.markings[i].poly;
        if (poly.containsPoint(this.mouse)) {
          this.markings.splice(i, 1);
          return 
        }
      }
    }
  }
  display() {
    if(this.intent) {
        this.intent.draw(this.ctx);
    }
  }
}
