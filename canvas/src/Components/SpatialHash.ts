import Collider from './Colliders/Collider';
import Point2D from '../Types/Point2D';

/**
 * A spatial hash based on AABB world coordinates.
 */
export default class SpatialHash {
  _bucketSize: number;
  _inverseBucketSize: number;
  _map: object;

  constructor(bucketSize: number = 24) {
    this._map = {};
    this._bucketSize = bucketSize;
    this._inverseBucketSize = 1 / bucketSize;
  }

  /**
   * Given a collider, return the points within the hash in which the collider lies.
   * @param collider The collider
   */
  getPoints(collider: Collider) : Array<Point2D> {
    let points: Array<Point2D> = [];
    let moveH: number = 0;
    let position: Point2D = collider.topLeft();
    let width: number = collider.width();
    let height: number = collider.height();
    while(true) {
      let moveV: number = 0;
      while(true) {
        let x: number = position.x + moveH;
        let y: number = position.y + moveV;
        points.push(new Point2D(x, y));
        moveV+= this._bucketSize;
        if (moveV > height) {
          break;
        }        
      }
      moveH+= this._bucketSize;
      if (moveH > width) {
        break;
      }
    }
    return points;
  }

  /**
   * Add a collider to the hash, assuming it is not already within the hash.
   * @param collider
   */
  add(collider: Collider) : void {
    let points: Array<Point2D> = this.getPoints(collider);

    points.forEach(point => {
      let hash = this.toHashLong(point.x, point.y);
      if(this._map[hash] === undefined) {
        this._map[hash] = new Set();
      }
      this._map[hash].add(collider);
    });
  }

  /**
   * Removes the given collider from the hash and deletes any empty sets in the process.
   * @param collider
   * @return true if collider is removed, false otherwise.
   */
  remove(collider: Collider) : boolean {
    let removed: boolean = false;
    let points: Array<Point2D>  = this.getPoints(collider);

    points.forEach(point => {
      let hash = this.toHashLong(point.x, point.y);
      if(this._map[hash] !== undefined) {
        if(this._map[hash].delete(collider)) {
          removed = true;
          if(this._map[hash].size == 0) {
            delete this._map[hash];
          }
        }
      }
    });

    return removed;
  }

  /**
   * Given a world-point, return an array of all colliders in the corresponding segment.
   * @param x 
   * @param y 
   */
  getNearby(x: number, y: number): Array<Collider> {
    let hash = this.toHashLong(x, y);
    console.log(hash);
    let set = this._map[hash];
    if(set) {
      return <Array<Collider>>Array.from(set);
    }    
    return [];
  }

  /**
   * Given a world-point, return the first collider containing the world-point in the corresponding segment.
   * @param x 
   * @param y 
   */
  find(x: number, y: number): Collider {
    let colliders: Array<Collider> = this.getNearby(x, y);
    for(let i = 0; i < colliders.length; i++) {
      if(colliders[i].contains(x, y)) {
        return colliders[i];
      }
    }
    return null;
  }

  /**
   * Given a collider in the hash, move it by x and y points.
   * @param collider
   * @param x 
   * @param y 
   */
  move(collider: Collider, x: number, y: number) : void {
    this.remove(collider);
    collider.position.x += x;
    collider.position.y += y;
    this.add(collider);
  }

  /**
   * Convert a point to a unique 32-bit number representing the x/y coordinates in the hash.
   * @param point
   */
  toHashLong(x: number, y: number): number {
    x = Math.floor(x * this._inverseBucketSize) & 0xFFFF; // cast to 16-bit
    y = (Math.floor(y * this._inverseBucketSize) & 0xFFFF) << 15; // cast to 16-bit and then shift 15-bits to the left.
    return x | y;
  }  
}