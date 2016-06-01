/**
 * Creates an abstract object representation of the svg on the dom.
 * @param id The id of the svg in the document.
 * @param options
 * <ul>
 *     <li>width - Sets the width of the svg. Default is 200px.</li>
 *     <li>height - Sets the height of the svg. Default is 200px.</li>
 * </ul>
 * @constructor
 */
function SVG(id, options) {
	this.dom = document.getElementById(id);
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

SVG.prototype.addBezier = function(mx, my, c1x, c1y, c2x, c2y, x, y, options) {
	var bezier = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	bezier.setAttribute('d', 'M' + mx + ' ' + my + ' C' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + x + ' ' + y);
	bezier.style.fill = 'none';

	if(!options) {
		options = {};
	}
	if(options.stroke)
		bezier.style.stroke = options.stroke;
	else
		bezier.style.stroke = "#000";
	if(options.strokeWidth)
		bezier.style.strokeWidth = options.strokeWidth;
	else
		bezier.style.strokeWidth = "2px";

	//this.dom.appendChild(bezier);
	this.dom.insertBefore(bezier, this.dom.firstChild);
	return bezier;
}

SVG.prototype.resetBezier = function(bezier, mx, my, c1x, c1y, c2x, c2y, x, y) {
	bezier.setAttribute('d', 'M' + mx + ' ' + my + ' C' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + x + ' ' + y);
}

// TO DO, AM LAZY
SVG.prototype.moveBezier = function(bezier, mx, my) {
	var s = bezier.getAttribute('d');
	var spaceIndex = s.indexOf(' ');
	var movedX = Number(s.substr(1, spaceIndex)) + mx;	
	var movedY = Number(s.substr(spaceIndex + 1, s.indexOf('C') - spaceIndex - 1)) + my;
	var r = 'M' + x + ' ' + y + s.substr(s.indexOf('C'), s.length - 1);
	bezier.setAttribute('d', r);
}

SVG.prototype.addCircle = function(cx, cy, r, options) {
	var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	circle.setAttribute("cx", cx);
	circle.setAttribute("cy", cy);
	circle.setAttribute("r", r);

	if(!options) {
		options = {};
	}
	if(options.fill)
		rect.style.fill = options.fill;
	else
		rect.style.fill = "#FFF";
	if(options.stroke)
		rect.style.stroke = options.stroke;
	else
		rect.style.stroke = "#000";
	if(options.strokeWidth)
		rect.style.strokeWidth = options.strokeWidth;
	else
		rect.style.strokeWidth = "2px";

	this.dom.appendChild(circle);
	return circle;
};


SVG.prototype.addRectangle = function(x, y, width, height, rx, ry, options) {
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute("x", x);
	rect.setAttribute("y", y);
	rect.setAttribute("width", width);
	rect.setAttribute("height", height);
	if(rx)
		rect.setAttribute("rx", rx);
	if(ry)
		rect.setAttribute("ry", ry);

	if(!options) {
		options = {};
	}
	if(options.fill)
		rect.style.fill = options.fill;
	else
		rect.style.fill = "#FFF";
	if(options.stroke)
		rect.style.stroke = options.stroke;
	else
		rect.style.stroke = "#000";
	if(options.strokeWidth)
		rect.style.strokeWidth = options.strokeWidth;
	else
		rect.style.strokeWidth = "2px";

	this.dom.appendChild(rect);
	return rect;
};

SVG.prototype.clear = function() {
	this.dom.innerHTML = "";
};

var NODE_WIDTH = 80;
var NODE_HEIGHT = 25;

/**
 * Draws a tree.
 * @param tree The tree data structure to traverse.
 */
SVG.prototype.drawTree = function(tree) {
	var self = this;
	self.clear();
	tree.traverse(function(node, level, index, parent) {
		var offset = getOffset(node, parent);
		node.offset = offset;
		if(parent) {
			var bezier = self.addBezier(parent.x + offset.parX, parent.y + offset.parY, (parent.x + offset.parX + node.x + offset.x) / 2, parent.y + offset.parY, (parent.x + offset.parX + node.x + offset.x) / 2, node.y + offset.y, node.x + offset.x, node.y + offset.y, {
				stroke: '#5577BB'
			});
			node.bezier = bezier;
		}

		var rect = self.addRectangle(node.x, node.y, NODE_WIDTH, NODE_HEIGHT, 5, 5, {
			fill: '#BBDDFF',
			stroke: '#88AADD'
		});
		node.rect = rect;
	});

	self.dragging = {};
	tree.traverse(function(node, level, index, parent) {
		node.rect.onmousedown = function(e) {
			self.dragging.node = node;
			self.dragging.parent = parent;
			self.dragging.anchorX = e.clientX - node.x;
			self.dragging.anchorY = e.clientY - node.y;
		}
		node.rect.addEventListener('touchstart', function(e) {
			self.dragging.node = node;
			self.dragging.parent = parent;
			self.dragging.anchorX = e.touches[0].clientX - node.x;
			self.dragging.anchorY = e.touches[0].clientY - node.y;
		});
	});

	self.dom.onmousedown = function(e) {
		if(e.target == self.dom) {
			self.dragging.dom = true;
		}
	}
	self.dom.addEventListener('touchstart', function(e) {
		if(e.target == self.dom) {
			self.dragging.dom = true;
			self.dragging.currX = e.touches[0].clientX;
			self.dragging.currY = e.touches[0].clientY;
		}
	});

	self.dom.onmousemove = function(e) {
		if(self.dragging.node) {
			self.dragging.node.x = e.clientX - self.dragging.anchorX;
			self.dragging.node.y = e.clientY - self.dragging.anchorY;
			self.dragging.node.rect.setAttribute('x', self.dragging.node.x);
			self.dragging.node.rect.setAttribute('y', self.dragging.node.y);
			var offset = getOffset(self.dragging.node, self.dragging.parent);
			self.dragging.node.offset = offset;
			if(self.dragging.node.bezier)
				self.resetBezier(self.dragging.node.bezier, self.dragging.parent.x + self.dragging.node.offset.parX, self.dragging.parent.y + self.dragging.node.offset.parY, (self.dragging.parent.x + self.dragging.node.offset.parX + self.dragging.node.x + self.dragging.node.offset.x) / 2, self.dragging.parent.y + self.dragging.node.offset.parY, (self.dragging.parent.x + self.dragging.node.offset.parX + self.dragging.node.x + self.dragging.node.offset.x) / 2, self.dragging.node.y + self.dragging.node.offset.y, self.dragging.node.x + self.dragging.node.offset.x, self.dragging.node.y + self.dragging.node.offset.y);
			for(var i = 0; i < self.dragging.node.children.length; i++) {
				if(self.dragging.node.children[i].bezier) {
					var offset = getOffset(self.dragging.node.children[i], self.dragging.node);
					self.dragging.node.offset = offset;
					self.resetBezier(self.dragging.node.children[i].bezier, self.dragging.node.x + self.dragging.node.offset.parX, self.dragging.node.y + self.dragging.node.offset.parY, (self.dragging.node.x + self.dragging.node.offset.parX + self.dragging.node.children[i].x + self.dragging.node.offset.x) / 2, self.dragging.node.y + self.dragging.node.offset.parY, (self.dragging.node.x + self.dragging.node.offset.parX + self.dragging.node.children[i].x + self.dragging.node.offset.x) / 2, self.dragging.node.children[i].y + self.dragging.node.offset.y, self.dragging.node.children[i].x + self.dragging.node.offset.x, self.dragging.node.children[i].y + self.dragging.node.offset.y);
				}
			}
		} else if(self.dragging.dom) {
			tree.traverse(function(node, level, index, parent) {
				node.x += e.movementX;
				node.y += e.movementY;
				node.rect.setAttribute('x', node.x);
				node.rect.setAttribute('y', node.y);
				if(node.bezier) {
					//self.moveBezier(node.bezier, e.movementX, e.movementY);
					var offset = getOffset(node, parent);
					node.offset = offset;
					self.resetBezier(node.bezier, parent.x + node.offset.parX, parent.y + node.offset.parY, (parent.x + node.offset.parX + node.x + node.offset.x) / 2, parent.y + node.offset.parY, (parent.x + node.offset.parX + node.x + node.offset.x) / 2, node.y + node.offset.y, node.x + node.offset.x, node.y + node.offset.y);
				}
			});
		}
	};
	self.dom.addEventListener('touchmove', function(e) {
		if(self.dragging.node) {
			self.dragging.node.x = e.touches[0].clientX - self.dragging.anchorX;
			self.dragging.node.y = e.touches[0].clientY - self.dragging.anchorY;
			self.dragging.node.rect.setAttribute('x', self.dragging.node.x);
			self.dragging.node.rect.setAttribute('y', self.dragging.node.y);
			var offset = getOffset(self.dragging.node, self.dragging.parent);
			self.dragging.node.offset = offset;
			if(self.dragging.node.bezier)
				self.resetBezier(self.dragging.node.bezier, self.dragging.parent.x + self.dragging.node.offset.parX, self.dragging.parent.y + self.dragging.node.offset.parY, (self.dragging.parent.x + self.dragging.node.offset.parX + self.dragging.node.x + self.dragging.node.offset.x) / 2, self.dragging.parent.y + self.dragging.node.offset.parY, (self.dragging.parent.x + self.dragging.node.offset.parX + self.dragging.node.x + self.dragging.node.offset.x) / 2, self.dragging.node.y + self.dragging.node.offset.y, self.dragging.node.x + self.dragging.node.offset.x, self.dragging.node.y + self.dragging.node.offset.y);
			for(var i = 0; i < self.dragging.node.children.length; i++) {
				if(self.dragging.node.children[i].bezier) {
					var offset = getOffset(self.dragging.node.children[i], self.dragging.node);
					self.dragging.node.offset = offset;
					self.resetBezier(self.dragging.node.children[i].bezier, self.dragging.node.x + self.dragging.node.offset.parX, self.dragging.node.y + self.dragging.node.offset.parY, (self.dragging.node.x + self.dragging.node.offset.parX + self.dragging.node.children[i].x + self.dragging.node.offset.x) / 2, self.dragging.node.y + self.dragging.node.offset.parY, (self.dragging.node.x + self.dragging.node.offset.parX + self.dragging.node.children[i].x + self.dragging.node.offset.x) / 2, self.dragging.node.children[i].y + self.dragging.node.offset.y, self.dragging.node.children[i].x + self.dragging.node.offset.x, self.dragging.node.children[i].y + self.dragging.node.offset.y);
				}
			}
		} else if(self.dragging.dom) {
			tree.traverse(function(node, level, index, parent) {
				console.log(e.touches[0].clientX - self.dragging.currX);
				node.x += e.touches[0].clientX - self.dragging.currX;
				node.y += e.touches[0].clientY - self.dragging.currY;
				node.rect.setAttribute('x', node.x);
				node.rect.setAttribute('y', node.y);
				if(node.bezier) {
					//self.moveBezier(node.bezier, e.movementX, e.movementY);
					var offset = getOffset(node, parent);
					node.offset = offset;
					self.resetBezier(node.bezier, parent.x + node.offset.parX, parent.y + node.offset.parY, (parent.x + node.offset.parX + node.x + node.offset.x) / 2, parent.y + node.offset.parY, (parent.x + node.offset.parX + node.x + node.offset.x) / 2, node.y + node.offset.y, node.x + node.offset.x, node.y + node.offset.y);
				}
			});
			self.dragging.currX = e.touches[0].clientX;
			self.dragging.currY = e.touches[0].clientY;
		}
	});

	self.dom.onmouseup = function(e) {
		self.dragging.node = undefined;
		self.dragging.dom = false;
	};
	self.dom.addEventListener('touchend', function(e) {
		self.dragging.node = undefined;
		self.dragging.dom = false;
	});
}

/**
 * Gets the offset required for the first and second control point for a bezier curve
 * given two nodes.
 * @param node the current node.
 * @param parent the current node's parent.
 */
function getOffset(node, parent) {
	if(parent == undefined)
		return {
			x: 0,
			y: 0,
			parX: 0,
			parY: 0
		};
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
	} else{ // node.y + NODE_HEIGHT < parent.y
		offset.parX = NODE_WIDTH / 2;
		offset.x = NODE_WIDTH / 2;
		offset.parY = 0;
		offset.y = NODE_HEIGHT;
	}
	return offset;
}

module.exports = SVG;