class Enemy {
  constructor(orbitingSystem, scene, starshipPosition, gameOverCallback, options) {
    this.inTransitToSystem;
    this.position = orbitingSystem.position;
    this.orbitingSystem = orbitingSystem;
    this.speed = options && options.speed || 10;
    this.direction;
    this.directionLine;
    this.scene = scene;
    this.starshipPosition = starshipPosition;
    this.gameOverCallback = gameOverCallback;
    this.options = options;

    // render
    const geometry = new THREE.RingGeometry( 3, 6, 2 );
    const material = new THREE.MeshBasicMaterial( {color: options && options.color || 0xff0000} );
    const circle = new THREE.Mesh( geometry, material );

    const raycaster = new THREE.Raycaster();
    const { x: x1, y: y1, z: z1 } = this.starshipPosition;
    const { x: x2, y: y2, z: z2 } = this.orbitingSystem.position;

    let enemyDirection = new THREE.Vector3(this.position.x - this.starshipPosition.x,
      this.position.y - this.starshipPosition.y,
      this.position.z - this.starshipPosition.z);
    enemyDirection = enemyDirection.normalize();
    const v1 = new THREE.Vector3(x1, y1, z1);
    const v2 = new THREE.Vector3(x2, y2, z2);

    const distance = v1.distanceTo(v2);
    enemyDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.02);
    raycaster.set(v1, enemyDirection);

    let target = new THREE.Vector3();
    raycaster.ray.at(distance, target);

    circle.position.x = target.x;
    circle.position.y = target.y;
    circle.position.z = target.z;
    circle.kind = options && options.kind || "enemy";
    this.object3D = circle;
    this.scene.add( circle );
  }

  goTo() {
    const v1 = new THREE.Vector3(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z);
    // look for a near system to go
    this.inTransitToSystem = this.scene.children.find(obj => {
      if (this.inTransitToSystem.uuid === obj.uuid) {
        return null;
      }
    const maxDistance = this.options && this.options.maxDistance || 700;
    return (obj.kind === "system" || obj.kind === "singularity") &&
    v1.distanceTo(new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)) > 50 &&
    v1.distanceTo(new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)) < maxDistance
    });
    const direction = new THREE.Vector3(this.inTransitToSystem.position.x - this.object3D.position.x,
      this.inTransitToSystem.position.y - this.object3D.position.y,
      this.inTransitToSystem.position.z - this.object3D.position.z);
    this.direction = direction.normalize();
    // add direction line
    const geo = new THREE.Geometry();
    geo.vertices.push(v1);
    geo.vertices.push(new THREE.Vector3(this.inTransitToSystem.position.x, this.inTransitToSystem.position.y, this.inTransitToSystem.position.z));
    const mat = new THREE.LineBasicMaterial( { color : this.options && this.options.directionColor || 0x550000 } );
    this.directionLine = new THREE.Line( geo, mat );
    this.scene.add( this.directionLine );
  }

  move() {
    this.object3D.position.x += this.direction.x * this.speed;
    this.object3D.position.y += this.direction.y * this.speed;
    this.object3D.position.z += this.direction.z * this.speed;
    const v1 = new THREE.Vector3(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z);
    const { x: posX, y: posY, z: posZ } = this.inTransitToSystem.position;
    if (v1.distanceTo(new THREE.Vector3(posX, posY, posZ)) < 50) {
      if (this.inTransitToSystem.systemId === this.orbitingSystemId) {
        this.gameOverCallback();
      }
      this.scene.remove(this.directionLine);
      this.goTo();
    }
    // face the camera
    this.object3D.lookAt(this.starshipPosition);
  }

  think() {
    // here is the "AI" logic
    // this method is called every N ticks
    if (this.inTransitToSystem) {
      this.move();
    } else {
      this.inTransitToSystem = {};
      this.goTo();
    }
  }

  setOrbitingSystemId(orbitingSystemId) {
    this.orbitingSystemId = orbitingSystemId;
  }
}
