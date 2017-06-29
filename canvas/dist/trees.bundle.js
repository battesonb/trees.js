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
        this.zoom = Math.max(0.35, Math.min(50, zoom));
    }
    getZoom() {
        return this.zoom;
    }
    decZoom(amt, x, y) {
        let newZoom = this.zoom - amt;
        this.setZoom(newZoom);
    }
}
exports.default = Camera;

},{"../Types/Point2D":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Collider_1 = require("./Collider");
/**
 * Represents an AABB with top-left alignment.
 */
class AABB extends Collider_1.default {
    constructor(x, y, width = 0, height = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
    contains(x, y) {
        return x >= this.position.x && y >= this.position.y && x <= this.position.x + this.getWidth() && y <= this.position.y + this.getHeight();
    }
    overlaps(other) {
        if (other instanceof AABB) {
            let deltaX = Math.abs(this.position.x - other.position.x);
            let deltaY = Math.abs(this.position.y - other.position.y);
            return (deltaX <= this.width || deltaX <= other.width) && (deltaY <= this.height || deltaY <= other.height);
        } else {
            throw Error("Unknown collider type, cannot determine overlap.");
        }
    }
    topLeft() {
        return this.position;
    }
    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    setHeight(height) {
        this.height = height;
    }
    setWidth(width) {
        this.width = width;
    }
}
exports.default = AABB;

},{"./Collider":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Types/Point2D");
class Collider {
    constructor(x, y) {
        this.position = new Point2D_1.default(x, y);
    }
}
exports.default = Collider;

},{"../../Types/Point2D":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../Types/Point2D");
const SpatialHash_1 = require("./SpatialHash");
let self;
class EventSystem {
    constructor(camera, renderer, stage, tree) {
        self = this; // Ugly, but binds require handlers.
        this.hash = new SpatialHash_1.default(); // TODO deterrmine this using the node sizes!
        this.camera = camera;
        this.stage = stage;
        this.currentNode = null;
        this.renderer = renderer;
        this.moved = false;
        tree.each(node => {
            this.hash.add(node);
        });
        this.stage.dom.addEventListener("mousedown", this.mouseDown);
        this.stage.dom.addEventListener("mousemove", this.mouseMove);
        this.stage.dom.addEventListener("mousewheel", this.mouseWheel);
        this.redraw();
    }
    getEventPoint(event) {
        return new Point2D_1.default(event.offsetX, event.offsetY);
    }
    mouseDown(event) {
        let point = self.getEventPoint(event);
        self.currentNode = self.hash.find(point.x / self.camera.getZoom() - self.camera.position.x, point.y / self.camera.getZoom() - self.camera.position.y);
        if (self.currentNode) {
            self.currentNode.bringToFront();
        }
        self.moved = false;
        self.x = point.x;
        self.y = point.y;
        window.addEventListener("mousemove", self.mouseDrag);
        window.addEventListener("mouseup", self.mouseUp);
    }
    mouseWheel(event) {
        let point = self.getEventPoint(event);
        self.camera.decZoom(event.deltaY / 250, point.x, point.y);
        self.redraw();
    }
    mouseDrag(event) {
        let point = self.getEventPoint(event);
        let dx = (point.x - self.x) / self.camera.getZoom();
        let dy = (point.y - self.y) / self.camera.getZoom();
        if (self.currentNode === null) {
            self.camera.position.x += dx;
            self.camera.position.y += dy;
        } else {
            self.hash.move(self.currentNode, dx, dy);
        }
        self.moved = true;
        self.redraw();
        self.x = point.x;
        self.y = point.y;
    }
    mouseMove(event) {
        let point = self.getEventPoint(event);
        let hoverNode = self.hash.find(point.x / self.camera.getZoom() - self.camera.position.x, point.y / self.camera.getZoom() - self.camera.position.y);
        if (hoverNode) {
            self.stage.dom.style.cursor = "pointer";
        } else {
            self.stage.dom.style.cursor = "auto";
        }
    }
    mouseUp(event) {
        if (!self.moved) {
            self.renderer.setSelectedNode(self.currentNode);
            self.redraw();
        }
        self.currentNode = null;
        window.removeEventListener("mousemove", self.mouseDrag);
        window.removeEventListener("mouseup", self.mouseUp);
    }
    redraw() {
        self.renderer.clear();
        self.renderer.drawTree();
        self.renderer.drawHashGroups(self.hash); // Debug Spatial Hash
    }
}
exports.default = EventSystem;

},{"../Types/Point2D":10,"./SpatialHash":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CanvasRenderer {
    constructor(camera, canvas, tree, options) {
        this.canvas = canvas;
        this.camera = camera;
        this.tree = tree;
        this.options = options;
        this.canvas.setFontFamily(options.text.family);
        // TODO Set up node widths/heights/padding
        this.tree.each(node => {
            node.setWidth(this.canvas.getTextWidth(node.getText()) + this.options.node.padding * 3);
            node.setHeight(this.options.text.size + this.options.node.padding * 2);
        });
    }
    clear() {
        this.canvas.clear();
    }
    drawTree() {
        this.tree.each(node => {
            this.drawPaths(node);
        });
        this.tree.each(node => {
            if (node === this.selectedNode) {
                this.drawNode(node, true);
            } else {
                this.drawNode(node);
            }
        });
    }
    /**
     * A debugging method for visualising how the spatial hash looks.
     */
    drawHashGroups(hash) {
        this.canvas.setStroke("#77BBFF");
        this.canvas.setStrokeSize(0.5);
        this.canvas.clearShadows();
        let hor = this.camera.position.x % hash.getBucketSize() * this.camera.getZoom();
        while (hor < this.canvas.getWidth()) {
            this.canvas.drawLine(hor, 0, hor, this.canvas.getHeight());
            hor += hash.getBucketSize() * this.camera.getZoom();
        }
        let vert = this.camera.position.y % hash.getBucketSize() * this.camera.getZoom();
        while (vert < this.canvas.getHeight()) {
            this.canvas.drawLine(0, vert, this.canvas.getWidth(), vert);
            vert += hash.getBucketSize() * this.camera.getZoom();
        }
    }
    drawNode(node, selected) {
        if (this.options.shadow.node.blur > 0) {
            this.canvas.enableShadows(this.options.shadow.node.blur, this.options.shadow.node.offsetX * this.camera.getZoom(), this.options.shadow.node.offsetY * this.camera.getZoom(), this.options.shadow.node.color);
        } else {
            this.canvas.clearShadows();
        }
        if (selected) {
            this.canvas.setStroke(this.options.node.selected.stroke.color);
            this.canvas.setStrokeSize(this.options.node.selected.stroke.size);
            this.canvas.setFill(this.options.node.selected.color);
        } else {
            this.canvas.setStroke(this.options.node.stroke.color);
            this.canvas.setStrokeSize(this.options.node.stroke.size);
            this.canvas.setFill(this.options.node.color);
        }
        this.canvas.drawRoundedRect((node.position.x + this.camera.position.x) * this.camera.getZoom(), (node.position.y + this.camera.position.y) * this.camera.getZoom(), node.getWidth() * this.camera.getZoom(), node.getHeight() * this.camera.getZoom(), this.options.node.rounded * this.camera.getZoom(), false);
        if (this.options.shadow.text.blur > 0) {
            this.canvas.enableShadows(this.options.shadow.text.blur, this.options.shadow.text.offsetX * this.camera.getZoom(), this.options.shadow.text.offsetY * this.camera.getZoom(), this.options.shadow.text.color);
        } else {
            this.canvas.clearShadows();
        }
        this.canvas.setFontSize(this.options.text.size * this.camera.getZoom());
        this.canvas.setStroke(this.options.text.stroke.color);
        this.canvas.setStrokeSize(this.options.text.stroke.size);
        this.canvas.setFill(this.options.text.color);
        this.canvas.drawText(node.getText(), (node.position.x + this.camera.position.x + this.options.node.padding) * this.camera.getZoom(), (node.position.y + this.camera.position.y + this.options.node.padding) * this.camera.getZoom(), this.options.text.stroke.size > 0, 100 * this.camera.getZoom());
    }
    drawPaths(node) {
        if (this.options.shadow.path.blur > 0) {
            this.canvas.enableShadows(this.options.shadow.path.blur, this.options.shadow.path.offsetX * this.camera.getZoom(), this.options.shadow.path.offsetY * this.camera.getZoom(), this.options.shadow.path.color);
        } else {
            this.canvas.clearShadows();
        }
        this.canvas.setStroke(this.options.path.color);
        this.canvas.setStrokeSize(this.options.path.size);
        for (let i = 0; i < node.childCount(); i++) {
            let child = node.getChildAt(i);
            this.canvas.drawLine((node.position.x + node.getWidth() / 2 + this.camera.position.x) * this.camera.getZoom(), (node.position.y + node.getHeight() / 2 + this.camera.position.y) * this.camera.getZoom(), (child.position.x + child.getWidth() / 2 + this.camera.position.x) * this.camera.getZoom(), (child.position.y + child.getHeight() / 2 + this.camera.position.y) * this.camera.getZoom());
        }
    }
    setSelectedNode(node) {
        this.selectedNode = node;
    }
}
exports.default = CanvasRenderer;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../Types/Point2D");
/**
 * A spatial hash based on AABB world coordinates.
 */
class SpatialHash {
    constructor(bucketSize = 100) {
        this.map = {};
        this.bucketSize = bucketSize;
        this.inverseBucketSize = 1 / bucketSize;
    }
    getBucketSize() {
        return this.bucketSize;
    }
    clear() {
        this.map = {};
    }
    /**
     * Given a collider, return the points within the hash in which the collider lies.
     * @param collider The collider
     */
    getPoints(collider) {
        let points = [];
        let position = collider.topLeft();
        let width = collider.getWidth();
        let height = collider.getHeight();
        for (let moveH = Math.floor(position.x * this.inverseBucketSize); moveH * this.bucketSize <= position.x + width; moveH += 1) {
            for (let moveV = Math.floor(position.y * this.inverseBucketSize); moveV * this.bucketSize <= position.y + height; moveV += 1) {
                let x = moveH * this.bucketSize;
                let y = moveV * this.bucketSize;
                points.push(new Point2D_1.default(x, y));
            }
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
            if (this.map[hash] === undefined) {
                this.map[hash] = new Set();
            }
            this.map[hash].add(collider);
        });
    }
    /**
     * Removes the given collider from the hash and deletes any empty sets in the process.
     * @param collider
     * @return true if collider is removed, false otherwise.
     */
    remove(collider) {
        let removed = false;
        let points = this.getPoints(collider);
        points.forEach(point => {
            let hash = this.toHashLong(point.x, point.y);
            if (this.map[hash] !== undefined) {
                if (this.map[hash].delete(collider)) {
                    removed = true;
                    if (this.map[hash].size == 0) {
                        delete this.map[hash];
                    }
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
        let set = this.map[hash];
        if (set) {
            return Array.from(set);
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
     * TODO convert this to support more numbers by making the map of type:
     *   private map: { [x: number]: { [y: number] : Set<Collider> } };
     *   (also removes the need for a point-hashing function)
     * @param point
     */
    toHashLong(x, y) {
        x = Math.floor(x * this.inverseBucketSize) & 0xFFFF; // cast to 16-bit
        y = (Math.floor(y * this.inverseBucketSize) & 0xFFFF) << 15; // cast to 16-bit and then shift 15-bits to the left.
        return x | y;
    }
}
exports.default = SpatialHash;

},{"../Types/Point2D":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CanvasStage {
    constructor(id) {
        this.dom = document.getElementById(id);
        this.context = this.dom.getContext("2d");
        this.context.textBaseline = "top";
        this.fontSize = 18;
        this.fontFamily = "Arial";
        this.updateFont();
    }
    getWidth() {
        return this.dom.width;
    }
    getHeight() {
        return this.dom.height;
    }
    clear() {
        this.context.clearRect(0, 0, this.dom.width, this.dom.height);
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
        this.fontSize = size;
        this.updateFont();
    }
    setFontFamily(family) {
        this.fontFamily = family;
        this.updateFont();
    }
    updateFont() {
        this.context.font = this.fontSize + "px " + this.fontFamily;
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
exports.default = CanvasStage;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = require("../Components/Colliders/AABB");
/**
 * The representation of a node of the tree.
 */
class Node extends AABB_1.default {
    constructor(text, id = -1, x = 0, y = 0) {
        super(x, y);
        this.setText(text);
        this.setId(id);
        this.children = [];
        this.setWidth(70); // TEMPORARY, TODO DELETE THIS
        this.setHeight(24);
    }
    /**
     * Sets the identifier of the node. Uniqueness of the identifier is not determined.
     * @param id
     */
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    setText(text) {
        this.text = text;
    }
    getText() {
        return this.text;
    }
    /**
     * Adds a child to the current node and sets the parent of the child as the object of the calling the method.
     * @param child
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    /**
     * Gets the child with a specific identifier.
     * TODO make faster with a binary search, maybe? Probably not though.
     * - Unlikely if we reorder children with bringToFront.
     * - Search time is O(n) and nodes aren't expected to have considerably many children.
     *    - If this becomes the case, remove bringToFront and implement binary search.
     * @param id
     */
    getChild(id) {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.getId() === id) {
                return child;
            }
        }
        return null;
    }
    /**
     * Gets a child by its index.
     * @param index
     */
    getChildAt(index) {
        return this.children[index];
    }
    /**
     * Returns the number of children this node has.
     */
    childCount() {
        return this.children.length;
    }
    /**
     * Performs a callback function on each child node of this node.
     * @param callback
     */
    foreachChild(callback) {
        for (let i = 0; i < this.children.length; i++) {
            callback(this.getChildAt(i), i);
        }
    }
    /**
     * Brings this node to the front of the parent's children.
     */
    bringToFront() {
        let parent = this.parent;
        if (parent) {
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i] === this) {
                    parent.children.splice(i, 1);
                    break;
                }
            }
            parent.children.push(this);
        }
    }
}
exports.default = Node;

},{"../Components/Colliders/AABB":2}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class Tree {
    /**
     * Builds the tree given a nested json object representing the nodes of the tree.
     * Allowed attributes include: text, x, y, children, and id.
     * @param json Representation of the tree.
     * @param stage Stage object for measuring width/height and determining text-wrapping of nodes.
     */
    constructor(json, stage) {
        this.addNode(json);
        console.log(this);
    }
    addNode(descent, node) {
        if (descent !== undefined && descent !== null) {
            if (descent["text"] !== undefined) {
                let id = descent["id"] !== undefined ? descent["id"] : -1;
                let x = descent["x"] !== undefined ? descent["x"] : 0;
                let y = descent["y"] !== undefined ? descent["y"] : 0;
                let child = new Node_1.default(descent["text"], id, x, y);
                if (node === undefined || node === null) {
                    this.root = child;
                    node = this.root;
                } else {
                    node.addChild(child);
                }
                if (descent["children"] !== undefined) {
                    for (let i = 0; i < descent["children"].length; i++) {
                        this.addNode(descent["children"][i], child);
                    }
                }
            }
        }
    }
    /**
     * Performs a callback on each node of this tree. Default behaviour is a depth-first on
     * the root node.
     * TODO add breadth-first descent.
     * @param callback
     * @param breadthFirst Defaults to false.
     * @param node The node to start the descent from.
     * @param level Start counting levels from this parameter's value.
     * @param index Index of node
     */
    each(callback, breadthFirst, node = this.root, level = 0, index = 0) {
        if (node !== undefined && node !== null) {
            if (!breadthFirst) {
                callback(node, level, index);
                for (let i = 0; i < node.childCount(); i++) {
                    this.each(callback, breadthFirst, node.getChildAt(i), level + 1, i);
                }
            } else {
                let list = [];
                let nextList = [];
                list.push(node);
                while (list.length > 0) {
                    let currNode = list.splice(0, 1)[0];
                    currNode.foreachChild((node, index) => {
                        nextList.push(node);
                    });
                    callback(currNode, level, index);
                    index++;
                    if (list.length === 0) {
                        list = nextList;
                        nextList = [];
                        level++;
                        index = 0;
                    }
                }
            }
        }
    }
    /**
     * Returns the number of nodes within this tree.
     */
    children() {
        let count = 0;
        this.each(node => {
            count++;
        });
        return count;
    }
}
exports.default = Tree;

},{"./Node":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Point2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.default = Point2D;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("./Components/Camera");
const CanvasStage_1 = require("./Components/Stage/CanvasStage");
const EventSystem_1 = require("./Components/EventSystem");
const CanvasRenderer_1 = require("./Components/Renderer/CanvasRenderer");
const Tree_1 = require("./Models/Tree");
class TreesJS {
    constructor(id, json, options) {
        if (options === undefined) {
            options = {};
        }
        if (options.node === undefined) {
            options.node = {};
        }
        if (options.node.color === undefined) {
            options.node.color = "#55AAFF";
        }
        if (options.node.rounded === undefined) {
            options.node.rounded = 4;
        }
        if (options.node.padding === undefined) {
            options.node.padding = 4;
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
        if (options.node.selected === undefined) {
            options.node.selected = {};
        }
        if (options.node.selected.color === undefined) {
            options.node.selected.color = "#FFAA55";
        }
        if (options.node.selected.stroke === undefined) {
            options.node.selected.stroke = {};
        }
        if (options.node.selected.stroke.color === undefined) {
            options.node.selected.stroke.color = "#000";
        }
        if (options.node.selected.stroke.size === undefined) {
            options.node.selected.stroke.size = 1;
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
            options.shadow.path.blur = 1;
        }
        if (options.shadow.path.color === undefined) {
            options.shadow.path.color = "rgba(0, 0, 0, 0.25)";
        }
        if (options.shadow.path.offsetX === undefined) {
            options.shadow.path.offsetX = 0;
        }
        if (options.shadow.path.offsetY === undefined) {
            options.shadow.path.offsetY = 4;
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
        this.camera = new Camera_1.default(0, 0, 1);
        this.stage = new CanvasStage_1.default(id);
        this.tree = new Tree_1.default(json, this.stage);
        this.renderer = new CanvasRenderer_1.default(this.camera, this.stage, this.tree, options);
        this.eventSystem = new EventSystem_1.default(this.camera, this.renderer, this.stage, this.tree);
    }
}
exports.default = TreesJS;
/*
// Example of options object.
options = {
  node: {
    color: "#FFAA55",
    rounded: 5,
    padding: 5,
    stroke: {
      color: "#000"
      size: 0
    },
    selected {
      color: "#FFAA55",
      stroke: {
        color: "#000"
        size: 0
      }
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

},{"./Components/Camera":1,"./Components/EventSystem":4,"./Components/Renderer/CanvasRenderer":5,"./Components/Stage/CanvasStage":7,"./Models/Tree":9}]},{},[11])

//# sourceMappingURL=trees.bundle.js.map
