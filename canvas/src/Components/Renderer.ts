import Canvas from "./Canvas";
import Camera from "./Camera";
import Node from "../Models/Node";
import Tree from "../Models/Tree";

export default class Renderer {
  canvas: Canvas;
  _camera: Camera;
  _options: any;

  constructor(id: string, camera: Camera, options: any) {
    this.canvas = new Canvas(id);
    this._camera = camera;
    this._options = options;

    this.canvas.setFontFamily(options.text.family);

    this.drawTree(undefined);
  }

  clear(): void {
    this.canvas.clear();
  }

  drawTree(tree: Tree): void {
    let node = new Node("Hello", 0);
    node._width = 70;
    node._height = 24;
    this.drawNode(node);
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
    this.canvas.drawRoundedRect((node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), node.width() * this._camera.getZoom(), node.height() * this._camera.getZoom(), this._options.node.rounded * this._camera.getZoom(), false);
  
    if(this._options.shadow.text.blur > 0) {
      this.canvas.enableShadows(this._options.shadow.text.blur, this._options.shadow.text.offsetX, this._options.shadow.text.offsetY, this._options.shadow.text.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setFontSize(this._options.text.size * this._camera.getZoom());
    this.canvas.setStroke(this._options.text.stroke.color);
    this.canvas.setStrokeSize(this._options.text.stroke.size);
    this.canvas.setFill(this._options.text.color);
    this.canvas.drawText(node.getText(), (node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), this._options.text.stroke.size > 0, 100 * this._camera.getZoom());
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
      this.canvas.drawLine((node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), (node[i].position.x + this._camera.position.x) * this._camera.getZoom(), (node[i].position.y + this._camera.position.y) * this._camera.getZoom());
    }
  }
}