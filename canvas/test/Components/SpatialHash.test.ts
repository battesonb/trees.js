import 'mocha';
import { assert } from 'chai';

import AABB from "../../src/Components/Colliders/AABB";
import Collider from "../../src/Components/Colliders/Collider";
import SpatialHash from "../../src/Components/SpatialHash";

describe("SpatialHash", () => {
  describe("#constructor", () => {
    let hash: SpatialHash = new SpatialHash();
    it("should create a spatial hash with a default bucket size of 100.", () => {
      assert.equal(hash.getBucketSize(), 100);
    });
  });

  describe("#getPoints", () => {
    let hash: SpatialHash = new SpatialHash(100);    
    it("should return one point for a collider smaller than the bucket size within a single cell.", () => {
      let aabb: AABB = new AABB(5, 5, 50, 50);
      assert.equal(hash.getPoints(aabb).length, 1);
    });
    it("should return four points for a collider smaller than the bucket size overlapping four cells.", () => {
      let aabb: AABB = new AABB(80, 80, 50, 50);
      assert.equal(hash.getPoints(aabb).length, 4);
    });
    it("should return nine points for a collider bigger than the bucket size overlapping nine cells.", () => {
      let aabb: AABB = new AABB(90, 90, 150, 150);
      assert.equal(hash.getPoints(aabb).length, 9);
    });
  });

  describe("#toHashLong", () => {
    let hash: SpatialHash = new SpatialHash();
    it("should not put a point (a, b) into the same bucket as a point (b, a) where a & b >> bucket size.", () => {
      let x = hash.toHashLong(250, 5);
      let y = hash.toHashLong(5, 250);

      assert.notEqual(x, y);
    });
  });

  describe("#add", () => {
    let hash: SpatialHash = new SpatialHash(100);
    it("should add a collider to the hash", () => {
      let collider: AABB = new AABB(75, 75, 100, 100);
      let colliders: Collider[] = hash.getNearby(collider.position.x, collider.position.y);
      assert.equal(colliders.length, 0);
      hash.add(collider);
      colliders = hash.getNearby(collider.position.x, collider.position.y);
      assert.equal(colliders.length, 1);
    });
  });

  describe("#remove", () => {
    let hash: SpatialHash = new SpatialHash(100);
    it("should remove a collider from the hash", () => {
      let collider: AABB = new AABB(75, 75, 100, 100);
      hash.add(collider);
      let colliders: Collider[] = hash.getNearby(collider.position.x, collider.position.y);
      assert.equal(colliders.length, 1);
      hash.remove(collider);
      colliders = hash.getNearby(collider.position.x, collider.position.y);
      assert.equal(colliders.length, 0);
    });
  });
});