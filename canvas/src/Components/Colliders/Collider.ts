import Point2D from "../../Types/Point2D";

export default abstract class Collider {
  position: Point2D;

  constructor(x: number, y: number) {
    this.position = new Point2D(x, y);
  }

  /**
   * Returns true if the given point is within the collider.
   * @param x
   * @param y 
   */
  abstract contains(x: number, y: number): boolean;

  /**
   * Returns true if the collider overlaps with the given collider.
   * @param collider 
   */
  abstract overlaps(other: Collider): boolean;

  /**
   * Returns the top-left position of the collider.
   */
  abstract topLeft(): Point2D;

  abstract getHeight(): number;
  abstract getWidth(): number;
}