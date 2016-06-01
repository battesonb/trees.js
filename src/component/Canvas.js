'use strict';

/**
 * Creates an abstract object representation of the canvas on the dom.
 * @param id The id of the canvas in the document.
 * @param options
 * <ul>
 *     <li>width - Sets the width of the canvas. Default is 200px.</li>
 *     <li>height - Sets the height of the canvas. Default is 200px.</li>
 * </ul>
 * @constructor
 */
function Canvas(id, options) {
	this.dom = document.getElementById(id);
	this.ctx = this.dom.getContext('2d');
	if(options) {
		if (options.width) {
			this.dom.setAttribute('width', options.width + 'px');
			this.width = options.width;
		}
		else {
			this.dom.setAttribute('width', '200px');
			this.width = 200;
		}
		if (options.height) {
			this.dom.setAttribute('height', options.height + 'px');
			this.height = options.height;
		} else {
			this.dom.setAttribute('height', '200px');
			this.height = 200;
		}
	} else {
		this.width = Number(this.dom.getAttribute('width'));
		if(this.width == 0) {
			this.width = 200;
			this.dom.setAttribute('width', this.width + 'px');
		}
		this.height = Number(this.dom.getAttribute('height'));
		if(this.height == 0) {
			this.height = 200;
			this.dom.setAttribute('height', this.height + 'px');
		}
	}
}

/**
 * Clears the canvas.
 */
Canvas.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

var NODE_WIDTH = 120;
var NODE_HEIGHT = 35;

/**
 * Draws a tree.
 * @param tree The tree data structure to traverse.
 */
Canvas.prototype.drawTree = function(tree) {
	this.clear();
	var ctx = this.ctx;
	ctx.fillStyle = '#88AAFF';
	ctx.strokeStyle = '#5577FF';
	ctx.lineWidth = 2;
	tree.traverse(function(node, level, index, parent) {
		if(parent) {
			var offset = {};
			if(node.x > parent.x + NODE_WIDTH) {
				offset.parX = NODE_WIDTH;
				offset.x = 0;
				offset.parY = NODE_HEIGHT / 2;
				offset.y = NODE_HEIGHT / 2;
			} else if(node.x + NODE_WIDTH < parent.x) {
				offset.parX = 0;
				offset.x = NODE_WIDTH;
				offset.parY = NODE_HEIGHT / 2;
				offset.y = NODE_HEIGHT / 2;
			} else if(node.y > parent.y + NODE_HEIGHT) {
				offset.parX = NODE_WIDTH / 2;
				offset.x = NODE_WIDTH / 2;
				offset.parY = NODE_HEIGHT;
				offset.y = 0;
			} else if(node.y + NODE_HEIGHT < parent.y) {
				offset.parX = NODE_WIDTH / 2;
				offset.x = NODE_WIDTH / 2;
				offset.parY = 0;
				offset.y = NODE_HEIGHT;
			}

			ctx.moveTo(parent.x + offset.parX, parent.y + offset.parY);
			//ctx.lineTo(node.x + offset.x, node.y + offset.y);
			ctx.bezierCurveTo((parent.x + offset.parX + node.x + offset.x) / 2, parent.y + offset.parY, (parent.x + offset.parX + node.x + offset.x) / 2, node.y + offset.y, node.x + offset.x, node.y + offset.y);
		}
		ctx.stroke();
	});
	tree.traverse(function(node, level, index, parent) {
		ctx.fillRect(node.x, node.y, NODE_WIDTH, NODE_HEIGHT);
	});
}

module.exports = Canvas;