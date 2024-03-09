class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    //for each point,
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(
        //make a segment between the previous point and the current point
        //current point is i % points.length because when the i is points.length (last item), we want to use the remainder to avoid an error
        //as we want to loop back to the first point in the array to close the polygon.
        new Segment(points[i - 1], points[i % points.length])
      );
    }
  }
  //static function to find out the intersection between two polygons around segments
  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    const intersections = [];
    //for each of the segment in the poly1, check if it has any intersection with the segments in poly2
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const int = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );
        //offset = 1 or 0 means that the intersection doesn't meet at the exact point
        if (int && int.offset != 1 && int.offset != 0) {
          const point = new Point(int.x, int.y);
          intersections.push(point);
        }
      }
    }
    return intersections;
  }

  //draw the road with some defualt style values
  draw(
    ctx,
    { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3)" } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    //starting point, the first item in the points array
    ctx.moveTo(this.points[0].x, this.points[0].y);
    //from the second point to the end of the point, draw a line.
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    //close back to the itinial point
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
