class World {
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 150
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = treeSize;

    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];

    this.generate();
  }
  //for each segments in the graph, make a envelope around them, then store them in the envelopes array
  generate() {
    //because we are re-generating the envelope 60 times/frame, empty out the envelopes to begin with.
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roadRoundness)
      );
    }

    //determine which segments to keep when the polygons(envelopes) intersects by using union static method and store them in the roadBoarder array.
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    //generate building around the road
    this.buildings = this.#generateBuildings();
    this.trees = this.#generateTrees();
  }
  //private method to create trees
  #generateTrees() {
    //betcause tress will be around the road or building, gather their points and store them in a points array
    const points = [
      //flatten nested arrays into a single-level array
      ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];

    //left(lower value) and right(higher value) = x-axis
    //top(lower value in 2D canvas) and buttom(higher value) = y-axis
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    //illgalpolys = when the polygon that forms the building and the road
    const illegalPolys = [
      ...this.buildings.map((b)=> b.base),
      ...this.envelopes.map((e) => e.poly),
    ];

    const trees = [];
    let tryCount = 0;
    while (tryCount < 100) {
      //trees = point
      const p = new Point(
        //randomize the tree by using lerp
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random())
      );
      let keep = true;
      //loop through the each polygon in the illegalpolys, and if it contains the generated p where the tree is going to be,
      //don't keep it
      for (const poly of illegalPolys) {
        //also check if the point is too close to the polygon (check the radius)
        if (
          poly.containsPoint(p) ||
          poly.distanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }

      //if statement to decide whether or not keep the tree by measuring the distance between the tree and the generated point
      if (keep) {
        for (const tree of trees) {
          //this prevents having trees overlaps
          if (distance(tree.center, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }
      //if the tree is too close to something, don't keep it 
      if (keep) {
        let closeToSomething = false;
        for ( const poly of illegalPolys)   {
            if(poly.distanceToPoint(p) < this.treeSize * 2) {
                closeToSomething = true;
                break;
            }
        }
        keep = closeToSomething;
      }
      if (keep) {
        trees.push(new Tree(p, this.treeSize));
        tryCount = 0;
      }
      tryCount++;
    }
    return trees;
  }

  //buildings are envelope form from road, spacig * 2 away from road.
  #generateBuildings() {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
      );
    }
    //determine which segments to keep when the polygons(envelopes) intersects by using union static method
    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));
    //check the guide(segment) length and if the length is less than the min length, remove the guides[i]
    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    //if the guide's segments is too long, break it with a spacing between them to establish more buildings
    const supports = [];
    for (let seg of guides) {
      const len = seg.length() + this.spacing;
      //building length + space between buildings
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      //building length = length of the (segment / building count) - space between buildings
      const buildingLength = len / buildingCount - this.spacing;

      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = add(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));
      //creating a segments that will measure the space between buildings in a road
      //by adding a segment between two points without its vector value (buildingLength)
      for (let i = 2; i <= buildingCount; i++) {
        q1 = add(q2, scale(dir, this.spacing));
        q2 = add(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    //building bases
    const bases = [];
    //for each building road segment, create a new enveoppe
    for (const seg of supports) {
      //create a polygon around the segment with the building width without roundness
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    const eps = 0.001;
    //for each of the bases building polygons
    //check if theh polygon intersect with the next ( i+1 ) building
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        //if they do intersect, remove the building
        //also, if the building is too close to the next building, remove the building 
        if (bases[i].intersectPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps) {
          bases.splice(j, 1);
          j--;
        }
      }
    }
    return bases.map((b)=> new Building(b));
  }
  draw(ctx, viewPoint) {
    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }
    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "white", width: 4 });
    }
    for (const tree of this.trees) {
      tree.draw(ctx, viewPoint);
    }
    for (const bld of this.buildings) {
      bld.draw(ctx, viewPoint);
    }
  }
}
