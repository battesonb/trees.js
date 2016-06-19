var Tree = require('./Tree');

/**
 * Creates an abstract object representation of the svg on the dom.
 * @param id The id of the svg in the document.
 * @param options
 * <ul>
 *     <li>clear - Clears the previous tree if true.</li>
 *     <li>height - Sets the height of the svg. Default is 200px.</li>
 *     <li>width - Sets the width of the svg. Default is 200px.</li>
 * </ul>
 * @constructor
 */
function SVG(id, options) {
	this.dom = document.getElementById(id);
	if(!options) {
		options = {};
	}

	if(options.clear)
		this.clearable = options.clear;
	else
		this.clearable = false;

	if (options.height) {
		this.dom.setAttribute('height', options.height + 'px');
		this.height = options.height;
	} else {
		this.height = Number(this.dom.getAttribute('height'));
		if(this.height == 0) {
			this.height = 200;
			this.dom.setAttribute('height', this.height + 'px');
		}
	}

	if (options.width) {
		this.dom.setAttribute('width', options.width + 'px');
		this.width = options.width;
	}
	else {
		this.width = Number(this.dom.getAttribute('width'));
		if(this.width == 0) {
			this.width = 200;
			this.dom.setAttribute('width', this.width + 'px');
		}
	}
}

/**
 * Sets the current anchor of the tree to the given value
 * @param anchor The options are 'children' and 'none'. Default is 'none'.
 */
SVG.prototype.setAnchor = function(anchor) {
	this.anchor = anchor;
}

/**
 * Adds a bezier curve to the SVG.
 * @param mx the starting x position.
 * @param my the starting y position.
 * @param x the ending x position.
 * @param y the ending y position.
 * @param options
 * <ul>
 *     <li>stroke - stroke color, default #000000</li>
 *     <li>strokeWidth - stroke width, default 2px.</li>
 * <ul>
 * @returns {Element} bezier the bezier curve.
 */
SVG.prototype.addBezier = function(mx, my, x, y, options) {
	var bezier = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	var c1x = (mx + x) / 2;
	var c1y = my;
	var c2x = (mx + x) / 2;
	var c2y = y;
	bezier.setAttribute('d', 'M' + 0 + ' ' + 0 + ' C' + (c1x - mx) + ' ' + (c1y - my) + ' ' + (c2x - mx) + ' ' + (c2y - my) + ' ' + (x - mx) + ' ' + (y - my));
	bezier.setAttribute('transform', 'translate(' + mx + ',' + my + ')');
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

	this.dom.insertBefore(bezier, this.dom.firstChild);
	return bezier;
}

/**
 * Recalculates a bezier entirely, given the reference to a bezier.
 * @param bezier Reference to the bezier curve.
 * @param mx the starting x position.
 * @param my the starting y position.
 * @param x the ending x position.
 * @param y the ending y position.
 */
SVG.prototype.resetBezier = function(bezier, mx, my, x, y) {
	var c1x = (mx + x) / 2;
	var c1y = my;
	var c2x = (mx + x) / 2;
	var c2y = y;
	bezier.setAttribute('d', 'M' + 0 + ' ' + 0 + ' C' + (c1x - mx) + ' ' + (c1y - my) + ' ' + (c2x - mx) + ' ' + (c2y - my) + ' ' + (x - mx) + ' ' + (y - my));
	bezier.setAttribute('transform', 'translate(' + mx + ',' + my + ')');
}

/**
 * Moves a bezier curve without recalculation of curves.
 * @param bezier Reference to the bezier curve.
 * @param mx the starting x position.
 * @param my the starting y position.
 */
SVG.prototype.moveBezier = function(bezier, mx, my) {
	bezier.setAttribute('transform', 'translate(' + mx + ',' + my + ')');
}

/**
 * Adds a circle to the SVG.
 * @param cx the x position.
 * @param cy the y position.
 * @param r the radius.
 * @param options
 * <ul>
 *     <li>fill - fill color, default #FFFFFF.</li>
 *     <li>stroke - stroke color, default #000000.</li>
 *     <li>strokeWidth - stroke width, default 2px.</li>
 * <ul>
 * @returns {Element}
 */
SVG.prototype.addCircle = function(cx, cy, r, options) {
	var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	circle.setAttribute("cx", cx);
	circle.setAttribute("cy", cy);
	circle.setAttribute("r", r);

	if(!options) {
		options = {};
	}
	if(options.fill)
		circle.style.fill = options.fill;
	else
		circle.style.fill = "#FFF";
	if(options.stroke)
		circle.style.stroke = options.stroke;
	else
		circle.style.stroke = "#000";
	if(options.strokeWidth)
		circle.style.strokeWidth = options.strokeWidth;
	else
		circle.style.strokeWidth = "2px";

	this.dom.appendChild(circle);
	return circle;
};

/**
 * Moves a circle given a reference to the circle in the SVG.
 * @param circle Reference to the circle.
 * @param cx Circle's x position.
 * @param cy Circle's y position.
 */
SVG.prototype.moveCircle = function(circle, cx, cy) {
	circle.setAttribute("cx", cx);
	circle.setAttribute("cy", cy);
}

/**
 * Adds a line to the SVG.
 * @param x1 First x position.
 * @param y1 First y position.
 * @param x2 Second x position.
 * @param y2 Second y position.
 * @options
 * <ul>
 *     <li>stroke - stroke colour, default is #000000.</li>
 *     <li>strokeWidth - stroke size, default is 2px.</li>
 * <ul>
 * @returns {Element} The line
 */
SVG.prototype.addLine = function(x1, y1, x2, y2, options) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);

	if(options.stroke)
		line.style.stroke = options.stroke;
	else
		line.style.stroke = "#000";

	if(options.strokeWidth)
		line.style.strokeWidth = options.strokeWidth;
	else
		line.style.strokeWidth = "2px";

	this.dom.appendChild(line);
	return line;
}

/**
 * Moves a line element given a reference to the line.
 * @param line Reference to the line.
 * @param x1 First x position.
 * @param y1 First y position.
 * @param x2 Second x position.
 * @param y2 Second y position.
 */
SVG.prototype.moveLine = function(line, x1, y1, x2, y2) {
	if(x2) {
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);
		line.setAttribute("x2", x2);
		if(y2)
			line.setAttribute("y2", y2);
	} else {
		var mx = x1 - parseFloat(line.getAttribute('x1'));
		var my = y1 - parseFloat(line.getAttribute('y1'));
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);
		line.setAttribute("x2", parseFloat(line.getAttribute('x2')) + mx);
		line.setAttribute("y2", parseFloat(line.getAttribute('y2')) + my);
	}
}

var PADDING = 5;

/**
 * Adds a rectangle to the SVG.
 * @param x x position.
 * @param y y position.
 * @param width width of the rectangle.
 * @param height height of the rectangle.
 * @param rx radius of the x-corner.
 * @param ry radius of the y-corner.
 * @param options
 * <ul>
 *     <li>fill - fill colour, default is #FFFFFF.</li>
 *     <li>stroke - stroke colour, default is #000000.</li>
 *     <li>strokeWidth - stroke size, default is 1px.</li>
 *     <li>opacity - opacity, default is 1.</li>
 * </ul>
 * @returns {Element} The rectangle
 */
SVG.prototype.addRectangle = function(x, y, width, height, rx, ry, options) {
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
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
		rect.style.strokeWidth = "1px";
	if(options.opacity)
		rect.setAttribute("fill-opacity", options.opacity);

	if(options.child) {
		var bbox = options.child.getBBox();
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		rect.setAttribute("width", bbox.width + PADDING * 2);
		rect.setAttribute("height", bbox.height + PADDING * 2);
		options.child.parentNode.insertBefore(rect, options.child);
	} else {
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		rect.setAttribute("width", width);
		rect.setAttribute("height", height);
		this.dom.appendChild(rect);
	}
	return rect;
};

/**
 * Moves a rectangle element given a reference to the rectangle.
 * @param rect Reference to the rectangle.
 * @param x x position.
 * @param y y position.
 * @param options
 */
SVG.prototype.moveRectangle = function(rect, x, y, options) {
	if(!options) {
		options = {};
	}

	rect.setAttribute("x", x);
	rect.setAttribute("y", y);
}

/**
 * Adds text to the SVG.
 * @param x x position
 * @param y y position
 * @param text Text element
 * @param options
 * <ul>
 *     <li>fill - fill colour, default is #000000</li>
 * </ul>
 * @returns {Element} The text
 */
SVG.prototype.addText = function(x, y, text, options) {
	var textNode = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	textNode.innerHTML = text;
	textNode.setAttribute("alignment-baseline", "central");
	textNode.setAttribute("pointer-events", "none");
	textNode.setAttribute("x", x + PADDING);

	if(!options) {
		options = {};
	}
	if(options.fill)
		textNode.setAttribute("fill", options.fill);
	else
		textNode.setAttribute("fill", "#000");

	this.dom.appendChild(textNode);
	textNode.setAttribute("y", y + PADDING + textNode.getBBox().height / 2);

	return textNode;
};

/**
 * Moves a text element given a reference to the text.
 * @param textNode Reference to the text.
 * @param x x position.
 * @param y y position.
 */
SVG.prototype.moveText = function(textNode, x, y) {
	textNode.setAttribute("x", x + PADDING);
	textNode.setAttribute("y", y + PADDING + textNode.getBBox().height / 2);
}

/**
 * Clears the SVG.
 */
SVG.prototype.clear = function() {
	this.dom.innerHTML = "";
};

/**
 * Updates the colours of a selected node.
 * @param svg A reference to the SVG data structure
 * @param node The node within the SVG that is selected.
 * @param options
 * <ul>
 *     <li>fill - fill colour of the selected node, default is #33DD33</li>
 *     <li>stroke - stroke colour of the selected node, default is #11BB11</li>
 * </ul>
 */
function updateSelectedNode(svg, node, options) {
	if(svg.selectedNode) {
		svg.selectedNode.rect.style.fill = svg.current.fill;
		svg.selectedNode.rect.style.stroke = svg.current.stroke;
	}
	svg.selectedNode = node;
	svg.current.fill = node.rect.style.fill;
	svg.current.stroke = node.rect.style.stroke;
	if(!options)
		options = {};
	if(options.fill)
		svg.selectedNode.rect.style.fill = options.fill;
	else
		svg.selectedNode.rect.style.fill = '#33DD33';
	if(options.stroke)
		svg.selectedNode.rect.style.stroke = options.strokea;
	else
		svg.selectedNode.rect.style.stroke = '#11BB11';
}

/**
 * Clears the SVG and then draws a tree.
 * @param root the node of the tree to traverse.
 * @param options
 * <ul>
 *     <li>anchor - The anchor of the children when dragging a node. Options are 'none' and 'children'. Default is 'none'</li>
 *     <li>fill - The fill color of regular nodes</li>
 *     <li>stroke - The stroke color of regular node</li>
 *     <li>lineStroke - The stroke color of tree edges/lines. Default is the same as stroke colour.</li>
 *     <li>lineType - The type of line to connect nodes withm. Options are 'bezier' and 'line'. Default is 'line'.</li>
 *     <li>rootFill - The fill color of the root node</li>
 *     <li>rootStroke - The stroke color of the root node</li>
 * <ul>
 */
SVG.prototype.drawTree = function(root, options) {
	var self = this;
	self.selectedNode = null;
	if(!options)
		options = {};

	self.current = {};
	self.defaults = {};

	if(options.fill)
		self.defaults.fill = options.fill;
	else
		self.defaults.fill = '#BBDDFF';

	if(options.stroke)
		self.defaults.stroke = options.stroke;
	else
		self.defaults.stroke = '#6688BB';

	if(options.rootFill)
		self.defaults.rootFill = options.rootFill;
	else
		self.defaults.rootFill = '#FF6666';

	if(options.rootStroke)
		self.defaults.rootStroke = options.rootStroke;
	else
		self.defaults.rootStroke = '#DD2222';

	if(options.lineStroke)
		self.defaults.lineStroke = options.lineStroke;
	else
		self.defaults.lineStroke = self.defaults.stroke;


	if(self.clearable)
		self.clear();
	var tree = new Tree(root);

	tree.traverse(function(node, level, index, parent) {
		if(node.contents) {
			var text = self.addText(0, 0, node.contents);
			node.text = text;
		}		

		if(!parent) {
			var rect = self.addRectangle(0, 0, 5, 5, 2, 2, {
				fill: self.defaults.rootFill,
				stroke: self.defaults.rootStroke,
				child: node.text
			});
		}
		else {
			var rect = self.addRectangle(0, 0, 5, 5, 2, 2, {
				fill: self.defaults.fill,
				stroke: self.defaults.stroke,
				child: node.text
			});
		}
		node.rect = rect;
	});

	tree.initialize();

	tree.traverse(function(node, level, index, parent) {
		self.moveText(node.text, node.x, node.y);
		self.moveRectangle(node.rect, node.x, node.y);

		var offset = getOffset(node, parent);
		node.offset = offset;
		if(parent) {
			if(options.lineType == 'bezier') {
				var bezier = self.addBezier(parent.x + offset.parX, parent.y + offset.parY, node.x + offset.x, node.y + offset.y, {
					stroke: self.defaults.lineStroke
				});
				node.line = bezier;
			} else {
				options.lineType = 'line'
				var line = self.addLine(parent.x + offset.parX, parent.y + offset.parY, node.x + offset.x, node.y + offset.y, {
					stroke: self.defaults.lineStroke
				});
				node.line = line;
			}

			node.direction = self.addCircle(node.x + offset.x, node.y + offset.y, 2, {
				fill: self.defaults.lineStroke,
				stroke: self.defaults.lineStroke,
			});
		}
	});

	if(!options.anchor)
		options.anchor = 'none';
	self.anchor = options.anchor;

	tree.dragging = {};
	tree.traverse(function(node, level, index, parent) {
		node.rect.addEventListener('mousedown', function(e) {
			updateSelectedNode(self, node);
			tree.dragging.node = node;
			tree.dragging.parent = parent;
			tree.dragging.anchorX = e.clientX - node.x;
			tree.dragging.anchorY = e.clientY - node.y;
		});
		node.rect.addEventListener('touchstart', function(e) {
			updateSelectedNode(self, node);
			tree.dragging.node = node;
			tree.dragging.parent = parent;
			tree.dragging.anchorX = e.touches[0].clientX - node.x;
			tree.dragging.anchorY = e.touches[0].clientY - node.y;
		});
	});

	self.dom.addEventListener('mousedown', function(e) {
		if(e.target == self.dom) {
			tree.dragging.dom = true;
			tree.dragging.currX = e.clientX;
			tree.dragging.currY = e.clientY;
		}
	});
	self.dom.addEventListener('touchstart', function(e) {
		if(e.target == self.dom) {
			tree.dragging.dom = true;
			tree.dragging.currX = e.touches[0].clientX;
			tree.dragging.currY = e.touches[0].clientY;
		}
	});

	self.dom.addEventListener('mousemove', function(e) {
		handleMove(self, tree, tree.dragging.node, tree.dragging.parent, e.clientX, e.clientY, {
			lineType: options.lineType,
			anchor: self.anchor
		});
	});
	self.dom.addEventListener('touchmove', function(e) {
		handleMove(self, tree, tree.dragging.node, tree.dragging.parent, e.touches[0].clientX, e.touches[0].clientY, {
			lineType: options.lineType,
			anchor: self.anchor
		});
	});

	self.dom.addEventListener('mouseup', function(e) {
		tree.dragging.node = undefined;
		tree.dragging.dom = false;
	});
	self.dom.addEventListener('touchend', function(e) {
		tree.dragging.node = undefined;
		tree.dragging.dom = false;
	});
}

/**
 * Given an event's new position, update the current node.
 * @param self the SVG object.
 * @param tree the tree structure.
 * @param currNode the node to move.
 * @param nodeParent the node's parent.
 * @param ex event x position.
 * @param ey event y position.
 * @param options
 * <ul>
 *     <li>anchor - the object to anchor child nodes to. Options are 'descendents', 'children' and 'none'. Default is 'none'</li>
 *     <li>lineType - The type of line to connect nodes with. Options are 'bezier' and 'line'. Default is the same as given by drawTree.</li>
 * <ul>
 */
function handleMove(self, tree, currNode, nodeParent, ex, ey, options) {
	if(!options)
		options = {};
	if(currNode) {
		var origX = currNode.x;
		var origY = currNode.y;
		currNode.x = ex - tree.dragging.anchorX;
		currNode.y = ey - tree.dragging.anchorY;
		self.moveRectangle(currNode.rect, currNode.x, currNode.y);
		self.moveText(currNode.text, currNode.x, currNode.y);
		var offset = getOffset(currNode, nodeParent);
		currNode.offset = offset;
		if(currNode.direction)
			self.moveCircle(currNode.direction, currNode.x + currNode.offset.x, currNode.y + currNode.offset.y);
		if(currNode.children) {
			for(var i = 0; i < currNode.children.length; i++) {
				if(currNode.children[i].direction) {
					currNode.children[i].offset = getOffset(currNode.children[i], currNode);
					self.moveCircle(currNode.children[i].direction, currNode.children[i].x + currNode.children[i].offset.x, currNode.children[i].y + currNode.children[i].offset.y);
				}
			}
		}
		if(options.lineType == 'bezier') {
			if (currNode.line)
				self.resetBezier(currNode.line, nodeParent.x + currNode.offset.parX, nodeParent.y + currNode.offset.parY, currNode.x + currNode.offset.x, currNode.y + currNode.offset.y);
			for (var i = 0; i < currNode.children.length; i++) {
				if (currNode.children[i].line) {
					if(options.anchor == 'descendents')
						self.moveBezier(currNode.children[i].line, currNode.x + currNode.children[i].offset.parX, currNode.y + currNode.children[i].offset.parY, currNode.children[i].x + currNode.children[i].offset.x, currNode.children[i].y + currNode.children[i].offset.y);
					else
						self.resetBezier(currNode.children[i].line, currNode.x + currNode.children[i].offset.parX, currNode.y + currNode.children[i].offset.parY, currNode.children[i].x + currNode.children[i].offset.x, currNode.children[i].y + currNode.children[i].offset.y);
				}
			}
		} else { // same as parent (should be line)
			if (currNode.line)
				self.moveLine(currNode.line, nodeParent.x + currNode.offset.parX, nodeParent.y + currNode.offset.parY, currNode.x + currNode.offset.x, currNode.y + currNode.offset.y);
			for (var i = 0; i < currNode.children.length; i++) {
				if (currNode.children[i].line) {
					self.moveLine(currNode.children[i].line, currNode.x + currNode.children[i].offset.parX, currNode.y + currNode.children[i].offset.parY, currNode.children[i].x + currNode.children[i].offset.x, currNode.children[i].y + currNode.children[i].offset.y);
				}
			}
		}
		if(options.anchor == 'children') {
			for(var i = 0; i < currNode.children.length; i++) {
				handleMove(self, tree, currNode.children[i], currNode, currNode.children[i].x + currNode.x - origX + tree.dragging.anchorX, currNode.children[i].y + currNode.y - origY + tree.dragging.anchorY, {
					anchor: 'none',
					lineType: options.lineType
				});
			}
		} else if(options.anchor == 'descendents') {
			for(var i = 0; i < currNode.children.length; i++) {
				handleMove(self, tree, currNode.children[i], currNode, currNode.children[i].x + currNode.x - origX + tree.dragging.anchorX, currNode.children[i].y + currNode.y - origY + tree.dragging.anchorY, {
					anchor: 'descendents',
					lineType: options.lineType
				});
			}
		}
	} else if(tree.dragging.dom) {
		tree.traverse(function (node, level, index, parent) {
			node.x += ex - tree.dragging.currX;
			node.y += ey - tree.dragging.currY;
			self.moveRectangle(node.rect, node.x, node.y);
			self.moveText(node.text, node.x, node.y);
			if (node.line) {
				if (options.lineType == 'bezier')
					self.moveBezier(node.line, parent.x + node.offset.parX, parent.y + node.offset.parY);
				else
					self.moveLine(node.line, parent.x + node.offset.parX, parent.y + node.offset.parY);
			}
			if (node.direction)
				self.moveCircle(node.direction, node.x + node.offset.x, node.y + node.offset.y);
		});
		tree.dragging.currX = ex;
		tree.dragging.currY = ey;
	}
}

/**
 * Gets the offset required for the first and second control point for a bezier curve
 * given two nodes.
 * @param node the current node.
 * @param parent the current node's parent.
 * @param options
 * <ul>
 *     <li>layout - The orientation of the lines/edges, options are 'horizontal' and 'vertical'. Default is 'horizontal'.</li>
 * <ul>
 */
function getOffset(node, parent, options) {
	if(!parent)
		return {
			x: 0,
			y: 0,
			parX: 0,
			parY: 0
		};
	if(!options)
		options = {};
	var offset = {};
	if(options.layout == 'vertical') {
		if(node.y > parent.y + parent.rect.height.baseVal.value) {
			offset.parY = parent.rect.height.baseVal.value;
			offset.y = 0;
			offset.parX = parent.rect.width.baseVal.value / 2;
			offset.x = node.rect.width.baseVal.value / 2;
		} else if(node.y + node.rect.height.baseVal.value < parent.y) {
			offset.parY = 0;
			offset.y = node.rect.height.baseVal.value;
			offset.parX = parent.rect.width.baseVal.value / 2;
			offset.x = node.rect.width.baseVal.value / 2;
		} else if(node.x > parent.x + parent.rect.width.baseVal.value) {
			offset.parY = parent.rect.height.baseVal.value / 2;
			offset.y = node.rect.height.baseVal.value / 2;
			offset.parX = parent.rect.width.baseVal.value;
			offset.x = 0;
		} else{ // node.x + node.width < parent.x
			offset.parY = parent.rect.height.baseVal.value / 2;
			offset.y = node.rect.height.baseVal.value / 2;
			offset.parX = 0;
			offset.x = node.rect.width.baseVal.value;
		}
	} else { // horizontal
		if(node.x > parent.x + parent.rect.width.baseVal.value) {
			offset.parX = parent.rect.width.baseVal.value;
			offset.x = 0;
			offset.parY = parent.rect.height.baseVal.value / 2;
			offset.y = node.rect.height.baseVal.value / 2;
		} else if(node.x + node.rect.width.baseVal.value < parent.x) {
			offset.parX = 0;
			offset.x = node.rect.width.baseVal.value;
			offset.parY = parent.rect.height.baseVal.value / 2;
			offset.y = node.rect.height.baseVal.value / 2;
		} else if(node.y > parent.y + parent.rect.height.baseVal.value) {
			offset.parX = parent.rect.width.baseVal.value / 2;
			offset.x = node.rect.width.baseVal.value / 2;
			offset.parY = parent.rect.height.baseVal.value;
			offset.y = 0;
		} else{ // node.y + node.height < parent.y
			offset.parX = parent.rect.width.baseVal.value / 2;
			offset.x = node.rect.width.baseVal.value / 2;
			offset.parY = 0;
			offset.y = node.rect.height.baseVal.value;
		}
	}
	return offset;
}

module.exports = SVG;