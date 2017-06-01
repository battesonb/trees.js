import Point2D from "../Types/Point2D";

export default class Camera {
  position: Point2D;
  zoom: number;

  constructor(x: number = 0, y: number = 0, zoom: number = 1) {
    this.position = new Point2D(x, y);
    this.zoom = zoom;
  }
}