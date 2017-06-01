import Canvas from "./Canvas";

export default class Renderer {
  canvas: Canvas;

  constructor(id: string) {
    this.canvas = new Canvas(id);

    this.canvas.setStroke("#55AAFF");
    this.canvas.setStrokeSize(5);
    this.canvas.drawLine(100, 30, 190, 30);

    this.canvas.enableShadows(4, 0, 2, "rgba(0, 0, 0, 0.25)");
    this.canvas.setFill("#55AAFF");
    this.canvas.drawRoundedRect(10, 10, 100, 40, 10, false);

    this.canvas.setFill("#FFAA55");
    this.canvas.drawRoundedRect(180, 10, 100, 40, 10);

    this.canvas.clearShadows();
  }
}