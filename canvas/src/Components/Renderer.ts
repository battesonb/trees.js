import Canvas from "./Canvas";
import Camera from "./Camera";
import Node from "../Models/Node";

export default class Renderer {
  canvas: Canvas;
  camera: Camera;
  _options: any;

  constructor(id: string, options: any) {
    this.canvas = new Canvas(id);
    this.camera = new Camera(0, 0, 1);
    this._options = options;

    this.canvas.setFontFamily(options.text.family);

    this.canvas.enableShadows(4, 0, 2, "rgba(0, 0, 0, 0.25)");
    this.canvas.setFill("#55AAFF");
    this.canvas.drawRoundedRect(10, 10, 100, 30, 10, false);

    this.canvas.setFill("#FFAA55");
    this.canvas.drawRoundedRect(160, 10, 100, 30, 10);

    //this.canvas.clearShadows();
    this.canvas.setFill("#FFF");
    this.canvas.drawText("Hello", 40, 31);
  }

  drawNode(node: Node): void {
    if(this._options.shadow.node.blur > 0) {
      this.canvas.enableShadows(this._options.shadow.node.blur, this._options.shadow.node.offsetX, this._options.shadow.node.offsetY, this._options.shadow.node.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setStroke(this._options.node.stroke.color);
    this.canvas.setStrokeSize(this._options.node.stroke.size);
    this.canvas.setFill(this._options.node.color);
    this.canvas.drawRoundedRect((node.position.x + this.camera.position.x) * this.camera.getZoom(), (node.position.y + this.camera.position.y) * this.camera.getZoom(), node.width() * this.camera.getZoom(), node.height() * this.camera.getZoom(), this._options.node.rounded * this.camera.getZoom(), false);
  
    if(this._options.shadow.text.blur > 0) {
      this.canvas.enableShadows(this._options.shadow.text.blur, this._options.shadow.text.offsetX, this._options.shadow.text.offsetY, this._options.shadow.text.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setFontSize(this._options.text.size * this.camera.getZoom());
    this.canvas.setStroke(this._options.text.stroke.color);
    this.canvas.setStrokeSize(this._options.text.stroke.size);
    this.canvas.setFill(this._options.text.color);
    this.canvas.drawText(node.getText(), node.position.x * this.camera.getZoom(), node.position.y * this.camera.getZoom(), this._options.text.stroke.size > 0, 100 * this.camera.getZoom());
  }

  drawPaths(node: Node): void {
    if(this._options.shadow.path.blur > 0) {
      this.canvas.enableShadows(this._options.shadow.path.blur, this._options.shadow.path.offsetX, this._options.shadow.path.offsetY, this._options.shadow.path.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setStroke(this._options.path.color);
    this.canvas.setStrokeSize(this._options.path.size);
    for(let i = 0; i < node._children.length; i++) {
      this.canvas.drawLine((node.position.x + this.camera.position.x) * this.camera.getZoom(), (node.position.y + this.camera.position.y) * this.camera.getZoom(), (node[i].position.x + this.camera.position.x) * this.camera.getZoom(), (node[i].position.y + this.camera.position.y) * this.camera.getZoom());
    }
  }
}