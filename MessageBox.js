class MessageBox {
    constructor(scene, camera, position, size = {width: 40, height: 25}) {
        this.scene = scene;
        this.canvas = document.createElement("canvas");
        this.cameraPosition = camera.position;
        this.size = size;

        // set default position in front of the camera
        const raycaster = new THREE.Raycaster();
        // cast a ray through the frustum
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);

        console.log("this.raycaster.ray", raycaster.ray);
        let target = new THREE.Vector3();
        raycaster.ray.at(50, target);
        console.log("target", target);

        this.position = position || { x: target.x, y: target.y, z: target.z };
        const { x, y, z } = this.position;
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

        this.plane.lookAt(this.cameraPosition);

        this.scene.add( this.plane );
    }

    render(text) {
      const ctx = this.canvas.getContext( '2d' );
        // console.log("render message box");

      const w = ctx.canvas.width;
      const h = ctx.canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "24px Arial";
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

    destroy() {
      this.scene.remove(this.plane);
    }
}
