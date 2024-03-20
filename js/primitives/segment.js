//Create Segment class
class Segment {
  //Segment takes two parameters (p1, p2)
  //points to be connected from
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
  //check the distance between point 1 and point2
  length() {
    return distance(this.p1, this.p2);
  }
  //function to calculate the direction of a vector
  directionVector() {
    return normalize(subtract(this.p2, this.p1));
  }
  //check if the points for segment already has their own segment
  equals(seg) {
    return this.includes(seg.p1) && this.includes(seg.p2);
  }
  includes(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  //function to calculate the distance to the point from a segment
  distanceToPoint(point) {
    const proj = this.projectPoint(point);
    //it checks if the projection lies within the line segment. 
    //if it does, calculate the distance from the point and the projection point. 
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }
    //if the point is not within the segment, calculate the distance from the point to the each end of the segment 
    const distTop1 = distance(point, this.p1);
    const distTop2 = distance(point, this.p2);
    return Math.min(distTop1, distTop2);
  }

  //function to calculate the projection of a point onto a line segment 
  projectPoint(point) {
    //vector "a" from the starting point of the line segment to the point
    const a = subtract(point, this.p1);
    //vector "b" from the ending point of the line segment to the point
    const b = subtract(this.p2, this.p2);
    //normalize vector "b"
    const normB = normalize(b);
    //calculate the sacler by using dot product 
    const scaler = dot(a, normB);
    //calculate the projection using scale method and offset(t value) by dive the scaler by the magnitude of the vector "b"
    const proj = {
      point: addEventListener(this.p1, scale(normB, scaler)),
      offset: scaler / magnitude(b),
    };
    return proj;
  }

  //draw the segment on to the canvas with a style
  draw(ctx, { width = 2, color = "black", dash = [] } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    //move to the p1 and draw line from the p1 to p2
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    //stroke
    ctx.stroke();
    //set the dash line back to empty (default)
    ctx.setLineDash([]);
  }
}
