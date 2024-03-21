//Function to get the nearest point
//it takes three parameter loc(location), points, and threshold
function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
  //min distance that will be selected when hovered
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;
  //loop through all of the point in the points array
  for (const point of points) {
    //calculate the distance between the point and the location
    const dist = distance(point, loc);
    //if the distance is less than the min distance and the threshold, return the point.
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }
  return nearest;
}
//function to calculate the distance of the two points
function distance(p1, p2) {
  //using a pythagorean theory
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
//function to calculate the average point(mid point) between two points
function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}
//function to calculate the dot product 
function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}
//function to add/subtract two points and make a new point recarding to it
function add(p1, p2) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}
function subtract(p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}
//Function to scale the coordinates of the point by a scaler value
function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}
//function to normalize a point by reversing a point with its magnitude
function normalize(p) {
  return scale(p, 1 / magnitude(p));
}
//function to calculate the magnitude of a point
function magnitude(p) {
  return Math.hypot(p.x, p.y);
}
//Functino to calculate the new position of a point after applying a translation (movement) in a specific direction and distance.
function translate(loc, angle, offset) {
  return new Point(
    //angle: The angle at which the translation will occur, measured in radians from the positive x-axis using cosine.
    loc.x + Math.cos(angle) * offset,
    //offset: The distance by which the point will be translated in the specified direction.
    loc.y + Math.sin(angle) * offset
  );
}
//returns the arctangent of the quotient of its arguments, as a numeric value between PI and -PI radians.
//represents the counterclockwise angle in radians between the positive X axis and the point (x, y).
function angle(p) {
  return Math.atan2(p.y, p.x);
}

//function to get an intersection point between points A,B,C, and D
function getIntersection(A, B, C, D) {
  // value t = interpolation parameter that determines the position of the interpolated value within [0,1]
  // value u = Second line segment's interpolation parameter that identify where along this second line segment the intersection point falls.
  //t top = t denominator bottom = t and u numerator (they have the same numerator)
  // bottom = checking for parallel lines; if bottom is 0, the line segments are parallel (or collinear) and do not intersect in a single point.
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  const eps = 0.001;
  if (Math.abs(bottom) > eps) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}
//linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

//linear interpolation in 2D where the point A represents the top of the cynlinder and B represents the bottom of the cynlinder 
function lerp2D(A,B,t)  {
    return new Point(lerp(A.x,B.x, t), lerp(A.y, B.y, t));
}
//function to get generate a random color
function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}
