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

        //if the guide's segments is too long, break it with a spacing between them to establish more buildings 
        const supports = [];
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            //building length + space between buildings 
            const buildingCount = Math.floor( len / (this.buildingMinLength + this.spacing));
            //building length = length of the (segment / building count) - space between buildings 
            const buildingLength = len / buildingCount - this.spacing

            const dir = seg.directionVector();
            
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));
            //creating a segments that will measure the space between buildings in a road 
            //by adding a segment between two points without its vector value (buildingLength)
            for ( let i = 2; i <= buildingCount; i++)   {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        //building bases 
        const bases = [];
        //for each building road segment, create a new enveoppe 
        for ( const seg of supports)    {
            //create a polygon around the segment with the building width without roundness
            bases.push(new Envelope(seg, this.buildingWidth).poly);
        }

        //for each of the bases building polygons
        //check if theh polygon intersect with the next ( i+1 ) building 
        for ( let i =0; i < bases.length -1; i++)   {
            for ( let j = i+1; j < bases.length; j++)   {
                //if they do intersect, remove the building 
                if (bases[i].intersectPoly(bases[j]))   {
                    bases.splice(j,1);
                    j--;
                }
            }
        }
        return bases;
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