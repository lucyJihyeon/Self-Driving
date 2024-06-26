class Viewport {
  //Initialize the Viewport instance with a canvas and sets the initial zoom level
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.zoom = 1;
    //Keep the offset in the center of the canvas
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    //offset of the view
    //get a new point whose coordinates are the opposite of the this.center
    this.offset = scale(this.center, -1);
    //object to manage dragging information
    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };
    //Add evnet listeners for user interactions
    this.#addEventListeners();
  }

  //dynamically resetting the canvas 
  reset() {
    //restore the saved state to start each frame with a clean slate
    this.ctx.restore();
    //regenerate everything everytime when the mouse clicks
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //save the current state of the canvas context
    this.ctx.save();
    //Keep the offset in the center of the viewport
    this.ctx.translate(this.center.x, this.center.y);
    //scaling down the content by a factor of 1/viewport.zoom
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    //Computing the current offset that changes dynalically as the mouse drags.
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  //Get the coordinate of the mouse postion and apply the zoom scale.
  getMouse(evt, subtractDragOffset = false) {
    const p = new Point(
      //subtract x and y of the center from the mouse x and y to translate the coordinates with respect to the center
      (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
      (evt.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    //when the mouse is dragging a point, subtract the offset from the current point. if not, return p
    return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }
  //Function to comopute the current offset by adding the initial offset to the offset change due to dragging
  getOffset() {
    return add(this.offset, this.drag.offset);
  }
  //private method to add event listener for mousewheel action
  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
  }

  //private method to handle mouse wheel to adjust the zoom level
  #handleMouseWheel(evt) {
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
  #handleMouseDown(evt) {
    if (evt.button == 1) {
      //middle button
      //check on the dragging starting point
      this.drag.start = this.getMouse(evt);
      this.drag.active = true;
    }
  }
  //handle mouse down to initiate dragging
  #handleMouseMove(evt) {
    if (this.drag.active) {
      //check on the dragging ending point
      this.drag.end = this.getMouse(evt);
      //calculate the vector between the two points
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }
  //handle mouse u to end dragging
  #handleMouseUp(evt) {
    if (this.drag.active) {
      //update the offset based on accumulated dragging offset
      this.offset = add(this.offset, this.drag.offset);
      //reset the dragging state
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }
}
