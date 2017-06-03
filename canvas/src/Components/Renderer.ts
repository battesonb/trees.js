import Canvas from "./Canvas";
import Camera from "./Camera";
import Node from "../Models/Node";
import Tree from "../Models/Tree";
import SpatialHash from "./SpatialHash";

export default class Renderer {
  _canvas: Canvas;
  _camera: Camera;
  _tree: Tree;
  _options: any;

  _selectedNode: Node;
  
  constructor(camera: Camera, canvas: Canvas, tree: Tree, options: any) {
    this._canvas = canvas;
    this._camera = camera;
    this._tree = tree;
    this._options = options;

    this._canvas.setFontFamily(options.text.family);

    // TODO Set up node widths/heights/padding
  }

  clear(): void {
    this._canvas.clear();
  }

  drawTree(): void {
    this._tree.each((node: Node) => {
      this.drawPaths(node);
    });

    this._tree.each((node: Node) => {
      if(node === this._selectedNode) {
        this.drawNode(node, true);
      } else {
        this.drawNode(node);
      }
    });
  }

  /**
   * A debugging method for visualising how the spatial hash looks.
   */
  drawHashGroups(hash: SpatialHash): void {
    this._canvas.setStroke("#77BBFF");
    this._canvas.setStrokeSize(0.5);
    this._canvas.clearShadows();

    let hor = (this._camera.position.x % hash._bucketSize) * this._camera._zoom;
    while(hor < this._canvas.getWidth()) {
      this._canvas.drawLine(hor, 0, hor, this._canvas.getHeight());
      hor += hash._bucketSize * this._camera._zoom;
    }

    let vert = (this._camera.position.y % hash._bucketSize) * this._camera._zoom;
    while(vert < this._canvas.getHeight()) {
      this._canvas.drawLine(0, vert, this._canvas.getWidth(), vert);
      vert += hash._bucketSize * this._camera._zoom;
    }
  }

  drawNode(node: Node, selected?: boolean): void {
    if(this._options.shadow.node.blur > 0) {
      this._canvas.enableShadows(this._options.shadow.node.blur, this._options.shadow.node.offsetX * this._camera.getZoom(), this._options.shadow.node.offsetY * this._camera.getZoom(), this._options.shadow.node.color);
    } else {
      this._canvas.clearShadows();
    }
    if(selected) {
      this._canvas.setStroke(this._options.node.selected.stroke.color);
      this._canvas.setStrokeSize(this._options.node.selected.stroke.size);
      this._canvas.setFill(this._options.node.selected.color);
    } else {
      this._canvas.setStroke(this._options.node.stroke.color);
      this._canvas.setStrokeSize(this._options.node.stroke.size);
      this._canvas.setFill(this._options.node.color);
    }
    this._canvas.drawRoundedRect((node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), node.width() * this._camera.getZoom(), node.height() * this._camera.getZoom(), this._options.node.rounded * this._camera.getZoom(), false);
  
    if(this._options.shadow.text.blur > 0) {
      this._canvas.enableShadows(this._options.shadow.text.blur, this._options.shadow.text.offsetX * this._camera.getZoom(), this._options.shadow.text.offsetY * this._camera.getZoom(), this._options.shadow.text.color);
    } else {
      this._canvas.clearShadows();
    }
    this._canvas.setFontSize(this._options.text.size * this._camera.getZoom());
    this._canvas.setStroke(this._options.text.stroke.color);
    this._canvas.setStrokeSize(this._options.text.stroke.size);
    this._canvas.setFill(this._options.text.color);
    this._canvas.drawText(node.getText(), (node.position.x + this._camera.position.x + this._options.node.padding) * this._camera.getZoom(), (node.position.y + this._camera.position.y + this._options.node.padding) * this._camera.getZoom(), this._options.text.stroke.size > 0, 100 * this._camera.getZoom());
  }

  drawPaths(node: Node): void {
    if(this._options.shadow.path.blur > 0) {
      this._canvas.enableShadows(this._options.shadow.path.blur, this._options.shadow.path.offsetX * this._camera.getZoom(), this._options.shadow.path.offsetY * this._camera.getZoom(), this._options.shadow.path.color);
    } else {
      this._canvas.clearShadows();
    }
    this._canvas.setStroke(this._options.path.color);
    this._canvas.setStrokeSize(this._options.path.size);
    for(let i = 0; i < node._children.length; i++) {
      this._canvas.drawLine((node.position.x + node.width() / 2 + this._camera.position.x) * this._camera.getZoom(), (node.position.y + node.height() / 2 + this._camera.position.y) * this._camera.getZoom(), (node._children[i].position.x + node._children[i].width() / 2 + this._camera.position.x) * this._camera.getZoom(), (node._children[i].position.y + node._children[i].height() / 2 + this._camera.position.y) * this._camera.getZoom());
    }
  }

  setSelectedNode(node: Node): void {
    this._selectedNode = node;
  }
}