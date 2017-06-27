import Camera from "./Camera";
import Canvas from "./Canvas";
import Node from "../Models/Node";
import Tree from "../Models/Tree";
import Point2D from "../Types/Point2D";
import Renderer from "./Renderer";
import SpatialHash from "./SpatialHash";

let self: EventSystem;

export default class EventSystem {
  private camera: Camera;
  private canvas: Canvas;
  private currentNode: Node;
  private hash: SpatialHash;
  private renderer: Renderer;
  private x: number;
  private y: number;

  private moved: boolean;

  constructor(camera: Camera, renderer: Renderer, canvas: Canvas, tree: Tree) {
    self = this; // Ugly, but binds require handlers.
    this.hash = new SpatialHash(); // TODO deterrmine this using the node sizes!
    this.camera = camera;
    this.canvas = canvas;
    this.currentNode = null;
    this.renderer = renderer;
    this.moved = false;

    tree.each((node: Node) => {
      this.hash.add(node);
    });

    this.canvas.dom.addEventListener("mousedown", this.mouseDown);
    this.canvas.dom.addEventListener("mousemove", this.mouseMove);
    this.canvas.dom.addEventListener("mousewheel", this.mouseWheel);

    this.redraw();
  }

  private getEventPoint(event: MouseEvent): Point2D {
    return new Point2D(event.offsetX, event.offsetY);
  }

  mouseDown(event: MouseEvent) {
    let point: Point2D = self.getEventPoint(event);
    self.currentNode = <Node>self.hash.find(point.x / self.camera.getZoom() - self.camera.position.x, point.y / self.camera.getZoom() - self.camera.position.y);
    if(self.currentNode) {
      self.currentNode.bringToFront();
    }
    self.moved = false;

    self.x = point.x;
    self.y = point.y;
    
    window.addEventListener("mousemove", self.mouseDrag);
    window.addEventListener("mouseup", self.mouseUp);
  }

  mouseWheel(event: MouseWheelEvent) {
    let point: Point2D = self.getEventPoint(event);
    self.camera.decZoom(event.deltaY / 250, point.x, point.y);
    self.redraw();
  }

  mouseDrag(event: MouseEvent) {
    let point: Point2D = self.getEventPoint(event);
    let dx = (point.x - self.x) / self.camera.getZoom();
    let dy = (point.y - self.y) / self.camera.getZoom();
    if(self.currentNode === null) {
      self.camera.position.x+= dx;
      self.camera.position.y+= dy;
    } else {
      self.hash.move(self.currentNode, dx, dy);
    }
    self.moved = true;

    self.redraw();
    self.x = point.x;
    self.y = point.y;
  }
  
  mouseMove(event: MouseEvent) {
    let point: Point2D = self.getEventPoint(event);
    let hoverNode: Node = <Node>self.hash.find(point.x / self.camera.getZoom() - self.camera.position.x, point.y / self.camera.getZoom() - self.camera.position.y);
    if(hoverNode) {
      self.canvas.dom.style.cursor = "pointer";
    } else {
      self.canvas.dom.style.cursor = "auto";
    }
  }

  mouseUp(event: MouseEvent) {
    if(!self.moved) {
      self.renderer.setSelectedNode(self.currentNode);
      self.redraw();
    }
    self.currentNode = null;
    window.removeEventListener("mousemove", self.mouseDrag);
    window.removeEventListener("mouseup", self.mouseUp);
  }

  redraw(): void {
    self.renderer.clear();
    self.renderer.drawTree();
    self.renderer.drawHashGroups(self.hash); // Debug Spatial Hash
  }
}