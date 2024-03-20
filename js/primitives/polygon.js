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

//static function determine which segments to keep and which to distroy 
static union(polys) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    //loop through all of the polys 
    for ( let i =0; i < polys.length; i++)  {
        //and their segments that forms the poly
        for (const seg of polys[i].segments)    {
            let keep = true;
            //loop through the poly 
            for ( let j = 0; j < polys.length; j++) {
                //except for when the seg is the one that forms the poly
                if (i != j) {
                    //check if the polygon contains the segment.
                    if (polys[j].containsSegment(seg))  {
                        //if it does, don't keep it 
                        keep = false;
                        break;
                    }
                }
            }
            if (keep)   {
                keptSegments.push(seg);
            }
        }
    }
    return keptSegments;
}


  //static function to break multiple polygons when they intersect
  static multiBreak(polys) {
    // i = current poly j = the very nest poly
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  //static function to find out the intersection between two polygons around segments
  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
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
          //keeping the refenrece of the point2 that makes the intersection
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          //from the intersecting point, add a new segment
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }
  //function to calculate min value of the distance between point and segment 
  distanceToPoint(point)  {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }


  //method to check if the segments in the polygon intersect 
  intersectPoly(poly) {
    for (let s1 of this.segments) {
      for ( let s2 of poly.segments)  {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(seg)  {
    const midpoint = average(seg.p1, seg.p2);
    return this.containsPoint(midpoint);
  }

  containsPoint(point)  {
    const outerPoint = new Point(-1000, -1000);
    let intersectionCount =0;
    for (const seg of this.segments)    {
        const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
        if (int)    {
            intersectionCount++;
        }
    }
    //odd number = going outside 
    return intersectionCount % 2 == 1;
  }


  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), width: 5 });
    }
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
