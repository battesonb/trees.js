import Collider from "./Collider";
import Point2D from "../../Types/Point2D";

/**
 * Represents an AABB with top-left alignment.
 */
export default class AABB extends Collider {
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  contains(x: number, y: number): boolean {
    return x >= this.position.x && y >= this.position.y && x <= this.position.x + this.getWidth() && y <= this.position.y + this.getHeight();
  }

  overlaps(other: Collider): boolean {
    if(other instanceof AABB) {
      return Math.abs(this.position.x - other.position.x) * 2 < this.getWidth() + other.getWidth() &&
             Math.abs(this.position.y - other.position.y) * 2 < this.getHeight() + other.getHeight();
    } else {
      throw Error("Unknown collider type, cannot determine overlap.");
    }
  }

  topLeft(): Point2D {
    return this.position;
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }
}