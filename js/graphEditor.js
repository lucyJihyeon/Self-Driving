class GraphEditor {
  //takes two parameters, canvas and graph
  constructor(canvas, graph) {
    this.canvas = canvas;
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
    this.canvas.addEventListener("mousedown", (evt) => {
      if (evt.button == 2) {
        //right click
        if (this.hovered) {
          this.#removePoint(this.hovered);
        }
        //When right clicked, and the pointer not hovering over an existin point, all of the existing points' selected var goes back to null.
        else {
          this.selected = null;
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
    });
    //add an eventlistener when the mouse moves
    this.canvas.addEventListener("mousemove", (evt) => {
      //it takes the x and y coordinate of the mouse pointer
      this.mouse = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
      //when the mouse is being pressed down at the point, they can drag.
      if (this.dragging == true) {
        //mouse's x and y coordinates becomes the point's coordinated.
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    });
    //prevent the menu to appear
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    //When the mouse is not being pressed down, the point can't drag.
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
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

  //Draw a new graph to the canvas
  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      //Create a segment between the selected point and the mouse to visually represent where the segment will be.
      new Segment(this.selected, this.mouse).draw(ctx);
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
