var Tree = require('./Tree');

/**
 * Creates an abstract object representation of the svg on the dom.
 * @param id The id of the svg in the document.
 * @param options
 * <ul>
 *     <li>clear - Clears the previous tree if true.</li>
 *     <li>height - Sets the height of the svg. Default is 200px.</li>
 *     <li>width - Sets the width of the svg. Default is 200px.</li>
 *     <li>scale - Sets the scale of the svg. Default is 1.</li>
 * </ul>
 * @constructor
 */
function SVG(id, options) {
	if(document === undefined) {
		var document = global.document;
	}
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

	if (options.scale) {
		this.scale = options.scale;
	} else {
		this.scale = 1;
	}

	this.coords = {x: 0, y: 0};
	this.setScale(this.scale);

	var self = this;
	this.dom.addEventListener('wheel', function(e) {
		self.setScale(self.scale + e.deltaY / 2000, { ex: e.clientX, ey: e.clientY });
	});

	 // TODO Improve pinching. This is bad. I should feel bad.
	this.pinching = {
		status: false,
		p1: {x: 0, y: 0},
		p2: {x: 0, y: 0}
	}

	this.dom.addEventListener('touchstart', function(e) {
		if(e.touches.length == 2) {
			self.pinching.status = true;
			self.pinching.p1.x = e.touches[0].clientX;
			self.pinching.p1.y = e.touches[0].clientY;
			self.pinching.p2.x = e.touches[1].clientX;
			self.pinching.p2.y = e.touches[1].clientY;
		}
	});

	this.dom.addEventListener('touchmove', function(e) {
		console.log(e);
		if(e.touches.length == 2 && self.pinching.status) {
			var oldDistSqr = (self.pinching.p1.x - self.pinching.p2.x) * (self.pinching.p1.x - self.pinching.p2.x) + (self.pinching.p1.y - self.pinching.p2.y) * (self.pinching.p1.y - self.pinching.p2.y);
			var distSqr = (e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY);
			if(oldDistSqr != 0) {
				self.setScale(self.scale * Math.pow(distSqr / oldDistSqr, 0.1), {
					ex: (e.touches[0].clientX + e.touches[1].clientX) / 2,
					ey: (e.touches[0].clientY + e.touches[1].clientY) / 2
				});
			}
		}
	});

	this.dom.addEventListener('touchend', function(e) {
		self.pinching.status = false;
	});
}

/**
 * Sets the current scale of the svg to the given value.
 * @param scale The new scale.
 * @param options (optional)
 * <ul>
 *     <li>ex - The event x coordinate.</li>
 *     <li>ey - The event y coordinate.</li>
 * </ul>
 */
SVG.prototype.setScale = function(scale, options) {
	var oldWidth = this.scale * this.width;
	var oldHeight = this.scale * this.height;

	this.scale = scale;
	if(this.scale < 0.1)
		this.scale = 0.1;
	else if(this.scale > 10) {
		this.scale = 10;
	}
	else {
		if (!options) {
			options = {};
		}

		var viewBox = '';
		if (options.ex) {
			this.coords.x -= (options.ex / this.width) * (this.width * scale - oldWidth);
		}

		if (options.ey) {
			this.coords.y -= options.ey / this.height * (this.height * scale - oldHeight);
		}

		viewBox += this.coords.x + ' ' + this.coords.y + ' ' + this.width * this.scale + ' ' + this.height * this.scale;
		this.dom.setAttribute('viewBox', viewBox);
	}
};


/**
 * Sets the current anchor of the tree to the given value
 * @param anchor The options are 'children' and 'none'. Default is 'none'.
 */
SVG.prototype.setAnchor = function(anchor) {
	this.anchor = anchor;
};

/**
 * Sets the current anchor of the tree to the given value
 * @param func The function to call when the pressing down on a node. First parameter of the function is the node.
 */
SVG.prototype.setSelectedAction = function(func) {
	this.selectedAction = func;
};

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
	var bezier = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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
		bezier.style.stroke = '#000';
	if(options.strokeWidth)
		bezier.style.strokeWidth = options.strokeWidth;
	else
		bezier.style.strokeWidth = '2px';

	this.dom.insertBefore(bezier, this.dom.firstChild);
	return bezier;
};

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
};

/**
 * Moves a bezier curve without recalculation of curves.
 * @param bezier Reference to the bezier curve.
 * @param mx the starting x position.
 * @param my the starting y position.
 */
SVG.prototype.moveBezier = function(bezier, mx, my) {
	bezier.setAttribute('transform', 'translate(' + mx + ',' + my + ')');
};

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
	var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', cx);
	circle.setAttribute('cy', cy);
	circle.setAttribute('r', r);

	if(!options) {
		options = {};
	}
	if(options.fill)
		circle.style.fill = options.fill;
	else
		circle.style.fill = '#FFF';
	if(options.stroke)
		circle.style.stroke = options.stroke;
	else
		circle.style.stroke = '#000';
	if(options.strokeWidth)
		circle.style.strokeWidth = options.strokeWidth;
	else
		circle.style.strokeWidth = '2px';

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
	circle.setAttribute('cx', cx);
	circle.setAttribute('cy', cy);
};

/**
 * Adds a line to the SVG.
 * @param x1 First x position.
 * @param y1 First y position.
 * @param x2 Second x position.
 * @param y2 Second y position.
 * @param options
 * <ul>
 *     <li>stroke - stroke color, default is #000000.</li>
 *     <li>strokeWidth - stroke size, default is 2px.</li>
 * <ul>
 * @returns {Element} The line
 */
SVG.prototype.addLine = function(x1, y1, x2, y2, options) {
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', x1);
	line.setAttribute('y1', y1);
	line.setAttribute('x2', x2);
	line.setAttribute('y2', y2);

	if(options.stroke)
		line.style.stroke = options.stroke;
	else
		line.style.stroke = '#000';

	if(options.strokeWidth)
		line.style.strokeWidth = options.strokeWidth;
	else
		line.style.strokeWidth = '2px';

	this.dom.appendChild(line);
	return line;
};

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
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		if(y2)
			line.setAttribute('y2', y2);
	} else {
		var mx = x1 - parseFloat(line.getAttribute('x1'));
		var my = y1 - parseFloat(line.getAttribute('y1'));
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', parseFloat(line.getAttribute('x2')) + mx);
		line.setAttribute('y2', parseFloat(line.getAttribute('y2')) + my);
	}
};

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
 *     <li>fill - fill color, default is #FFFFFF.</li>
 *     <li>stroke - stroke color, default is #000000.</li>
 *     <li>strokeWidth - stroke size, default is 1px.</li>
 *     <li>opacity - opacity, default is 1.</li>
 * </ul>
 * @returns {Element} The rectangle
 */
SVG.prototype.addRectangle = function(x, y, width, height, rx, ry, options) {
	var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	if(rx)
		rect.setAttribute('rx', rx);
	if(ry)
		rect.setAttribute('ry', ry);


	if(!options) {
		options = {};
	}
	if(options.fill)
		rect.style.fill = options.fill;
	else
		rect.style.fill = '#FFF';
	if(options.stroke)
		rect.style.stroke = options.stroke;
	else
		rect.style.stroke = '#000';
	if(options.strokeWidth)
		rect.style.strokeWidth = options.strokeWidth;
	else
		rect.style.strokeWidth = '1px';
	if(options.opacity)
		rect.setAttribute('fill-opacity', options.opacity);

	if(options.child) {
		var bbox = options.child.getBBox();
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', bbox.width + PADDING * 2);
		rect.setAttribute('height', bbox.height + PADDING * 2);
		options.child.parentNode.insertBefore(rect, options.child);
	} else {
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
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

	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
};

/**
 * Adds text to the SVG.
 * @param x x position
 * @param y y position
 * @param text Text element
 * @param options
 * <ul>
 *     <li>fill - fill color, default is #000000</li>
 * </ul>
 * @returns {Element} The text
 */
SVG.prototype.addText = function(x, y, text, options) {
	var textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	textNode.innerHTML = text;
	textNode.setAttribute('alignment-baseline', 'central');
	textNode.setAttribute('pointer-events', 'none');
	textNode.setAttribute('x', x + PADDING);

	if(!options) {
		options = {};
	}
	if(options.fill)
		textNode.setAttribute('fill', options.fill);
	else
		textNode.setAttribute('fill', '#000');

	this.dom.appendChild(textNode);
	textNode.setAttribute('y', y + PADDING + textNode.getBBox().height / 2);

	return textNode;
};

/**
 * Moves a text element given a reference to the text.
 * @param textNode Reference to the text.
 * @param x x position.
 * @param y y position.
 */
SVG.prototype.moveText = function(textNode, x, y) {
	textNode.setAttribute('x', x + PADDING);
	textNode.setAttribute('y', y + PADDING + textNode.getBBox().height / 2);
};

/**
 * Clears the SVG.
 */
SVG.prototype.clear = function() {
	this.dom.innerHTML = '';
};

/**
 * Removes an SVG element given a reference to it.
 * @param element The SVG element.
 */
SVG.prototype.removeElement = function(element) {
	this.dom.removeChild(element);
}

/**
 * Updates the colors of a selected node.
 * @param svg A reference to the SVG data structure
 * @param node The node within the SVG that is selected.
 * @param options
 * <ul>
 *     <li>fill - fill color of the selected node, default is #33DD33</li>
 *     <li>stroke - stroke color of the selected node, default is #11BB11</li>
 * </ul>
 */
function updateSelectedNode(svg, node, options) {
	if(svg.selectedNode) {
		svg.selectedNode._rect.style.fill = svg.current.fill;
		svg.selectedNode._rect.style.stroke = svg.current.stroke;
	}
	svg.selectedNode = node;
	svg.current.fill = node._rect.style.fill;
	svg.current.stroke = node._rect.style.stroke;
	if(!options)
		options = {};
	if(options.fill)
		svg.selectedNode._rect.style.fill = options.fill;
	else
		svg.selectedNode._rect.style.fill = '#33DD33';
	if(options.stroke)
		svg.selectedNode._rect.style.stroke = options.stroke;
	else
		svg.selectedNode._rect.style.stroke = '#11BB11';
}

/**
 * Removes a node, given a reference to the node, from the SVG and the data structure.
 * @param node the node.
 * @param maintainChildren if true, won't delete a node with children, otherwise it will delete a node and its children. Default is true.
 * @returns the node if deleted, null otherwise.
 */
SVG.prototype.removeNode = function(node, maintainChildren) {
	if(maintainChildren === undefined || maintainChildren) {
		if(node.children.length == 0) {
			return removeCurrNode(this, node);
		}
	} else {
		var list = [node];
		while (list.length > 0) {
			var currNode = list.splice(0, 1)[0];
			for (var i = 0; i < currNode.children.length; i++) {
				list.push(currNode.children[i]);
			}
			removeCurrNode(this, currNode);
		}
		return node;
	}
};

/**
 * Removes the current node.
 * @param svg The SVG data structure.
 * @param node The node to remove.
 * @returns The node if it was a success, null otherwise.
 */
function removeCurrNode(svg, node) {
	if (node._line)
		svg.removeElement(node._line);
	if (node._direction)
		svg.removeElement(node._direction);
	if (node._rect)
		svg.removeElement(node._rect);
	if (node._text)
		svg.removeElement(node._text);

	if (node.parent) {
		var siblings = node.parent.children;
		for (var i = 0; i < siblings.length; i++) {
			if (siblings[i] == node) {
				siblings.splice(i, 1);
				return node;
			}
		}
	}
	return null;
}

/**
 * Clears the SVG and then draws a tree.
 * @param root the node of the tree to traverse.
 * @param options
 * <ul>
 *     <li>anchor - The anchor of the children when dragging a node. Options are 'none' and 'children'. Default is 'none'</li>
 *     <li>cornerRadius - The corner radius of each node. Default is 2.</li>
 *     <li>fill - The fill color of regular nodes. Default is #BBDDFF.</li>
 *     <li>lineStroke - The stroke color of tree edges/lines. Default is the same as stroke color. Default is </li>
 *     <li>lineType - The type of line to connect nodes withm. Options are 'bezier' and 'line'. Default is 'line'.</li>
 *     <li>rootFill - The fill color of the root node</li>
 *     <li>rootStroke - The stroke color of the root node</li>
 *     <li>selectedFill - The selected node's fill color. Default is #33DD33.</li>
 *     <li>selectedStroke - The selected node's stroke color. Default is #11BB11.</li>
 *     <li>stroke - The stroke color of regular node. Default is #6688BB.</li>
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

	if(options.cornerRadius)
		self.defaults.cornerRadius = options.cornerRadius;
	else
		self.defaults.cornerRadius = 2;

	if(self.clearable)
		self.clear();
	var tree = new Tree(root);

	tree.traverse(function(node, level, index, parent) {
		if(node.contents) {
			node._text = self.addText(0, 0, node.contents);
		}

		var rect;
		if(!parent) {
			rect = self.addRectangle(0, 0, 5, 5, self.defaults.cornerRadius, self.defaults.cornerRadius, {
				fill: self.defaults.rootFill,
				stroke: self.defaults.rootStroke,
				child: node._text
			});
		}
		else {
			rect = self.addRectangle(0, 0, 5, 5, self.defaults.cornerRadius, self.defaults.cornerRadius, {
				fill: self.defaults.fill,
				stroke: self.defaults.stroke,
				child: node._text
			});
		}
		node._rect = rect;
	});

	tree.initialize();

	tree.traverse(function(node, level, index, parent) {
		self.moveText(node._text, node.x, node.y);
		self.moveRectangle(node._rect, node.x, node.y);

		var offset = getOffset(node, parent);
		node._offset = offset;
		if(parent) {
			if(options.lineType == 'bezier') {
				node._line = self.addBezier(parent.x + offset.parX, parent.y + offset.parY, node.x + offset.x, node.y + offset.y, {
					stroke: self.defaults.lineStroke
				});
			} else {
				options.lineType = 'line'
				node._line = self.addLine(parent.x + offset.parX, parent.y + offset.parY, node.x + offset.x, node.y + offset.y, {
					stroke: self.defaults.lineStroke
				});
			}

			node._direction = self.addCircle(node.x + offset.x, node.y + offset.y, 2, {
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
		node._rect.addEventListener('mousedown', function(e) {
			updateSelectedNode(self, node, {
				fill: options.selectedFill,
				stroke: options.selectedStroke
			});
			tree.dragging.node = node;
			tree.dragging.parent = parent;
			tree.dragging.anchorX = e.clientX * self.scale - node.x;
			tree.dragging.anchorY = e.clientY * self.scale - node.y;
			if (self.selectedAction)
				self.selectedAction(self.selectedNode);
		});
		node._rect.addEventListener('touchstart', function(e) {
			if(e.touches.length == 1) {
				updateSelectedNode(self, node, {
					fill: options.selectedFill,
					stroke: options.selectedStroke
				});
				tree.dragging.node = node;
				tree.dragging.parent = parent;
				tree.dragging.anchorX = e.touches[0].clientX * self.scale - node.x;
				tree.dragging.anchorY = e.touches[0].clientY * self.scale - node.y;
				if (self.selectedAction)
					self.selectedAction(self.selectedNode);
			}
		});
	});

	// TODO Make these singular global events on the SVG, and add trees to a list perhaps? Far too many unhandled event listeners when trees are removed.
	self.dom.addEventListener('mousedown', function(e) {
		if(e.target == self.dom) {
			tree.dragging.dom = true;
			tree.dragging.currX = e.clientX * self.scale;
			tree.dragging.currY = e.clientY * self.scale;
		}
	});
	self.dom.addEventListener('touchstart', function(e) {
		if(e.touches.length == 1 && e.target == self.dom) {
			tree.dragging.dom = true;
			tree.dragging.currX = e.touches[0].clientX * self.scale;
			tree.dragging.currY = e.touches[0].clientY * self.scale;
		}
	});

	self.dom.addEventListener('mousemove', function(e) {
		handleMove(self, tree, tree.dragging.node, tree.dragging.parent, e.clientX, e.clientY, {
			lineType: options.lineType,
			anchor: self.anchor
		});
	});
	self.dom.addEventListener('touchmove', function(e) {
		if(e.touches.length == 1) {
			handleMove(self, tree, tree.dragging.node, tree.dragging.parent, e.touches[0].clientX, e.touches[0].clientY, {
				lineType: options.lineType,
				anchor: self.anchor
			});
		}
	});

	self.dom.addEventListener('mouseup', function(e) {
		tree.dragging.node = undefined;
		tree.dragging.dom = false;
	});
	self.dom.addEventListener('touchend', function(e) {
		tree.dragging.node = undefined;
		tree.dragging.dom = false;
	});
};

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
		currNode.x = ex * self.scale - tree.dragging.anchorX;
		currNode.y = ey * self.scale - tree.dragging.anchorY;
		self.moveRectangle(currNode._rect, currNode.x, currNode.y);
		self.moveText(currNode._text, currNode.x, currNode.y);
		currNode._offset = getOffset(currNode, nodeParent);
		if(currNode._direction)
			self.moveCircle(currNode._direction, currNode.x + currNode._offset.x, currNode.y + currNode._offset.y);
		if(currNode.children) {
			for(var i = 0; i < currNode.children.length; i++) {
				if(currNode.children[i]._direction) {
					currNode.children[i]._offset = getOffset(currNode.children[i], currNode);
					self.moveCircle(currNode.children[i]._direction, currNode.children[i].x + currNode.children[i]._offset.x, currNode.children[i].y + currNode.children[i]._offset.y);
				}
			}
		}
		if(options.lineType == 'bezier') {
			if (currNode._line)
				self.resetBezier(currNode._line, nodeParent.x + currNode._offset.parX, nodeParent.y + currNode._offset.parY, currNode.x + currNode._offset.x, currNode.y + currNode._offset.y);
			for (var i = 0; i < currNode.children.length; i++) {
				if (currNode.children[i]._line) {
					if(options.anchor == 'descendents')
						self.moveBezier(currNode.children[i]._line, currNode.x + currNode.children[i]._offset.parX, currNode.y + currNode.children[i]._offset.parY, currNode.children[i].x + currNode.children[i]._offset.x, currNode.children[i].y + currNode.children[i]._offset.y);
					else
						self.resetBezier(currNode.children[i]._line, currNode.x + currNode.children[i]._offset.parX, currNode.y + currNode.children[i]._offset.parY, currNode.children[i].x + currNode.children[i]._offset.x, currNode.children[i].y + currNode.children[i]._offset.y);
				}
			}
		} else { // same as parent (should be line)
			if (currNode._line)
				self.moveLine(currNode._line, nodeParent.x + currNode._offset.parX, nodeParent.y + currNode._offset.parY, currNode.x + currNode._offset.x, currNode.y + currNode._offset.y);
			for (var i = 0; i < currNode.children.length; i++) {
				if (currNode.children[i]._line) {
					self.moveLine(currNode.children[i]._line, currNode.x + currNode.children[i]._offset.parX, currNode.y + currNode.children[i]._offset.parY, currNode.children[i].x + currNode.children[i]._offset.x, currNode.children[i].y + currNode.children[i]._offset.y);
				}
			}
		}
		if(options.anchor == 'children') {
			for(var i = 0; i < currNode.children.length; i++) {
				handleMove(self, tree, currNode.children[i], currNode, (currNode.children[i].x + currNode.x - origX + tree.dragging.anchorX) / self.scale, (currNode.children[i].y + currNode.y - origY + tree.dragging.anchorY) / self.scale, {
					anchor: 'none',
					lineType: options.lineType
				});
			}
		} else if(options.anchor == 'descendents') {
			for(var i = 0; i < currNode.children.length; i++) {
				handleMove(self, tree, currNode.children[i], currNode, (currNode.children[i].x + currNode.x - origX + tree.dragging.anchorX) / self.scale, (currNode.children[i].y + currNode.y - origY + tree.dragging.anchorY) / self.scale, {
					anchor: 'descendents',
					lineType: options.lineType
				});
			}
		}
	} else if(tree.dragging.dom) {
		tree.traverse(function (node, level, index, parent) {
			node.x += ex * self.scale - tree.dragging.currX;
			node.y += ey * self.scale - tree.dragging.currY;
			self.moveRectangle(node._rect, node.x, node.y);
			self.moveText(node._text, node.x, node.y);
			if (node._line) {
				if (options.lineType == 'bezier')
					self.moveBezier(node._line, parent.x + node._offset.parX, parent.y + node._offset.parY);
				else
					self.moveLine(node._line, parent.x + node._offset.parX, parent.y + node._offset.parY);
			}
			if (node._direction)
				self.moveCircle(node._direction, node.x + node._offset.x, node.y + node._offset.y);
		});
		tree.dragging.currX = ex * self.scale;
		tree.dragging.currY = ey * self.scale;
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
		if(node.y > parent.y + parent._rect.height.baseVal.value) {
			offset.parY = parent._rect.height.baseVal.value;
			offset.y = 0;
			offset.parX = parent._rect.width.baseVal.value / 2;
			offset.x = node._rect.width.baseVal.value / 2;
		} else if(node.y + node._rect.height.baseVal.value < parent.y) {
			offset.parY = 0;
			offset.y = node._rect.height.baseVal.value;
			offset.parX = parent._rect.width.baseVal.value / 2;
			offset.x = node._rect.width.baseVal.value / 2;
		} else if(node.x > parent.x + parent._rect.width.baseVal.value) {
			offset.parY = parent._rect.height.baseVal.value / 2;
			offset.y = node._rect.height.baseVal.value / 2;
			offset.parX = parent._rect.width.baseVal.value;
			offset.x = 0;
		} else{ // node.x + node.width < parent.x
			offset.parY = parent._rect.height.baseVal.value / 2;
			offset.y = node._rect.height.baseVal.value / 2;
			offset.parX = 0;
			offset.x = node._rect.width.baseVal.value;
		}
	} else { // horizontal
		if(node.x > parent.x + parent._rect.width.baseVal.value) {
			offset.parX = parent._rect.width.baseVal.value;
			offset.x = 0;
			offset.parY = parent._rect.height.baseVal.value / 2;
			offset.y = node._rect.height.baseVal.value / 2;
		} else if(node.x + node._rect.width.baseVal.value < parent.x) {
			offset.parX = 0;
			offset.x = node._rect.width.baseVal.value;
			offset.parY = parent._rect.height.baseVal.value / 2;
			offset.y = node._rect.height.baseVal.value / 2;
		} else if(node.y > parent.y + parent._rect.height.baseVal.value) {
			offset.parX = parent._rect.width.baseVal.value / 2;
			offset.x = node._rect.width.baseVal.value / 2;
			offset.parY = parent._rect.height.baseVal.value;
			offset.y = 0;
		} else{ // node.y + node.height < parent.y
			offset.parX = parent._rect.width.baseVal.value / 2;
			offset.x = node._rect.width.baseVal.value / 2;
			offset.parY = 0;
			offset.y = node._rect.height.baseVal.value;
		}
	}
	return offset;
}

module.exports = SVG;