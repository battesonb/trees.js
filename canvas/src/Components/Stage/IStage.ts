export interface IStage {
    dom: HTMLCanvasElement;

    getWidth(): number;
    getHeight(): number;
    clear(): void;
    getTextWidth(text: string): number;
    setFill(style: string | CanvasGradient | CanvasPattern): void;
    setStroke(style: string | CanvasGradient | CanvasPattern): void;
    setStrokeSize(size: number): void;
    setFontSize(size: number): void;
    setFontFamily(family: string): void;
    drawRect(x: number, y: number, w: number, h: number, stroke?: boolean, shadow?: boolean): void;
    drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number, stroke?: boolean): void;
    drawLine(x1: number, y1: number, x2: number, y2: number): void;
    drawText(text: string, x: number, y: number, stroke?: boolean, maxWidth?: number): void;
    drawRoundedRect(x: number, y: number, w: number, h: number, r: number, stroke?: boolean): void;
    enableShadows(blur: number, offsetX: number, offsetY: number, color: string): void;
    clearShadows(): void;
}