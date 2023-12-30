//Function to get the nearest point
//it takes three parameter loc(location), points, and threshold
function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER)   {
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
function distance(p1, p2)   {
    //using a pythagorean theory
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}