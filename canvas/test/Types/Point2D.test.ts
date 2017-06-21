import 'mocha';
import { assert } from 'chai';

import Point2D from "../../src/Types/Point2D";

describe("Point2D", () => {
  describe("#constructor", () => {
    it("should set the default x and y components to zero.", () => {
      let point: Point2D = new Point2D();
      assert.equal(point.x, 0);
      assert.equal(point.y, 0);
    });
    it("should set the correct components.", () => {
      let point: Point2D = new Point2D(5, 10);
      assert.equal(point.x, 5);
      assert.equal(point.y, 10);
    });
  });
});