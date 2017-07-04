import Point2D from "../Types/Point2D";

export default class Camera {
  private origin: Point2D;
  private position: Point2D;
  private zoom: number;

  constructor(x: number = 0, y: number = 0, originX: number = 0, originY: number = 0, zoom: number = 1) {
    this.position = new Point2D(x, y);
    this.origin = new Point2D(originX, originY);
    this.setZoom(zoom);
  }

  setPosition(x, y): void {
    this.position.x = x;
    this.position.y = y;
  }

  move(x, y): void {
    this.position.x += x;
    this.position.y += y;
  }

  getPosition(): Point2D {
    return new Point2D(this.position.x + this.origin.x, this.position.y + this.origin.y);
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