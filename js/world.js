class World {
    constructor(graph, roadWidth = 100, roadRoundness = 10)  {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.envelopes = [];

        this.generate();
    }
    //for each segments in the graph, make a envelope around them, then store them in the envelopes array
    generate()  {
        //because we are re-generating the envelope 60 times/frame, empty out the envelopes to begin with. 
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }
        //attribute to figure out the intersections of the two segments and break them. 
        this.intersections = Polygon.break(
            this.envelopes[0].poly,
            this.envelopes[1].poly
        )
    }

    draw(ctx)   {
        for (const env of this.envelopes)   {
            env.draw(ctx);
        }
        for (const int of this.intersections)   {
            int.draw(ctx, { color: "red", size: 6});
        }
    }
}