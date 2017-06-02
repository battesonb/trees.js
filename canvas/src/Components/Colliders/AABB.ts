import Collider from "./Collider";
import Point2D from "../../Types/Point2D";

/**
 * Represents an AABB with top-left alignment.
 */
export default class AABB extends Collider {
  _width: number;
  _height: number;

  constructor(x: number, y: number, width: number = 0, height: number = 0) {
    super(x, y);
    this._width = width;
    this._height = height;
  }

  contains(x: number, y: number): boolean {
    return x >= this.position.x && y >= this.position.y && x <= this.position.x + this.width() && y <= this.position.x + this.height();
  }

  overlaps(other: Collider): boolean {
    if(other instanceof AABB) {
      return Math.abs(this.position.x - other.position.x) * 2 < this.width() + other.width() &&
             Math.abs(this.position.y - other.position.y) * 2 < this.height() + other.height();
    }
    throw Error("Unknown collider type, cannot determine overlap.");
  }

  topLeft(): Point2D {
    return this.position;
  }

  height(): number {
    return this._height;
  }

  width(): number {
    return this._width;
  }
}