class StopEditor extends MarkingEditor {
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }
  createMarking(center, directionVector)  {
    return new Stop(
      center,
      directionVector,
      //divided by 2 because we have two ways on the road. 
      world.roadWidth / 2, 
      world.roadWidth / 2
    )

    
  }
}
