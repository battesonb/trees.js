import Camera from "./Camera";
import CanvasStage from "./Stage/CanvasStage";
import Node from "../Models/Node";
import Tree from "../Models/Tree";
import Point2D from "../Types/Point2D";
import SpatialHash from "./SpatialHash";

import { IRenderer } from "./Renderer/IRenderer";
import { IStage } from "./Stage/IStage";

let self: EventSystem;

export default class EventSystem {
  private camera: Camera;
  private stage: IStage;
  private currentNode: Node;
  private hash: SpatialHash;
  private renderer: IRenderer;
  private x: number;
  private y: number;

  private moved: boolean;

  constructor(camera: Camera, renderer: IRenderer, stage: IStage, tree: Tree) {
    self = this; // Ugly, but binds require handlers.
    this.hash = new SpatialHash(); // TODO deterrmine this using the node sizes!
    this.camera = camera;
    this.stage = stage;
    this.currentNode = null;
    this.renderer = renderer;
    this.moved = false;

    tree.each((node: Node) => {
      this.hash.add(node);
    });

    this.stage.dom.addEventListener("mousedown", this.mouseDown);
    this.stage.dom.addEventListener("mousemove", this.mouseMove);
    this.stage.dom.addEventListener("mousewheel", this.mouseWheel);

    this.redraw();
  }

  private getEventPoint(event: MouseEvent): Point2D {
    return new Point2D(event.offsetX, event.offsetY);
  }

  mouseDown(event: MouseEvent) {
    let point: Point2D = self.getEventPoint(event);
    let cameraPosition = self.camera.getPosition();
    self.currentNode = <Node>self.hash.find(point.x / self.camera.getZoom() - cameraPosition.x, point.y / self.camera.getZoom() - cameraPosition.y);
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
      self.camera.move(dx, dy);
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
    let cameraPosition = self.camera.getPosition();
    let hoverNode: Node = <Node>self.hash.find(point.x / self.camera.getZoom() - cameraPosition.x, point.y / self.camera.getZoom() - cameraPosition.y);
    if(hoverNode) {
      self.stage.dom.style.cursor = "pointer";
    } else {
      self.stage.dom.style.cursor = "auto";
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