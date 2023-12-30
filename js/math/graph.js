class Graph {
  //graph takes two parameters, points and segments
  //initilize an empty array to create an empty graph
  constructor(points = [], segments = []) {
    //store the parameters as attributes
    this.points = points;
    this.segments = segments;
  }
  //Functioin to generate a new random point
  addPoint(point) {
    this.points.push(point);
  }
  //Loop through all of the points to check if the new generated point already exists,
  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }
  //if the newly generated point doesn't already exist, then add the point.
  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }
  //Function to add a segment 
  addSegment(seg)   {
    this.segments.push(seg);
  }
  //loop through the segments array to check if there is any existing segment 
  containsSegment(seg)  {
    return this.segments.find((s) => s.equals(seg));
  }
  //If there is not exisitng segment, add the segment.
  tryAddSegment(seg)    {
    if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
        this.addSegment(seg);
        return true;
    }
    return false;
  }
  //Function to remove a segment at a certain index by 1 
  removeSegment(seg)    {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }
  //draw takes canvas context as a patameter as we will draw on the canvas
  draw(ctx) {
    //loop through all of the segments and draw them
    for (const seg of this.segments) {
      seg.draw(ctx);
    }
    //loop through all of the points and draw them on top of the segments
    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}
