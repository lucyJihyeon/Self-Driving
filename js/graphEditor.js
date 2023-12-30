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
          return;
        }
      }
      if (evt.button == 0) {
        //left click
        //it takes the x and y coordinate of the mouse pointer
        const mouse = new Point(evt.offsetX, evt.offsetY);
        if (this.hovered) {
          this.selected = this.hovered;
          this.dragging = true;
          return;
        }
        //and add a point to the position
        this.graph.addPoint(mouse);
        this.selected = mouse;
        this.hovered = mouse;
      }
    });
    //add an eventlistener when the mouse moves
    this.canvas.addEventListener("mousemove", (evt) => {
      //it takes the x and y coordinate of the mouse pointer
      const mouse = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(mouse, this.graph.points, 10);
      //when the mouse is being pressed down at the point, they can drag.
      if (this.dragging == true)    {
        //mouse's x and y coordinates becomes the point's coordinated. 
        this.selected.x = mouse.x;
        this.selected.y = mouse.y;
      }
    });
    //prevent the menu to appear
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    //When the mouse is not being pressed down, the point can't drag.
    this.canvas.addEventListener("mouseup", () => this.dragging = false);
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
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
