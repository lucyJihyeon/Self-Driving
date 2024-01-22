class GraphEditor {
  //takes two parameters, viewport and graph
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    //reference to the canvas in the index.html
    this.ctx = this.canvas.getContext("2d");
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;
    //Create a private event listener
    this.#addEventListeners();
  }

  #addEventListeners() {
    //added an event listener inside of the canvas when the mouse is being pressed down
    //creates a new function where 'this' inside #handleMouseDown refers to the GraphEditor's this
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    //add an eventlistener when the mouse moves
    this.canvas.addEventListener("mousemove", this.#handlerMouseMove.bind(this));
    //prevent the menu to appear
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    //When the mouse is not being pressed down, the point can't drag.
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
  }
  #handleMouseDown(evt) {
    if (evt.button == 2) {
      //right click
      //if right click while hovering over a point, unselect the point rather than removing the hovering point.
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }
    if (evt.button == 0) {
      //left click

      if (this.hovered) {
        //When select a point, create a segment between the previously hovered point.
        this.#select(this.hovered);
        this.selected = this.hovered;
        this.dragging = true;
        return;
      }
      //and add a point to the position
      this.graph.addPoint(this.mouse);
      //Also add a segment between the points
      this.#select(this.mouse);
      this.selected = this.mouse;
      this.hovered = this.mouse;
    }
  }
  #handlerMouseMove(evt)    {
    //it takes the x and y coordinate of the mouse pointer
    this.mouse = this.viewport.getMouse(evt, true);
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
    //when the mouse is being pressed down at the point, they can drag.
    if (this.dragging == true) {
      //mouse's x and y coordinates becomes the point's coordinated.
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }
  #select(point) {
    if (this.selected) {
      //try adding a segment first to avoid duplicated segments.
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
  }

  //private method to remove a point when right click
  #removePoint(point) {
    this.graph.removePoint(point);
    //set up the hovered/selected var back to null to prevent keeping the selected/hovered point
    this.hovered = null;
    //point only goes back to null when the selected point is targetted to be removed.
    if (this.selected == point) {
      this.selected = null;
    }
  }
  //dispose graph and set the selected and hovered back to the default
  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  //Draw a new graph to the canvas
  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      //if the mouse cursor hovers over an existing point, make display the segment between the selected point and the hovered point.
      const intent = this.hovered ? this.hovered : this.mouse;
      //Create a segment between the selected point and the mouse to visually represent where the segment will be.
      //change it to dashed line (3px 3px)
      new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
