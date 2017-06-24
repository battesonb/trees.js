import 'mocha';
import { assert } from 'chai';

import AABB from "../../../src/Components/Colliders/AABB";
import Collider from "../../../src/Components/Colliders/Collider";

describe("AABB", () => {
  describe("#constructor", () => {
    let aabb: AABB = new AABB(5, 10);
    it("should create an AABB from the parameters with default width and height of zero.", () => {
      assert.equal(aabb.position.x, 5);
      assert.equal(aabb.position.y, 10);
      assert.equal(aabb.getHeight(), 0);
      assert.equal(aabb.getWidth(), 0);
    });
  });

  describe("#contains", () => {
    let aabb: AABB = new AABB(0, 0, 10, 10);
    it("should only return true if the given point is within the AABB.", () => {
      assert.equal(aabb.contains(0, 0), true);
      assert.equal(aabb.contains(10, 0), true);
      assert.equal(aabb.contains(10, 10), true);
      assert.equal(aabb.contains(0, 10), true);

      let delta = 0.0001;
      let halfW = aabb.getWidth() / 2;
      let halfH = aabb.getHeight() / 2
      assert.equal(aabb.contains(halfW, aabb.position.x - delta), false);
      assert.equal(aabb.contains(halfW, aabb.position.x + aabb.getWidth() + delta), false);
      assert.equal(aabb.contains(aabb.position.y - delta, halfH), false);
      assert.equal(aabb.contains(aabb.position.y + aabb.getHeight() + delta, halfH), false);
    });
  });

  describe("#overlaps", () => {
    let aabb: AABB = new AABB(0, 0, 10, 10);
    it("should only return true if the given collider overlaps with this one.", () => {
      let other: AABB = new AABB(9, 9, 5, 5);
      assert.equal(aabb.overlaps(other), true);

      let not: AABB = new AABB(15, 5, 5, 5);
      assert.equal(aabb.overlaps(not), false);
    });
  });
});