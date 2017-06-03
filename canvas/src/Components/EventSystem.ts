import Camera from "./Camera";
import Canvas from "./Canvas";
import Node from "../Models/Node";
import Tree from "../Models/Tree";
import Renderer from "./Renderer";
import SpatialHash from "./SpatialHash";

let self: EventSystem;

export default class EventSystem {
  _camera: Camera;
  _canvas: Canvas;
  _currentNode: Node;
  _clientX: number;
  _clientY: number;
  _hash: SpatialHash;
  _renderer: Renderer;

  constructor(camera: Camera, renderer: Renderer, canvas: Canvas, tree: Tree) {
    self = this; // Ugly, but binds require handlers.
    this._hash = new SpatialHash(150); // TODO deterrmine this using the node sizes!
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

  mouseDown(event: MouseEvent) {
    self._currentNode = <Node>self._hash.find(event.clientX / self._camera.getZoom() - self._camera.position.x, event.clientY / self._camera.getZoom() - self._camera.position.y);
    
    self._clientX = event.clientX;
    self._clientY = event.clientY;
    window.addEventListener("mousemove", self.mouseMove);
    window.addEventListener("mouseup", self.mouseUp);
  }

  mouseWheel(event: MouseWheelEvent) {
    self._camera.decZoom(event.deltaY / 100);
    self.redraw();
  }

  mouseMove(event: MouseEvent) {
    let dx = (event.clientX - self._clientX) / self._camera.getZoom();
    let dy = (event.clientY - self._clientY) / self._camera.getZoom();
    if(self._currentNode === null) {
      self._camera.position.x+= dx;
      self._camera.position.y+= dy;
    } else {
      self._hash.move(self._currentNode, dx, dy);
    }
    
    self.redraw();

    self._clientX = event.clientX;
    self._clientY = event.clientY;
  }

  mouseUp(event: MouseEvent) {
    console.log(self._hash);
    self._currentNode = null;
    window.removeEventListener("mousemove", self.mouseMove);
    window.removeEventListener("mouseup", self.mouseUp);
  }

  redraw(): void {
    self._renderer.clear();
    self._renderer.drawTree();
    //self._renderer.drawHashGroups(self._hash); // Debug
  }
}