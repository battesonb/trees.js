import 'mocha';
import { assert } from 'chai';

import Color from "../../src/Types/Color";

describe("Color", () => {
  describe("#constructor", () => {
    let color: Color = new Color();
    it("should set the default color to opaque black.", () => {
      assert.equal(color.getR(), 0);
      assert.equal(color.getG(), 0);
      assert.equal(color.getB(), 0);
      assert.equal(color.getA(), 1);
    });
  });

  describe("#setR", () => {
    let color: Color = new Color(0, 0, 0, 1);
    it("should modify the value of the red component.", () => {
      assert.equal(color.getR(), 0);
      color.setR(100);
      assert.equal(color.getR(), 100);
    });

    it("should force the red component to be between 0-255.", () => {
      color.setR(-5);
      assert.equal(color.getR(), 0);
      color.setR(260);
      assert.equal(color.getR(), 255);
    });
  });

  describe("#setG", () => {
    let color: Color = new Color(0, 0, 0, 1);
    it("should modify the value of the green component.", () => {
      assert.equal(color.getG(), 0);
      color.setG(100);
      assert.equal(color.getG(), 100);
    });

    it("should force the green component to be between 0-255.", () => {
      color.setG(-5);
      assert.equal(color.getG(), 0);
      color.setG(260);
      assert.equal(color.getG(), 255);
    });
  });

  describe("#setB", () => {
    let color: Color = new Color(0, 0, 0, 1);
    it("should modify the value of the blue component.", () => {
      assert.equal(color.getB(), 0);
      color.setB(100);
      assert.equal(color.getB(), 100);
    });

    it("should force the blue component to be between 0-255.", () => {
      color.setB(-5);
      assert.equal(color.getB(), 0);
      color.setB(260);
      assert.equal(color.getB(), 255);
    });
  });

  describe("#setA", () => {
    let color: Color = new Color(0, 0, 0, 1);
    it("should modify the value of the alpha component.", () => {
      assert.equal(color.getA(), 1);
      color.setA(0.5);
      assert.equal(color.getA(), 0.5);
    });

    it("should force the alpha component to be between 0-1.", () => {
      color.setA(-5);
      assert.equal(color.getA(), 0);
      color.setA(5);
      assert.equal(color.getA(), 1);
    });
  });
});