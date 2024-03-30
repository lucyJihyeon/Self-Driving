class Tree {
  constructor(center, size, height = 200) {
    this.center = center;
    //size of the base
    this.size = size;
    this.height = height;
    this.base = this.#generateLevel(center, size);
  }

  //priviate method to generate level to the tree
  #generateLevel(point, size) {
    const points = [];
    const rad = size / 2;
    //loop through each angle(pi / 16) in a circle up to (360 degrees)
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      //add variability to the radius of each point generated around the central point.
      const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      //create noisy radius by interpolating between 0.5,1 and a random value of t
      const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);
      //calculate the new positioned after applying the angle and noisy radius
      points.push(translate(point, a, noisyRadius));
    }
    return new Polygon(points);
  }
  draw(ctx, viewPoint) {
    const top = getFake3dPoint(this.center, viewPoint, this.height)
  
    const levelCount = 7;
    for (let level = 0; level < levelCount; level++) {
      // t value used for linear interpolation
      // t = ratio to determine the intermediate value between two end points (top and bottom of the tree)
      const t = level / (levelCount - 1);
      const point = lerp2D(this.center, top, t);
      //change the color as they go higher
      const color = "rgb(30," + lerp(50, 200, t) + ",70)";
      //change the size of the point as they go heigher
      const size = lerp(this.size, 40, t);
      const poly = this.#generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
    }
  }
}
