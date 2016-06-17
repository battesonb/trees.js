'use strict';

/**
 * Creates an abstract object representation of the webgl canvas on the dom.
 * @param id The id of the canvas in the document.
 * @param options
 * <ul>
 *     <li>width - Sets the width of the canvas. Default is 200px.</li>
 *     <li>height - Sets the height of the canvas. Default is 200px.</li>
 * </ul>
 * @constructor
 */
function WebGL(id, options) {
	this.dom = document.getElementById(id);
	this.ctx = this.dom.getContext('experimental-webgl');
	if(options) {
		if (options.width) {
			this.dom.setAttribute('width', options.width);
			this.width = options.width;
		}
		else {
			this.dom.setAttribute('width', '200');
			this.width = 200;
		}
		if (options.height) {
			this.dom.setAttribute('height', options.height);
			this.height = options.height;
		} else {
			this.dom.setAttribute('height', '200');
			this.height = 200;
		}
	} else {
		this.width = Number(this.dom.getAttribute('width'));
		if(this.width == 0) {
			this.width = 200;
			this.dom.setAttribute('width', this.width);
		}
		this.height = Number(this.dom.getAttribute('height'));
		if(this.height == 0) {
			this.height = 200;
			this.dom.setAttribute('height', this.height);
		}
	}
}

/**
 * Clears the canvas.
 */
WebGL.prototype.clear = function() {
	
}

var NODE_WIDTH = 120;
var NODE_HEIGHT = 35;

/**
 * Draws a tree.
 * @param tree The tree data structure to traverse.
 */
WebGL.prototype.drawTree = function(tree) {
	
}

module.exports = Canvas;

// Will most likely abandon canvas for webgl, or at least do it after webgl.