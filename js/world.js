class World {
    constructor(graph, roadWidth = 100, roadRoundness = 10, buildingWidth = 150, buildingMinLength = 150, spacing = 50)  {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];

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

        //determine which segments to keep when the polygons(envelopes) intersects by using union static method and store them in the roadBoarder array.
        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        //generate building around the road
        this.buildings = this.#generateBuildings();
    }

    //buildings are envelope form from road, spacig * 2 away from road. 
    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments)  {
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
        for ( let i =0; i < guides.length;i++)  {
            const seg = guides[i];
            if ( seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i --;
            }
        }
        return guides;
    }
    draw(ctx)   {
        for (const env of this.envelopes)   {
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15});
        }
        for (const seg of this.graph.segments)  {
            seg.draw(ctx, { color: "white", width: 4, dash: [10,10] })
        }
        for ( const seg of this.roadBorders)    {
            seg.draw(ctx, { color: "white",width: 4 });
        }
        for ( const bld of this.buildings)   {
            bld.draw(ctx);
        }
        
    }
}