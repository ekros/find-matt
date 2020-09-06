class Enemy {
  constructor(orbitingSystem, scene, starshipPosition) {
    console.log("orbitingSystem.rotation", orbitingSystem.rotation);
    this.inTransitToSystem;
    this.position = orbitingSystem.position;
    this.orbitingSystem = orbitingSystem;
    this.speed = 0;
    this.detectionChance = 0.01; // detection chance of the player in every think() call
    this.scene = scene;
    this.starshipPosition = starshipPosition;

    // render
    const geometry = new THREE.ConeGeometry( 5, 20, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const cone = new THREE.Mesh( geometry, material );

    // TODO-ING: calculate enemy position from system-camera ray
    const raycaster = new THREE.Raycaster();
    const { x: x1, y: y1, z: z1 } = this.starshipPosition;
    const { x: x2, y: y2, z: z2 } = this.orbitingSystem.position;

    let enemyDirection = new THREE.Vector3(this.position.x - this.starshipPosition.x,
      this.position.y - this.starshipPosition.y,
      this.position.z - this.starshipPosition.z);
    enemyDirection = enemyDirection.normalize();
    console.log("enemyDirection", enemyDirection);
    const v1 = new THREE.Vector3(x1, y1, z1);
    const v2 = new THREE.Vector3(x2, y2, z2);
    console.log("v1", v1);
    console.log("v2", v2);

    const distance = v1.distanceTo(v2);
    console.log("distance", distance);
    enemyDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.02);
    raycaster.set(v1, enemyDirection);

    // TODO: remove this section!!! only used to draw the line
    // Draw a line from pointA in the given direction at distance 100
    // const pointA = v1;
    // const direction = enemyDirection;
    // direction.normalize();
    // const dist = distance; // at what dist to determine pointB
    // const pointB = new THREE.Vector3();
    // pointB.addVectors ( pointA, direction.multiplyScalar( dist ) );
    // const geo = new THREE.Geometry();
    // geo.vertices.push( pointA );
    // geo.vertices.push( pointB );
    // const mat = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // const line = new THREE.Line( geo, mat );
    // scene.add( line );
    // *****************************

    let target = new THREE.Vector3();
    raycaster.ray.at(distance, target);
    console.log("target", target);

    cone.position.x = target.x;
    cone.position.y = target.y;
    cone.position.z = target.z;
    this.scene.add( cone );
  }

  goTo() {
    // here we set the distance and the
  }

  move() {
    // add speed to current position
  }

  think() {
    // here is the "AI" logic
    // this method is called every N ticks
    if (inTransitToSystem) {
      this.move();
    } else {
      // it moves randomly from system to system unless it detects the player
    }
  }
}
