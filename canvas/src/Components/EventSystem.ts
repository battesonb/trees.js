import Camera from "./Camera";
import Canvas from "./Canvas";
import Node from "../Models/Node";
import Tree from "../Models/Tree";
import Point2D from "../Types/Point2D";
import Renderer from "./Renderer";
import SpatialHash from "./SpatialHash";

let self: EventSystem;

export default class EventSystem {
  _camera: Camera;
  _canvas: Canvas;
  _currentNode: Node;
  _hash: SpatialHash;
  _renderer: Renderer;
  _x: number;
  _y: number;

  constructor(camera: Camera, renderer: Renderer, canvas: Canvas, tree: Tree) {
    self = this; // Ugly, but binds require handlers.
    this._hash = new SpatialHash(); // TODO deterrmine this using the node sizes!
    this._camera = camera;
    this._canvas = canvas;
    this._currentNode = null;
    this._renderer = renderer;

    tree.each((node: Node) => {
      this._hash.add(node);
    });

    this._canvas.dom.addEventListener("mousedown", this.mouseDown);
    this._canvas.dom.addEventListener("mousewheel", this.mouseWheel);

    this.redraw();
  }

  _getEventPoint(event: MouseEvent): Point2D {
    return new Point2D(event.offsetX, event.offsetY);
  }

  mouseDown(event: MouseEvent) {
    let point: Point2D = self._getEventPoint(event);
    self._currentNode = <Node>self._hash.find(point.x / self._camera.getZoom() - self._camera.position.x, point.y / self._camera.getZoom() - self._camera.position.y);

    self._x = point.x;
    self._y = point.y;
    
    window.addEventListener("mousemove", self.mouseMove);
    window.addEventListener("mouseup", self.mouseUp);
  }

  mouseWheel(event: MouseWheelEvent) {
    self._camera.decZoom(event.deltaY / 100);
    self.redraw();
  }

  mouseMove(event: MouseEvent) {
    let point: Point2D = self._getEventPoint(event);
    let dx = (point.x - self._x) / self._camera.getZoom();
    let dy = (point.y - self._y) / self._camera.getZoom();
    if(self._currentNode === null) {
      self._camera.position.x+= dx;
      self._camera.position.y+= dy;
    } else {
      self._hash.move(self._currentNode, dx, dy);
    }
    
    self.redraw();

    self._x = point.x;
    self._y = point.y;
  }

  mouseUp(event: MouseEvent) {
    self._currentNode = null;
    window.removeEventListener("mousemove", self.mouseMove);
    window.removeEventListener("mouseup", self.mouseUp);
  }

  redraw(): void {
    self._renderer.clear();
    self._renderer.drawTree();
    self._renderer.drawHashGroups(self._hash); // Debug
  }
}