export default class Color {
  _r: number;
  _g: number;
  _b: number;
  _a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.setR(r);
    this.setG(g);
    this.setB(b);
    this.setA(a);
  }

  setR(r: number) {
    this._r = Math.max(0, Math.min(255, r));
  }

  setG(g: number) {
    this._g = Math.max(0, Math.min(255, g));
  }

  setB(b: number) {
    this._b = Math.max(0, Math.min(255, b));
  }

  setA(a: number) {
    this._a = Math.max(0, Math.min(1, a));
  }

  getR() {
    return this._r;
  }

  getG() {
    return this._g;
  }

  getB() {
    return this._b;
  }

  getA() {
    return this._a;
  }
}