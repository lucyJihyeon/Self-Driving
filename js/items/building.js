class Building {
  constructor(poly, heightCoef = 0.4) {
    this.base = poly;
    this.heightCoef = heightCoef;
  }
  draw(ctx, viewPoint) {
    //calculate the top part of the building using view point
    const topPoints = this.base.points.map((p) =>
      add(p, scale(subtract(p, viewPoint), this.heightCoef * 0.6))
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
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(poly);
    }

    //sorting the sides array based on the distance of each side wall's midpoint to the viewPoint 
    //closest one to the viewpoint will be the last one to draw 
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    //calculating the midpoint of the base 
    const baseMidpoints = [
      //calculate midpoints by averaging the coordinates of opposite corners of the base rectangles. 
      average(this.base.points[0], this.base.points[1]),
      average(this.base.points[2], this.base.points[3])
    ];

    //calculating the midpoint of the top rectangle that represents the peak of the roof 
    const topMidpoints = baseMidpoints.map((p) =>
    add(p, scale(subtract(p, viewPoint), this.heightCoef))
  );
    //ceiling = bottom side of the roof 
    const ceiling = new Polygon(topPoints);
    //an array of polygons that represent each side of the roof 
    const roofPolys = [
      new Polygon([
        ceiling.points[0], ceiling.points[3],
        topMidpoints[1], topMidpoints[0]
      ]),
      new Polygon([
        ceiling.points[2], ceiling.points[1],
        topMidpoints[0], topMidpoints[1]
      ])
    ]
    //sorting the roofPolys array based on the distance of each side roof's midpoint to the viewPoint 
    //closest one to the viewpoint will be the last one to draw 
    roofPolys.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );
    this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
    for (const side of sides) {
      side.draw(ctx, { fill: "white", stroke: "#AAA" });
    }
    ceiling.draw(ctx, { fill: "white", stroke: "#AAA" });
    for (const poly of roofPolys) {
      poly.draw(ctx, { fill: "#D44", stroke: "#C44", lineWidth : 8, join: "round" 
    });
    }
  }
}
