(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../Types/Point2D");
class Camera {
    constructor(x = 0, y = 0, zoom = 1) {
        this.position = new Point2D_1.default(x, y);
        this.setZoom(zoom);
    }
    setZoom(zoom) {
        this._zoom = Math.max(0.05, Math.min(50, zoom));
    }
    getZoom() {
        return this._zoom;
    }
}
exports.default = Camera;

},{"../Types/Point2D":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this._fontSize = 18;
        this._fontFamily = "Arial";
        this._updateFont();
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getTextWidth(text) {
        return this.context.measureText(text).width;
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
    setFontSize(size) {
        this._fontSize = size;
        this._updateFont();
    }
    setFontFamily(family) {
        this._fontFamily = family;
        this._updateFont();
    }
    _updateFont() {
        this.context.font = this._fontSize + "px " + this._fontFamily;
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
const Camera_1 = require("./Camera");
class Renderer {
    constructor(id, options) {
        this.canvas = new Canvas_1.default(id);
        this.camera = new Camera_1.default(0, 0, 1);
        this._options = options;
        this.canvas.setFontFamily(options.text.family);
        this.canvas.enableShadows(4, 0, 2, "rgba(0, 0, 0, 0.25)");
        this.canvas.setFill("#55AAFF");
        this.canvas.drawRoundedRect(10, 10, 100, 30, 10, false);
        this.canvas.setFill("#FFAA55");
        this.canvas.drawRoundedRect(160, 10, 100, 30, 10);
        //this.canvas.clearShadows();
        this.canvas.setFill("#FFF");
        this.canvas.drawText("Hello", 40, 31);
    }
    drawNode(node) {
        this.canvas.setStroke(this._options.node.stroke.color);
        this.canvas.setStrokeSize(this._options.node.stroke.size);
        this.canvas.setFill(this._options.node.color);
        this.canvas.drawRoundedRect(node.position.x + this.camera.position.x, node.position.y + this.camera.position.y, node.width(), node.height(), this._options.node.rounded, false);
        this.canvas.setFontSize(this._options.text.size * this.camera.getZoom());
        this.canvas.setStroke(this._options.text.stroke.color);
        this.canvas.setStrokeSize(this._options.text.stroke.size);
        this.canvas.setFill(this._options.text.color);
        this.canvas.drawText(node.getText(), node.position.x, node.position.y, this._options.text.stroke.size > 0, 100);
    }
    drawPaths(node) {
        this.canvas.setStroke(this._options.path.color);
        this.canvas.setStrokeSize(this._options.path.size);
        for (let i = 0; i < node._children.length; i++) {
            this.canvas.drawLine(node.position.x + this.camera.position.x, node.position.y + this.camera.position.y, node[i].position.x + this.camera.position.x, node[i].position.y + this.camera.position.y);
        }
    }
}
exports.default = Renderer;

},{"./Camera":1,"./Canvas":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Point2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.default = Point2D;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("./Components/Renderer");
class TreesJS {
    constructor(id, options) {
        if (options === undefined) {
            options = {};
        }
        if (options.node === undefined) {
            options.node = {};
        }
        if (options.node.color === undefined) {
            options.node.color = "#FFAA55";
        }
        if (options.node.rounded === undefined) {
            options.node.rounded = 4;
        }
        if (options.node.stroke === undefined) {
            options.node.stroke = {};
        }
        if (options.node.stroke.color === undefined) {
            options.node.stroke.color = "#000";
        }
        if (options.node.stroke.size === undefined) {
            options.node.stroke.size = 0;
        }
        if (options.path === undefined) {
            options.path = {};
        }
        if (options.path.color === undefined) {
            options.path.color = "#55AAFF";
        }
        if (options.path.size === undefined) {
            options.path.size = 2;
        }
        if (options.text === undefined) {
            options.text = {};
        }
        if (options.text.color === undefined) {
            options.text.color = "#FFF";
        }
        if (options.text.family === undefined) {
            options.text.family = "Arial";
        }
        if (options.text.size === undefined) {
            options.text.size = 18;
        }
        if (options.text.stroke === undefined) {
            options.text.stroke = {};
        }
        if (options.text.stroke.color === undefined) {
            options.text.stroke.color = "#000";
        }
        if (options.text.stroke.size === undefined) {
            options.text.stroke.size = 0;
        }
        if (options.shadow === undefined) {
            options.shadow = {};
        }
        if (options.shadow.node === undefined) {
            options.shadow.node = {};
        }
        if (options.shadow.node === undefined) {
            options.shadow.node.blur = 8;
        }
        if (options.shadow.node === undefined) {
            options.shadow.node.color = "rgba(0, 0, 0, 0.25)";
        }
        if (options.shadow.node === undefined) {
            options.shadow.node.offsetX = 0;
        }
        if (options.shadow.node === undefined) {
            options.shadow.node.offsetY = 4;
        }
        if (options.shadow.path === undefined) {
            options.shadow.path = {};
        }
        if (options.shadow.path === undefined) {
            options.shadow.path.blur = 0;
        }
        if (options.shadow.path === undefined) {
            options.shadow.path.color = "#000";
        }
        if (options.shadow.path === undefined) {
            options.shadow.path.offsetX = 0;
        }
        if (options.shadow.path === undefined) {
            options.shadow.path.offsetY = 0;
        }
        if (options.shadow.text === undefined) {
            options.shadow.text = {};
        }
        if (options.shadow.text === undefined) {
            options.shadow.text.blur = 0;
        }
        if (options.shadow.text === undefined) {
            options.shadow.text.color = "#000";
        }
        if (options.shadow.text === undefined) {
            options.shadow.text.offsetX = 0;
        }
        if (options.shadow.text === undefined) {
            options.shadow.text.offsetY = 0;
        }
        this._renderer = new Renderer_1.default(id, options);
    }
}
exports.default = TreesJS;
/*
// Example of options object.
options = {
  node: {
    color: "#FFAA55",
    rounded: 5,
    stroke: {
      color: "#000"
      size: 0
    }
  },
  path: {
    color: "#55AAFF",
    size: 2
  },
  text: {
    color: "#FFF",
    family: "Arial",
    size: 18,
    stroke: {
      color: "#000",
      size: 0
    }
  },
  shadow: {
    node: {
      blur: 8,
      color: "rgba(0, 0, 0, 0.25)",
      offsetX: 0,
      offsetY: 4
    },
    path: {
      blur: 0,
      color: "#000",
      offsetX: 0,
      offsetY: 0
    },
    text: {
      blur: 0,
      color: "#000",
      offsetX: 0,
      offsetY: 0
    }
  }
}
*/
window.TreesJS = TreesJS;

},{"./Components/Renderer":3}]},{},[5])

//# sourceMappingURL=trees.bundle.js.map
