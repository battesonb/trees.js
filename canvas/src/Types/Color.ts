export default class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.setR(r);
    this.setG(g);
    this.setB(b);
    this.setA(a);
  }

  setR(r: number) {
    this.r = Math.max(0, Math.min(255, r));
  }

  setG(g: number) {
    this.g = Math.max(0, Math.min(255, g));
  }

  setB(b: number) {
    this.b = Math.max(0, Math.min(255, b));
  }

  setA(a: number) {
    this.a = Math.max(0, Math.min(1, a));
  }

  getR() {
    return this.r;
  }

  getG() {
    return this.g;
  }

  getB() {
    return this.b;
  }

  getA() {
    return this.a;
  }
}