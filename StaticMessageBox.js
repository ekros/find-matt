class StaticMessageBox extends MessageBox {
  constructor(scene, camera, position, size = {width: 8, height: 3}) {
    super(scene, camera, position, size, { static: true, yOffset: 0, distance: 20, fontSize: "64px" });
  }
}
