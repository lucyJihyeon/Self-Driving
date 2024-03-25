class Building {
  constructor(poly, heightCoef = 0.4) {
    this.base = poly;
    this.heightCoef = heightCoef;
  }
  draw(ctx, viewPoint) {
    //calculate the top part of the building using view point
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoef))
    );
    //sides wall of the buildings 
    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      //calculate the index of the next point in the base
      // % to make sure that when i reaches the last index, it wraps around to the first index to create a closed loop 
      const nextI = (i + 1) % this.base.points.length;
      //create a new polygon with an array containing four points
      const poly = new Polygon([
        //this.base.points[i] = the current base point 
        //this.base.points[nextI] = the next base point
        //topPoints[nextI] = the corresponding top point
        //topPoints[i] = the current top point
        this.base.points[i], this.base.points[nextI],
        topPoints[nextI], topPoints[i]
      ]);
      sides.push(poly);
    }

    const ceiling = new Polygon(topPoints);
    this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
    for (const side of sides) {
      side.draw(ctx, { fill: "white", stroke: "#AAA" });

    }
    ceiling.draw(ctx, { fill: "white", stroke: "#AAA" });

  }
}
