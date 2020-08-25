// based on https://threejsfundamentals.org/threejs/lessons/threejs-webvr-look-to-select.html

// TODO: clean unneeded mouse control code
class PickHelper {
    constructor(camera) {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
      this.camera = camera;

      const cursor = this.getCursor();
      this.camera.add(cursor);
      cursor.position.z = -1;
      const scale = 0.05;
      cursor.scale.set(scale, scale, scale);
      this.cursor = cursor;

      this.selectTimer = 0;
      this.selectDuration = 2;
      this.lastTime = 0;

      this.selected = false;
    }
    getCursor(normalizedPosition = {}) {
      const cursorColors = new Uint8Array([
        64, 64, 64, 64,       // dark gray
        200, 200, 200, 200,   // white
      ]);
    let cursor;
      // TODO: this method is repeated
      function makeDataTexture(data, width, height) {
        const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        return texture;
      }

      this.cursorTexture = makeDataTexture(cursorColors, 2, 1);

      const ringRadius = 0.3;
      const tubeRadius = 0.1;
      const tubeSegments = 4;
      const ringSegments = 64;
      const cursorGeometry = new THREE.TorusBufferGeometry(
        ringRadius, tubeRadius, tubeSegments, ringSegments);

        const cursorMaterial = new THREE.MeshBasicMaterial({
          color: 'deepskyblue',
          map: this.cursorTexture,
          transparent: false,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneMinusDstColorFactor,
          blendDst: THREE.OneMinusSrcColorFactor,
        });
        cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);

        // HACK reset cursor (for some reason it appears half loaded by default)
        const fromStart = 0;
        const fromEnd = this.selectDuration;
        const toStart = -0.5;
        const toEnd = 0.5;
        this.cursorTexture.offset.x = THREE.MathUtils.mapLinear(
            this.selectTimer,
            fromStart, fromEnd,
            toStart, toEnd);
    return cursor;
}

    pick(normalizedPosition, scene, camera, time) {
      const elapsedTime = time - this.lastTime;
      //
      const lastPickedObject = this.pickedObject;

      if (!this.pickedObject && this.selected) {
        console.log("exiting");
        this.selected = false;
        this.selectTimer = 0;
      }

      // restore the color if there is a picked object
      if (this.pickedObject) {
        // console.log("%cpicked object!", "background:gray");
        // console.log(`%ctime ${elapsedTime}`, "background:black;color:white;");
        // this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // console.log("intersection!!");
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
        
        // if we're looking at the same object as before
        // increment time select timer
        if (this.pickedObject && lastPickedObject === this.pickedObject && !this.selected) {
          this.selectTimer += elapsedTime;
          if (this.selectTimer >= this.selectDuration) {
            this.selectTimer = 0;
            this.selected = true;
          }
        } else {
          this.lastTime = time;
          this.selectTimer = 0;
          // this.selected = false;
        }


          // set cursor material to show the timer state
          const fromStart = 0;
          const fromEnd = this.selectDuration;
          const toStart = -0.5;
          const toEnd = 0.5;
          this.cursorTexture.offset.x = THREE.MathUtils.mapLinear(
              this.selectTimer,
              fromStart, fromEnd,
              toStart, toEnd);

          // return this.pickedObject;
          return this.selected ? this.pickedObject : undefined;
        // save its color
        // this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        // this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        // console.log("pickedObject", this.pickedObject);
      }
    }

    // pick(normalizedPosition, scene, camera, time) {
    //   // if (cursorKind !== this.cursorKind || cursorKind === "mouse") {
    //   //   this.cursorKind = cursorKind;
    //   //   this.cursor = this.getCursor(normalizedPosition);
    //   //   const lookToSelectCursor = scene.getObjectByName("look-to-select-cursor");
    //   //   const mouseCursor = scene.getObjectByName("mouse_cursor");
    //   //   lookToSelectCursor.visible = false;
    //   //   if (mouseCursor) {
    //   //     scene.remove(mouseCursor);
    //   //   }
    //   //   scene.add(this.cursor);
    //   // }
    //
    //     this.cursor = this.getCursor(normalizedPosition);
    //     scene.add(this.cursor);
    //
    //   const elapsedTime = time - this.lastTime;
    //   this.lastTime = time;
    //
    //   const lastPickedObject = this.pickedObject;
    //   // restore the color if there is a picked object
    //   if (this.pickedObject) {
    //     this.pickedObject = undefined;
    //   }
    //
    //   // cast a ray through the frustum
    //   this.raycaster.setFromCamera(normalizedPosition, camera);
    //   // get the list of objects the ray intersected
    //   const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    //   if (intersectedObjects.length) {
    //     // pick the first object. It's the closest one
    //     this.pickedObject = intersectedObjects[0].object;
    //   }
    //
    //   // show or hide cursor
    //   this.cursor.visible = true;
    //   // this.cursor.visible = this.pickedObject ? true : false;
    //
    //   let selected = false;
    //
    //   // if we're looking at the same object as before
    //   // increment time select timer
    //   if (this.pickedObject && lastPickedObject === this.pickedObject) {
    //     this.selectTimer += elapsedTime;
    //     if (this.selectTimer >= this.selectDuration) {
    //       this.selectTimer = 0;
    //       selected = true;
    //     }
    //   } else {
    //     this.selectTimer = 0;
    //   }
    //
    //   // set cursor material to show the timer state
    //   const fromStart = 0;
    //   const fromEnd = this.selectDuration;
    //   const toStart = -0.5;
    //   const toEnd = 0.5;
    //   // this.cursorTexture.offset.x = THREE.MathUtils.mapLinear(
    //   //     this.selectTimer,
    //   //     fromStart, fromEnd,
    //   //     toStart, toEnd);
    //
    //   return selected ? this.pickedObject : undefined;
    // }
  }
