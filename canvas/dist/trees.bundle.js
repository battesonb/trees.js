(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setFill(style) {
        this.context.fillStyle = style;
    }
    setStroke(style) {
        this.context.strokeStyle = style;
    }
    setStrokeSize(size = 1) {
        this.context.lineWidth = size;
    }
    drawRect(x, y, w, h, stroke, shadow) {
        if (stroke) {
            this.context.strokeRect(x, y, w, h);
        } else {
            this.context.fillRect(x, y, w, h);
        }
    }
    drawArc(x, y, r, startAngle, endAngle, stroke) {
        this.context.beginPath();
        this.context.arc(x, y, r, startAngle, endAngle);
        this.context.closePath();
        if (stroke) {
            this.context.stroke();
        } else {
            this.context.fill();
        }
    }
    drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.closePath();
        this.context.stroke();
    }
    // TODO add line-wrap
    drawText(text, x, y, stroke, maxWidth) {
        if (stroke) {
            this.context.strokeText(text, x, y);
        } else {
            this.context.fillText(text, x, y);
        }
    }
    drawRoundedRect(x, y, w, h, r, stroke) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.context.beginPath();
        this.context.moveTo(x + r, y);
        this.context.arcTo(x + w, y, x + w, y + h, r);
        this.context.arcTo(x + w, y + h, x, y + h, r);
        this.context.arcTo(x, y + h, x, y, r);
        this.context.arcTo(x, y, x + w, y, r);
        this.context.closePath();
        if (stroke) {
            this.context.stroke();
        } else {
            this.context.fill();
        }
    }
    enableShadows(blur, offsetX = 0, offsetY = 0, color = "black") {
        this.context.shadowBlur = 8;
        this.context.shadowColor = color;
        this.context.shadowOffsetX = offsetX;
        this.context.shadowOffsetY = offsetY;
    }
    clearShadows() {
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }
}
exports.default = Canvas;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
class Renderer {
    constructor(id) {
        this.canvas = new Canvas_1.default(id);
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
exports.default = Renderer;

},{"./Canvas":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("./Components/Renderer");
class TreesJS {
  constructor(id, options) {
    this.renderer = new Renderer_1.default(id);
  }
}
exports.default = TreesJS;
/*
options = {
  stroke: {
    color: "#55AAFF"
    size: 2
  },
  fill: "#FFAA55",
  shadow: {
    node: {
      blur: 8
      color: "rgba(0, 0, 0, 0.25)"
      offsetX: 0
      offsetY: 4
    },
    path: {
      blur: 8
      color: "rgba(0, 0, 0, 0.25)"
      offsetX: 0
      offsetY: 4
    }
  }
  shape: {
    rounded: 5
  }
}
*/
window.TreesJS = TreesJS;

},{"./Components/Renderer":2}]},{},[3])

//# sourceMappingURL=trees.bundle.js.map
