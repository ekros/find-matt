class MattStarship extends Enemy {
  constructor(orbitingSystem, scene, starshipPosition, matchCallback) {
    super(orbitingSystem, scene, starshipPosition, matchCallback, { kind: "matt", color: 0x0000ff, directionColor: 0x000055, speed: 20, maxDistance: 1000 });
  }
}
