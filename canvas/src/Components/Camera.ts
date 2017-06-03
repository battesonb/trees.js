import Point2D from "../Types/Point2D";

export default class Camera {
  position: Point2D;
  _zoom: number;

  constructor(x: number = 0, y: number = 0, zoom: number = 1) {
    this.position = new Point2D(x, y);
    this.setZoom(zoom);
  }

  setZoom(zoom: number) {
    this._zoom = Math.max(0.5, Math.min(50, zoom));
  }

  getZoom(): number {
    return this._zoom;
  }

  decZoom(amt: number) {
    this.setZoom(this._zoom - amt);
  }
}