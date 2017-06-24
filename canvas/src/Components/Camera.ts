import Point2D from "../Types/Point2D";

export default class Camera {
  position: Point2D;
  private zoom: number;

  constructor(x: number = 0, y: number = 0, zoom: number = 1) {
    this.position = new Point2D(x, y);
    this.setZoom(zoom);
  }

  setZoom(zoom: number) {
    this.zoom = Math.max(0.35, Math.min(50, zoom));
  }

  getZoom(): number {
    return this.zoom;
  }

  decZoom(amt: number, x: number, y: number) {
    let newZoom: number = this.zoom - amt;
    this.setZoom(newZoom);
  }
}