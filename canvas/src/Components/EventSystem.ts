import Camera from "./Camera";
import Node from "../Models/Node";
import Renderer from "./Renderer";
import SpatialHash from "./SpatialHash";

export default class EventSystem {
  _camera: Camera;
  _currentNode: Node;
  _clientX: number;
  _clientY: number;
  _hash: SpatialHash;
  _renderer: Renderer;

  constructor(camera: Camera, renderer: Renderer) {
    this._hash = new SpatialHash(24);
    this._camera = camera;
    this._currentNode = null;
    this._renderer = renderer;

    window.addEventListener("mousedown", this.mouseDown.bind(this));
  }

  mouseDown(event: MouseEvent) {
    this._currentNode = <Node>this._hash.find(event.clientX / this._camera.getZoom() - this._camera.position.x, event.clientY / this._camera.getZoom() + this._camera.position.x);
    this._clientX = event.clientX;
    this._clientY = event.clientY;
    window.addEventListener("mousemove", this.mouseMove.bind(this));
    window.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  mouseMove(event: MouseEvent) {
    let dx = (event.clientX - this._clientX) / this._camera.getZoom();
    let dy = (event.clientY - this._clientY) / this._camera.getZoom();
    if(this._currentNode === null) {
      this._camera.position.x+= dx;
      this._camera.position.y+= dy;
    } else {
      this._currentNode.position.x+= dx;
      this._currentNode.position.y+= dy;
    }
    
    this._renderer.clear();
    this._renderer.drawTree(undefined);

    this._clientX = event.clientX;
    this._clientY = event.clientY;
  }

  mouseUp(event: MouseEvent) {
    console.log("HELLO?");
    this._currentNode = null;
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
  }
}