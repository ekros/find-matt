class Enemy {
  constructor(orbitingSystem, scene, starshipPosition, gameOverCallback, options) {
    console.log("orbitingSystem.rotation", orbitingSystem.rotation);
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
    const geometry = new THREE.ConeGeometry( 5, 20, 32 );
    const material = new THREE.MeshBasicMaterial( {color: options && options.color || 0xff0000} );
    const cone = new THREE.Mesh( geometry, material );

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
    enemyDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.02);
    raycaster.set(v1, enemyDirection);

    let target = new THREE.Vector3();
    raycaster.ray.at(distance, target);
    console.log("target", target);

    cone.position.x = target.x;
    cone.position.y = target.y;
    cone.position.z = target.z;
    cone.kind = options && options.kind || "enemy";
    this.object3D = cone;
    this.scene.add( cone );
  }

  goTo() {
    const v1 = new THREE.Vector3(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z);
    // look for a near system to go
    this.inTransitToSystem = this.scene.children.find(obj => {
      if (this.inTransitToSystem.uuid === obj.uuid) {
        return null;
      }
    const maxDistance = this.options && this.options.maxDistance || 700;
    return obj.kind === "system" &&
    v1.distanceTo(new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)) > 50 &&
    v1.distanceTo(new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)) < maxDistance
    });
    console.log("%cnew direction", "background:black;color:white");
    console.log("inTransitToSystem", this.inTransitToSystem);
    const direction = new THREE.Vector3(this.inTransitToSystem.position.x - this.object3D.position.x,
      this.inTransitToSystem.position.y - this.object3D.position.y,
      this.inTransitToSystem.position.z - this.object3D.position.z);
      console.log("direction", direction);
    this.direction = direction.normalize();
    console.log("this.direction", this.direction);
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
// console.log("this.object3D", this.object3D.position);
    const v1 = new THREE.Vector3(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z);
    const { x: posX, y: posY, z: posZ } = this.inTransitToSystem.position;
    if (v1.distanceTo(new THREE.Vector3(posX, posY, posZ)) < 50) {
      if (this.inTransitToSystem.systemId === this.orbitingSystemId) {
        this.gameOverCallback();
      }
      this.scene.remove(this.directionLine);
      this.goTo();
    }
  }

  think() {
    // here is the "AI" logic
    // this method is called every N ticks
    if (this.inTransitToSystem) {
      this.move();
    } else {
      console.log("thinking...");
      this.inTransitToSystem = {};
      this.goTo();
    }
  }

  setOrbitingSystemId(orbitingSystemId) {
    this.orbitingSystemId = orbitingSystemId;
  }
}
