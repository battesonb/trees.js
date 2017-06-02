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

},{"../Types/Point2D":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.context.textBaseline = "top";
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
const Collider_1 = require("./Collider");
/**
 * Represents an AABB with top-left alignment.
 */
class AABB extends Collider_1.default {
    constructor(x, y, width = 0, height = 0) {
        super(x, y);
        this._width = width;
        this._height = height;
    }
    contains(x, y) {
        return x >= this.position.x && y >= this.position.y && x <= this.position.x + this.width() && y <= this.position.x + this.height();
    }
    overlaps(other) {
        if (other instanceof AABB) {
            return Math.abs(this.position.x - other.position.x) * 2 < this.width() + other.width() && Math.abs(this.position.y - other.position.y) * 2 < this.height() + other.height();
        }
        throw Error("Unknown collider type, cannot determine overlap.");
    }
    topLeft() {
        return this.position;
    }
    height() {
        return this._height;
    }
    width() {
        return this._width;
    }
}
exports.default = AABB;

},{"./Collider":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Types/Point2D");
class Collider {
    constructor(x, y) {
        this.position = new Point2D_1.default(x, y);
    }
}
exports.default = Collider;

},{"../../Types/Point2D":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SpatialHash_1 = require("./SpatialHash");
class EventSystem {
    constructor(camera, renderer) {
        this._hash = new SpatialHash_1.default(24);
        this._camera = camera;
        this._currentNode = null;
        this._renderer = renderer;
        window.addEventListener("mousedown", this.mouseDown.bind(this));
    }
    mouseDown(event) {
        this._currentNode = this._hash.find(event.clientX / this._camera.getZoom() - this._camera.position.x, event.clientY / this._camera.getZoom() + this._camera.position.x);
        this._clientX = event.clientX;
        this._clientY = event.clientY;
        window.addEventListener("mousemove", this.mouseMove.bind(this));
        window.addEventListener("mouseup", this.mouseUp.bind(this));
    }
    mouseMove(event) {
        let dx = (event.clientX - this._clientX) / this._camera.getZoom();
        let dy = (event.clientY - this._clientY) / this._camera.getZoom();
        if (this._currentNode === null) {
            this._camera.position.x += dx;
            this._camera.position.y += dy;
        } else {
            this._currentNode.position.x += dx;
            this._currentNode.position.y += dy;
        }
        this._renderer.clear();
        this._renderer.drawTree(undefined);
        this._clientX = event.clientX;
        this._clientY = event.clientY;
    }
    mouseUp(event) {
        console.log("HELLO?");
        this._currentNode = null;
        window.removeEventListener("mousemove", this.mouseMove);
        window.removeEventListener("mouseup", this.mouseUp);
    }
}
exports.default = EventSystem;

},{"./SpatialHash":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
const Node_1 = require("../Models/Node");
class Renderer {
    constructor(id, camera, options) {
        this.canvas = new Canvas_1.default(id);
        this._camera = camera;
        this._options = options;
        this.canvas.setFontFamily(options.text.family);
        this.drawTree(undefined);
    }
    clear() {
        this.canvas.clear();
    }
    drawTree(tree) {
        let node = new Node_1.default("Hello", 0);
        node._width = 70;
        node._height = 24;
        this.drawNode(node);
    }
    drawNode(node) {
        if (this._options.shadow.node.blur > 0) {
            this.canvas.enableShadows(this._options.shadow.node.blur, this._options.shadow.node.offsetX, this._options.shadow.node.offsetY, this._options.shadow.node.color);
        } else {
            this.canvas.clearShadows();
        }
        this.canvas.setStroke(this._options.node.stroke.color);
        this.canvas.setStrokeSize(this._options.node.stroke.size);
        this.canvas.setFill(this._options.node.color);
        this.canvas.drawRoundedRect((node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), node.width() * this._camera.getZoom(), node.height() * this._camera.getZoom(), this._options.node.rounded * this._camera.getZoom(), false);
        if (this._options.shadow.text.blur > 0) {
            this.canvas.enableShadows(this._options.shadow.text.blur, this._options.shadow.text.offsetX, this._options.shadow.text.offsetY, this._options.shadow.text.color);
        } else {
            this.canvas.clearShadows();
        }
        this.canvas.setFontSize(this._options.text.size * this._camera.getZoom());
        this.canvas.setStroke(this._options.text.stroke.color);
        this.canvas.setStrokeSize(this._options.text.stroke.size);
        this.canvas.setFill(this._options.text.color);
        this.canvas.drawText(node.getText(), (node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), this._options.text.stroke.size > 0, 100 * this._camera.getZoom());
    }
    drawPaths(node) {
        if (this._options.shadow.path.blur > 0) {
            this.canvas.enableShadows(this._options.shadow.path.blur, this._options.shadow.path.offsetX, this._options.shadow.path.offsetY, this._options.shadow.path.color);
        } else {
            this.canvas.clearShadows();
        }
        this.canvas.setStroke(this._options.path.color);
        this.canvas.setStrokeSize(this._options.path.size);
        for (let i = 0; i < node._children.length; i++) {
            this.canvas.drawLine((node.position.x + this._camera.position.x) * this._camera.getZoom(), (node.position.y + this._camera.position.y) * this._camera.getZoom(), (node[i].position.x + this._camera.position.x) * this._camera.getZoom(), (node[i].position.y + this._camera.position.y) * this._camera.getZoom());
        }
    }
}
exports.default = Renderer;

},{"../Models/Node":8,"./Canvas":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../Types/Point2D");
/**
 * A spatial hash based on AABB world coordinates.
 */
class SpatialHash {
    constructor(bucketSize = 24) {
        this._map = {};
        this._bucketSize = bucketSize;
        this._inverseBucketSize = 1 / bucketSize;
    }
    /**
     * Given a collider, return the points within the hash in which the collider lies.
     * @param collider The collider
     */
    getPoints(collider) {
        let points = [];
        let moveH = 0;
        let position = collider.topLeft();
        let width = collider.width();
        let height = collider.height();
        while (true) {
            let moveV = 0;
            while (true) {
                let x = Math.floor((position.x + moveH) * this._inverseBucketSize);
                let y = Math.floor((position.y + moveV) * this._inverseBucketSize);
                points.push(new Point2D_1.default(x, y));
                if (moveV > height) {
                    break;
                }
                moveV += this._bucketSize;
            }
            if (moveH > width) {
                break;
            }
            moveH += this._bucketSize;
        }
        return points;
    }
    /**
     * Add a collider to the hash, assuming it is not already within the hash.
     * @param collider
     */
    add(collider) {
        let points = this.getPoints(collider);
        points.forEach(point => {
            let hash = this.toHashLong(point.x, point.y);
            if (this._map[hash] === undefined) {
                this._map[hash] = new Set();
            }
            this._map[hash].add(collider);
        });
    }
    /**
     * Removes the given collider from the hash.
     * @param collider
     * @return true if collider is removed, false otherwise.
     */
    remove(collider) {
        let removed = false;
        let points = this.getPoints(collider);
        points.forEach(point => {
            let hash = this.toHashLong(point.x, point.y);
            if (this._map[hash] !== undefined) {
                if (this._map[hash].delete(collider)) {
                    removed = true;
                }
            }
        });
        return removed;
    }
    /**
     * Given a world-point, return an array of all colliders in the corresponding segment.
     * @param x
     * @param y
     */
    getNearby(x, y) {
        let hash = this.toHashLong(x, y);
        let set = this._map[hash];
        if (set) {
            return set.entries();
        }
        return [];
    }
    /**
     * Given a world-point, return the first collider containing the world-point in the corresponding segment.
     * @param x
     * @param y
     */
    find(x, y) {
        let colliders = this.getNearby(x, y);
        for (let i = 0; i < colliders.length; i++) {
            if (colliders[i].contains(x, y)) {
                return colliders[i];
            }
        }
        return null;
    }
    /**
     * Given a collider in the hash, move it by x and y points.
     * @param collider
     * @param x
     * @param y
     */
    move(collider, x, y) {
        this.remove(collider);
        collider.position.x += x;
        collider.position.y += y;
        this.add(collider);
    }
    /**
     * Convert a point to a unique 32-bit number representing the x/y coordinates in the hash.
     * @param point
     */
    toHashLong(x, y) {
        x = Math.round(x) & 0xFFFF; // cast to 16-bit
        y = (Math.round(y) & 0xFFFF) << 32; // cast to 16-bit and then shift 15-bits to the left.
        return x | y;
    }
}
exports.default = SpatialHash;

},{"../Types/Point2D":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = require("../Components/Colliders/AABB");
/**
 * The representation of a node of the tree.
 */
class Node extends AABB_1.default {
    constructor(text, id = undefined, x = 0, y = 0) {
        super(x, y);
        this.setText(text);
        this.setId(id);
    }
    /**
     * Sets the identifier of the node. Uniqueness of the identifier is not determined.
     * @param id
     */
    setId(id) {
        this._id = id;
    }
    getId() {
        return this._id;
    }
    setText(text) {
        this._text = text;
    }
    getText() {
        return this._text;
    }
    /**
     * Adds a child to the current node and sets the parent of the child as the object of the calling the method.
     * @param child
     */
    addChild(child) {
        this._children.push(child);
        child.parent = this;
    }
    /**
     * Gets the child with a specific identifier.
     * TODO make faster with a binary search, maybe? Probably not though.
     * @param id
     */
    getChild(id) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child.getId() === id) {
                return child;
            }
        }
        return null;
    }
}
exports.default = Node;

},{"../Components/Colliders/AABB":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Point2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.default = Point2D;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("./Components/Camera");
const EventSystem_1 = require("./Components/EventSystem");
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
        if (options.shadow.node.blur === undefined) {
            options.shadow.node.blur = 8;
        }
        if (options.shadow.node.color === undefined) {
            options.shadow.node.color = "rgba(0, 0, 0, 0.25)";
        }
        if (options.shadow.node.offsetX === undefined) {
            options.shadow.node.offsetX = 0;
        }
        if (options.shadow.node.offsetY === undefined) {
            options.shadow.node.offsetY = 4;
        }
        if (options.shadow.path === undefined) {
            options.shadow.path = {};
        }
        if (options.shadow.path.blur === undefined) {
            options.shadow.path.blur = 0;
        }
        if (options.shadow.path.color === undefined) {
            options.shadow.path.color = "#000";
        }
        if (options.shadow.path.offsetX === undefined) {
            options.shadow.path.offsetX = 0;
        }
        if (options.shadow.path.offsetY === undefined) {
            options.shadow.path.offsetY = 0;
        }
        if (options.shadow.text === undefined) {
            options.shadow.text = {};
        }
        if (options.shadow.text.blur === undefined) {
            options.shadow.text.blur = 1;
        }
        if (options.shadow.text.color === undefined) {
            options.shadow.text.color = "rgba(0, 0, 0, 0.3)";
        }
        if (options.shadow.text.offsetX === undefined) {
            options.shadow.text.offsetX = 0;
        }
        if (options.shadow.text.offsetY === undefined) {
            options.shadow.text.offsetY = 0;
        }
        this._camera = new Camera_1.default(0, 0, 2);
        this._renderer = new Renderer_1.default(id, this._camera, options);
        this._eventSystem = new EventSystem_1.default(this._camera, this._renderer);
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

},{"./Components/Camera":1,"./Components/EventSystem":5,"./Components/Renderer":6}]},{},[10])

//# sourceMappingURL=trees.bundle.js.map
