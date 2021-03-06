import { IStage } from "./IStage";

export default class CanvasStage implements IStage {
  dom: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  private fontSize: number;
  private fontFamily: string;

  constructor(id: string) {
    this.dom = <HTMLCanvasElement>document.getElementById(id);
    this.context = this.dom.getContext("2d");

    this.context.textBaseline = "top";

    this.fontSize = 18;
    this.fontFamily = "Arial";
    this.updateFont();
  }

  getWidth(): number {
    return this.dom.width;
  }

  getHeight(): number {
    return this.dom.height;
  }

  clear(): void {
    this.context.clearRect(0, 0, this.dom.width, this.dom.height);
  }

  getTextWidth(text: string): number {
    return this.context.measureText(text).width;
  }

  setFill(style: string | CanvasGradient | CanvasPattern): void {
    this.context.fillStyle = style;
  }

  setStroke(style: string | CanvasGradient | CanvasPattern): void {
    this.context.strokeStyle = style;
  }

  setStrokeSize(size: number = 1): void {
    this.context.lineWidth = size;
  }

  setFontSize(size: number): void {
    this.fontSize = size;
    this.updateFont();
  }

  setFontFamily(family: string): void {
    this.fontFamily = family;
    this.updateFont();
  }

  private updateFont(): void {
    this.context.font = this.fontSize + "px " + this.fontFamily;
  }

  drawRect(x: number, y: number, w: number, h: number, stroke?: boolean, shadow?: boolean): void {
    if(stroke) {
      this.context.strokeRect(x, y, w, h);
    } else {
      this.context.fillRect(x, y, w, h);
    }
  }
  
  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number, stroke?: boolean): void {
    this.context.beginPath();
    this.context.arc(x, y, r, startAngle, endAngle);
    this.context.closePath();
    if(stroke) {
      this.context.stroke();
    } else {
      this.context.fill();
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.closePath();
    this.context.stroke();
  }

  // TODO add line-wrap
  drawText(text: string, x: number, y: number, stroke?: boolean, maxWidth?: number): void {
    if(stroke) {
      this.context.strokeText(text, x, y);
    } else {
      this.context.fillText(text, x, y);
    }
  }

  drawRoundedRect(x: number, y: number, w: number, h: number, r: number, stroke?: boolean): void {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.context.beginPath();
    this.context.moveTo(x + r, y);
    this.context.arcTo(x + w, y, x + w, y + h, r);
    this.context.arcTo(x + w, y + h, x, y + h, r);
    this.context.arcTo(x, y + h, x, y, r);
    this.context.arcTo(x, y, x + w, y, r);
    this.context.closePath();
    if(stroke) {
      this.context.stroke();
    } else {
      this.context.fill();
    }
  }

  enableShadows(blur: number, offsetX: number = 0, offsetY: number = 0, color: string = "black"): void {
    this.context.shadowBlur = 8;
    this.context.shadowColor = color;
    this.context.shadowOffsetX = offsetX;
    this.context.shadowOffsetY = offsetY;
  }

  clearShadows(): void {
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
  }
}