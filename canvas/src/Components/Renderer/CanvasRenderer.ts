import CanvasStage from "../Stage/CanvasStage";
import Camera from "../Camera";
import Node from "../../Models/Node";
import Point2D from "../../Types/Point2D";
import Tree from "../../Models/Tree";
import SpatialHash from "../SpatialHash";

import { IRenderer } from "./IRenderer";

export default class CanvasRenderer implements IRenderer {
  private canvas: CanvasStage;
  private camera: Camera;
  private tree: Tree;
  private options: any;

  private selectedNode: Node;
  
  constructor(camera: Camera, canvas: CanvasStage, tree: Tree, options: any) {
    this.canvas = canvas;
    this.camera = camera;
    this.tree = tree;
    this.options = options;

    this.canvas.setFontFamily(options.text.family);

    this.setTreeMeasurements(tree, options);
    this.setNodePositions(tree, options);
  }

  private setTreeMeasurements(tree: Tree, options: any): void {
    this.tree.each((node: Node) => {
      node.setWidth(this.canvas.getTextWidth(node.getText()) + this.options.node.padding * 3);
      node.setHeight(this.options.text.size + this.options.node.padding * 2);
    });
  }

  private setNodePositions(tree: Tree, options: any): void {
    let currentPos = new Point2D(0, 0);
    let deltaX = 0;
    let currentLevel = 0;
    this.tree.each((node: Node, level: number) => {
      if(level != currentLevel) {
        currentPos.x += deltaX + this.options.node.margin;
        currentPos.y = 0;
        currentLevel = level;
      }
      deltaX = Math.max(deltaX, node.getWidth() + node.position.x);   
      node.position.x = currentPos.x;
      node.position.y = currentPos.y;
      currentPos.y += node.position.y + node.getHeight() + this.options.node.margin;
    }, true);
  }

  clear(): void {
    this.canvas.clear();
  }

  drawTree(): void {
    this.tree.each((node: Node) => {
      this.drawPaths(node);
    });

    this.tree.each((node: Node) => {
      if(node === this.selectedNode) {
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
    this.canvas.setStroke("#77BBFF");
    this.canvas.setStrokeSize(0.25);
    this.canvas.clearShadows();

    let cameraPosition = this.camera.getPosition();

    let hor = (cameraPosition.x % hash.getBucketSize()) * this.camera.getZoom();
    while(hor < this.canvas.getWidth()) {
      this.canvas.drawLine(hor, 0, hor, this.canvas.getHeight());
      hor += hash.getBucketSize() * this.camera.getZoom();
    }

    let vert = (cameraPosition.y % hash.getBucketSize()) * this.camera.getZoom();
    while(vert < this.canvas.getHeight()) {
      this.canvas.drawLine(0, vert, this.canvas.getWidth(), vert);
      vert += hash.getBucketSize() * this.camera.getZoom();
    }
  }

  drawNode(node: Node, selected?: boolean): void {
    if(this.options.shadow.node.blur > 0) {
      this.canvas.enableShadows(this.options.shadow.node.blur, this.options.shadow.node.offsetX * this.camera.getZoom(), this.options.shadow.node.offsetY * this.camera.getZoom(), this.options.shadow.node.color);
    } else {
      this.canvas.clearShadows();
    }
    if(selected) {
      this.canvas.setStroke(this.options.node.selected.stroke.color);
      this.canvas.setStrokeSize(this.options.node.selected.stroke.size);
      this.canvas.setFill(this.options.node.selected.color);
    } else {
      this.canvas.setStroke(this.options.node.stroke.color);
      this.canvas.setStrokeSize(this.options.node.stroke.size);
      this.canvas.setFill(this.options.node.color);
    }
    let cameraPosition = this.camera.getPosition();
    this.canvas.drawRoundedRect((node.position.x + cameraPosition.x) * this.camera.getZoom(), (node.position.y + cameraPosition.y) * this.camera.getZoom(), node.getWidth() * this.camera.getZoom(), node.getHeight() * this.camera.getZoom(), this.options.node.rounded * this.camera.getZoom(), false);
  
    if(this.options.shadow.text.blur > 0) {
      this.canvas.enableShadows(this.options.shadow.text.blur, this.options.shadow.text.offsetX * this.camera.getZoom(), this.options.shadow.text.offsetY * this.camera.getZoom(), this.options.shadow.text.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setFontSize(this.options.text.size * this.camera.getZoom());
    this.canvas.setStroke(this.options.text.stroke.color);
    this.canvas.setStrokeSize(this.options.text.stroke.size);
    this.canvas.setFill(this.options.text.color);
    this.canvas.drawText(node.getText(), (node.position.x + cameraPosition.x + this.options.node.padding) * this.camera.getZoom(), (node.position.y + cameraPosition.y + this.options.node.padding) * this.camera.getZoom(), this.options.text.stroke.size > 0, 100 * this.camera.getZoom());
  }

  drawPaths(node: Node): void {
    if(this.options.shadow.path.blur > 0) {
      this.canvas.enableShadows(this.options.shadow.path.blur, this.options.shadow.path.offsetX * this.camera.getZoom(), this.options.shadow.path.offsetY * this.camera.getZoom(), this.options.shadow.path.color);
    } else {
      this.canvas.clearShadows();
    }
    this.canvas.setStroke(this.options.path.color);
    this.canvas.setStrokeSize(this.options.path.size);
    let cameraPosition = this.camera.getPosition();
    for(let i = 0; i < node.childCount(); i++) {
      let child: Node = node.getChildAt(i);
      this.canvas.drawLine((node.position.x + node.getWidth() / 2 + cameraPosition.x) * this.camera.getZoom(), (node.position.y + node.getHeight() / 2 + cameraPosition.y) * this.camera.getZoom(), (child.position.x + child.getWidth() / 2 + cameraPosition.x) * this.camera.getZoom(), (child.position.y + child.getHeight() / 2 + cameraPosition.y) * this.camera.getZoom());
    }
  }

  setSelectedNode(node: Node): void {
    this.selectedNode = node;
  }
}