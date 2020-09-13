class MessageBox {
    constructor(scene, camera, position, size = {width: 60, height: 25}, options) {
        this.scene = scene;
        this.canvas = document.createElement("canvas");
        this.cameraPosition = position;
        this.size = size;
        this.pages = undefined;
        this.pageCursor = 0;
        this.options = options;
        this.camera = camera;
        this.starshipPosition = position;

        // set default position in front of the camera
        const raycaster = new THREE.Raycaster();
        // cast a ray through the frustum
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);

        console.log("this.raycaster.ray", raycaster.ray);
        let target = new THREE.Vector3();
        raycaster.ray.at(45, target);
        console.log("target", target);

        this.boxPosition = { x: target.x, y: target.y, z: target.z };
        const { x, y, z } = this.boxPosition;
        const { width, height } = this.size;
        let geometry = new THREE.PlaneGeometry( width, height);
        this.material = new THREE.MeshBasicMaterial( {color: 0x444444, side: THREE.DoubleSide} );

        // get canvas and context
        // const drawingCanvas = this.canvas;
        // set canvas as material.map (this could be done to any map, bump, displacement etc.)
        this.material.map = new THREE.CanvasTexture( this.canvas );

        this.plane = new THREE.Mesh( geometry, this.material );
        console.log("y", y);
        this.plane.position.x = x;
        this.plane.position.y = y - 50;
        this.plane.position.z = z;
        this.plane.kind = "message";

        this.plane.lookAt(position);

        this.scene.add( this.plane );
    }

    updateText(newText) {
      const text = newText || this.pages[this.pageCursor];
      console.log("text", text);
      const ctx = this.canvas.getContext( '2d' );
        // console.log("render message box");

      const w = ctx.canvas.width;
      const h = ctx.canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${this.options && this.options.fontSize || `20px`} Arial`;
      ctx.fillStyle = "black";

      // split text using line breaks
      if (text) {
          const textLines = text.split("\n");
          textLines.forEach((textLine, index) => {
          ctx.fillText(textLine, 5, 50 + 24 * index, w);
          })
      }
      this.material.map.needsUpdate = true;
    }

    render(pages, getCamera) {
      console.log("render pages", pages);
      if (!this.pages) {
        this.pages = typeof (pages) === "string" ? [pages] : pages;
      }
      if (this.pages && typeof (pages) === "string") {
        this.pages = [pages];
      }
      this.updateText();
    }

    followCamera() {
      // follow camera if the message box is static
      if (this.options && this.options.static) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
        let target = new THREE.Vector3();
        raycaster.ray.at(this.options && this.options.distance || 100, target);
        this.boxPosition = { x: target.x, y: target.y, z: target.z };
        const { x, y, z } = this.boxPosition;
        this.plane.position.x = x;
        this.plane.position.y = y - (this.options && this.options.yOffset || 30);
        this.plane.position.z = z;
        this.plane.lookAt(this.starshipPosition);
      }
    }

    autoNext() {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          console.log("interval");
          if(!this.next()) {
            clearInterval(interval);
            resolve();
          }
        }, 2000);
      })
    }

    next() {
      if (this.pages) {
        console.log("next", this.pages);
        console.log("this.pages", this.pages);
        this.pageCursor += 1;
        console.log("this.pageCursor", this.pageCursor);
        if (this.pageCursor === this.pages.length) {
          this.destroy();
          return false;
        } else {
          console.log("this.pages[this.pageCursor]", this.pages[this.pageCursor]);
          this.render();
          return true;
        }
      }
    }

    reset() {
      this.pages = undefined;
      this.pageCursor = 0;
    }

    destroy() {
      this.reset();
      this.scene.remove(this.plane);
    }
}
