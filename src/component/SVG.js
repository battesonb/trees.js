var Tree = require('./Tree');

/**
 * Creates an abstract object representation of the svg on the dom.
 * @param {String} id The id of the svg in the document.
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
	if(window === undefined) {
		var window = global;
	}
	Tree.maxIndex = 0;

	var self = this;
	this.dom = document.getElementById(id);
	if(!options) {
		options = {};
	}

	if(options.clear)
		this.clearable = options.clear;
	else
		this.clearable = false;

	if (options.height) {
		this.dom.setAttribute('height', options.height);
	} else {
		this.height = Number(this.dom.getAttribute('height'));
		if(this.height == 0) {
			this.dom.setAttribute('height', 200);
		}
	}

	this.setPosition();

	if (options.width) {
		this.dom.setAttribute('width', options.width);
	}
	else {
		this.width = Number(this.dom.getAttribute('width'));
		if(this.width == 0) {
			this.dom.setAttribute('width', 200);
		}
	}

	if (options.scale) {
		this.scale = options.scale;
	} else {
		this.scale = 1;
	}

	this.coords = {x: 0, y: 0};
	this.prevScale = this.scale;
	this.setScale(this.scale);

	 // TODO Improve pinching. This is bad. I should feel bad.
	this.pinching = {
		status: false,
		p1: {x: 0, y: 0},
		p2: {x: 0, y: 0}
	}
	this.trees = [];
	this.dragging = {};

	this.dom.addEventListener('wheel', function(e) {
		e.preventDefault();
		var change = e.deltaY > 0 ? 1 : -1;
		self.setPosition();
		self.setScale(self.scale + self.scale * change / 10, { ex: e.clientX, ey: e.clientY });
	});

	this.dom.addEventListener('touchstart', function(e) {
		e.preventDefault();
		if(e.target == self.dom) {
			if (e.touches.length == 2) {
				self.pinching.status = true;
				self.pinching.p1.x = e.touches[0].clientX;
				self.pinching.p1.y = e.touches[0].clientY;
				self.pinching.p2.x = e.touches[1].clientX;
				self.pinching.p2.y = e.touches[1].clientY;
			} else if (e.touches.length == 1) {
				e.preventDefault();
				self.dragging.dom = true;
				self.dragging.currX = e.touches[0].clientX * self.scale;
				self.dragging.currY = e.touches[0].clientY * self.scale;
			}
		}
	});

	this.dom.addEventListener('touchmove', function(e) {
		e.preventDefault();
		if(e.touches.length == 2 && self.pinching.status) {
			e.preventDefault();
			var oldDistSqr = (self.pinching.p1.x - self.pinching.p2.x) * (self.pinching.p1.x - self.pinching.p2.x) + (self.pinching.p1.y - self.pinching.p2.y) * (self.pinching.p1.y - self.pinching.p2.y);
			var distSqr = (e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY);
			if(oldDistSqr != 0) {
				self.setScale(self.prevScale * Math.pow(oldDistSqr / distSqr, 1/2), {
					ex: (e.touches[0].clientX + e.touches[1].clientX) / 2,
					ey: (e.touches[0].clientY + e.touches[1].clientY) / 2
				});
			}
		} else if(e.touches.length == 1) {
			if(self.dragging.dom) {
				self.move(e.touches[0].clientX * self.scale - self.dragging.currX, e.touches[0].clientY * self.scale - self.dragging.currY);
				self.dragging.currX = e.touches[0].clientX * self.scale;
				self.dragging.currY = e.touches[0].clientY * self.scale;
			} else if(self.dragging.node) {
				for (var i = 0; i < self.trees.length; i++) {
					if (self.trees[i] === self.dragging.node._tree) {
						handleMove(self, self.dragging.node._tree, self.dragging.node, self.dragging.parent, e.touches[0].clientX, e.touches[0].clientY, {
							lineType: options.lineType,
							anchor: self.anchor
						});
						return;
					}
				}
			}
		}
	});

	this.dom.addEventListener('touchend', function(e) {
		e.preventDefault();
		self.pinching.status = false;
		self.prevScale = self.scale;
		self.dragging.node = undefined;
		self.dragging.dom = false;
		if(e.target == self.dom) {
			if(self.deselectedAction && self.selectedNode) {
				self.deselectedAction();
			}
			updateSelectedNode(self, null);
		}
	});

	this.dom.addEventListener('mousedown', function(e) {
		if(e.target == self.dom) {
			e.preventDefault();
			self.dragging.dom = true;
			self.dragging.currX = e.clientX * self.scale;
			self.dragging.currY = e.clientY * self.scale;
		}
	});

	this.dom.addEventListener('mousemove', function(e) {
		e.preventDefault();
		if(self.dragging.dom) {
			self.move(e.clientX * self.scale - self.dragging.currX, e.clientY * self.scale - self.dragging.currY);
			self.dragging.currX = e.clientX * self.scale;
			self.dragging.currY = e.clientY * self.scale;
		} else if(self.dragging.node) {
			for (var i = 0; i < self.trees.length; i++) {
				if (self.trees[i] === self.dragging.node._tree) {
					handleMove(self, self.dragging.node._tree, self.dragging.node, self.dragging.parent, e.clientX, e.clientY, {
						lineType: options.lineType,
						anchor: self.anchor
					});
					return;
				}
			}
		}
	});

	this.dom.addEventListener('mouseup', function(e) {
		e.preventDefault();
		self.dragging.node = undefined;
		self.dragging.dom = false;
	});

	this.dom.addEventListener('click', function(e) {
		if(e.target == self.dom) {
			if(self.deselectedAction && self.selectedNode) {
				self.deselectedAction();
			}
			updateSelectedNode(self, null);
		}
	});

	// A strange way to handle global event listeners. At least we can now remove them.
	function windowResize(e) {
		var viewBox = self.coords.x + ' ' + self.coords.y + ' ' + self.getWidth() * self.scale + ' ' + self.getHeight() * self.scale;
		self.dom.setAttribute('viewBox', viewBox);
	}

	window.addEventListener('resize', windowResize);

	this.__proto__.removeEventListeners = function() {
		window.removeEventListener('resize', windowResize);
	};
	// End of strange way.
	
	var viewBox = '0 0 ' + this.getWidth() * self.scale + ' ' + this.getHeight() * self.scale;
	self.dom.setAttribute('viewBox', viewBox);
}

/**
 * Sets the position of the svg.
 */
SVG.prototype.setPosition = function() {
	var rect = this.dom.getBoundingClientRect();
	this.x = rect.left;
	this.y = rect.top;
};

	/**
 * Sets the fill and stroke color of a node. Defaults to the tree's default values.
 * @param {Object} node The node to color.
 * @param options
 * <ul>
 *     <li>fill - The fill color</li>
 *     <li>stroke - The stroke color</li>
 * </ul>
 */
SVG.prototype.setColor = function(node, options) {
	if(!options) {
		options = {};
	}
	if(node._tree.root === node) {
		if (!options.fill)
			options.fill = node._tree.defaults.rootFill;
		if (!options.stroke)
			options.stroke = node._tree.defaults.rootStroke;
	} else {
		if (!options.fill)
			options.fill = node._tree.defaults.fill;
		if (!options.stroke)
			options.stroke = node._tree.defaults.stroke;
	}
	node._rect.style.stroke = options.stroke;
	node._rect.style.fill = options.fill;
}

/**
 * Sets the current scale of the svg to the given value.
 * @param {Number} scale The new scale.
 * @param options
 * <ul>
 *     <li>ex - The event x coordinate.</li>
 *     <li>ey - The event y coordinate.</li>
 * </ul>
 */
SVG.prototype.setScale = function(scale, options) {
	var width = this.getWidth();
	var height = this.getHeight();
	var oldWidth = this.scale * width;
	var oldHeight = this.scale * height;

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

		if (options.ex) {
			this.coords.x -= ((options.ex - this.x) / width) * (width * scale - oldWidth);
		}

		if (options.ey) {
			this.coords.y -= ((options.ey - this.y) / height) * (height * scale - oldHeight);
		}

		viewBox = this.coords.x + ' ' + this.coords.y + ' ' + width * this.scale + ' ' + height * this.scale;
		this.dom.setAttribute('viewBox', viewBox);
	}
};

/**
 * Moves the svg by the  given units
 * @param {Number} x the number of units to move the svg by on the x axis.
 * @param {Number} y the number of units to move the svg by on the y axis.
 */
SVG.prototype.move = function(x, y) {
	this.coords.x -= x;
	this.coords.y -= y;
	viewBox = this.coords.x + ' ' + this.coords.y + ' ' + this.getWidth() * this.scale + ' ' + this.getHeight() * this.scale;
	this.dom.setAttribute('viewBox', viewBox);
}

/**
 * A width getter, because Firefox handles SVG differently.
 * @return {Number} The SVG's width.
 */
SVG.prototype.getWidth = function() {
	if(this.dom.scrollWidth > 0) {
		return this.dom.scrollWidth;
	}
	var type = this.dom.width.baseVal.unitType;
	if(type == 2) {
		return this.dom.parentNode.scrollWidth * this.dom.width.baseVal.value;
	} else {
		return this.dom.width.baseVal.value;
	}
}

/**
 * A height getter, because Firefox handles SVG differently.
 * @return {Number} The SVG's width.
 */
SVG.prototype.getHeight = function() {
	if(this.dom.scrollHeight > 0) {
		return this.dom.scrollHeight;
	}
	var type = this.dom.height.baseVal.unitType;
	if(type == 2) {
		return this.dom.parentNode.scrollHeight * this.dom.height.baseVal.value;
	} else {
		return this.dom.height.baseVal.value;
	}
}


/**
 * Sets the current anchor of the tree to the given value
 * @param {String} anchor The options are 'children' and 'none'. Default is 'none'.
 */
SVG.prototype.setAnchor = function(anchor) {
	this.anchor = anchor;
};

/**
 * Sets the action to be performed when a node is selected
 * @param {function} func The function to call when the pressing down on a node. First parameter of the function is the node.
 */
SVG.prototype.setSelectedAction = function(func) {
	this.selectedAction = func;
};

/**
 * Sets the action to be performed when a node is deselected
 * @param {function} func The function to call when the deselecting a node. It has no parameters.
 */
SVG.prototype.setDeselectedAction = function(func) {
	this.deselectedAction = func;
};

/**
 * Adds a bezier curve to the SVG.
 * @param {Number} mx the starting x position.
 * @param {Number} my the starting y position.
 * @param {Number} x the ending x position.
 * @param {Number} y the ending y position.
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
 * @param {Element} bezier Reference to the bezier curve.
 * @param {Number} mx the starting x position.
 * @param {Number} my the starting y position.
 * @param {Number} x the ending x position.
 * @param {Number} y the ending y position.
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
 * @param {Element} bezier Reference to the bezier curve.
 * @param {Number} mx the starting x position.
 * @param {Number} my the starting y position.
 */
SVG.prototype.moveBezier = function(bezier, mx, my) {
	bezier.setAttribute('transform', 'translate(' + mx + ',' + my + ')');
};

/**
 * Adds a circle to the SVG.
 * @param {Number} cx the x position.
 * @param {Number} cy the y position.
 * @param {Number} r the radius.
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
 * @param {Element} circle Reference to the circle.
 * @param {Number} cx Circle's x position.
 * @param {Number} cy Circle's y position.
 */
SVG.prototype.moveCircle = function(circle, cx, cy) {
	circle.setAttribute('cx', cx);
	circle.setAttribute('cy', cy);
};

/**
 * Adds a line to the SVG.
 * @param {Number} x1 First x position.
 * @param {Number} y1 First y position.
 * @param {Number} x2 Second x position.
 * @param {Number} y2 Second y position.
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
 * @param {Element} line Reference to the line.
 * @param {Number} x1 First x position.
 * @param {Number} y1 First y position.
 * @param {Number} x2 Second x position.
 * @param {Number} y2 Second y position.
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
 * @param {Number} x x position.
 * @param {Number} y y position.
 * @param {Number} width width of the rectangle.
 * @param {Number} height height of the rectangle.
 * @param {Number} rx radius of the x-corner.
 * @param {Number} ry radius of the y-corner.
 * @param options
 * <ul>
 *     <li>clickable - If true, the pointer will be display over this SVG element. default is false.</li>
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
	if(options.clickable)
		rect.style.cursor = 'pointer';
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
 * @param {Element} rect Reference to the rectangle.
 * @param {Number} x x position.
 * @param {Number} y y position.
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
 * @param {Number} x x position.
 * @param {Number} y y position.
 * @param {String} text The text to be contained by the text element.
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
	textNode.setAttribute('y', y + PADDING + this.dom.lastChild.getBBox().height / 2);

	return textNode;
};

/**
 * Moves a text element given a reference to the text.
 * @param {Element} textNode Reference to the text.
 * @param {Number} x x position.
 * @param {Number} y y position.
 */
SVG.prototype.moveText = function(textNode, x, y) {
	textNode.setAttribute('x', x + PADDING);
	textNode.setAttribute('y', y + PADDING + textNode.getBBox().height / 2);
};

/**
 * Clears the SVG.
 */
SVG.prototype.clear = function() {
	Tree.maxIndex = 0;
	this.dom.innerHTML = '';
};

/**
 * Removes an SVG element given a reference to it.
 * @param {Element} element The SVG element.
 */
SVG.prototype.removeElement = function(element) {
	this.dom.removeChild(element);
}

/**
 * Updates the colors of a selected node.
 * @param {Object} svg A reference to the SVG data structure
 * @param {Object} node The node within the SVG that is selected.
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
	if(node != null && node != undefined) {
		svg.current.fill = node._rect.style.fill;
		svg.current.stroke = node._rect.style.stroke;
		if (!options)
			options = {};
		if (options.fill)
			svg.selectedNode._rect.style.fill = options.fill;
		else
			svg.selectedNode._rect.style.fill = '#33DD33';
		if (options.stroke)
			svg.selectedNode._rect.style.stroke = options.stroke;
		else
			svg.selectedNode._rect.style.stroke = '#11BB11';
	}
}

/**
 * Removes a node, given a reference to the node, from the SVG and the data structure.
 * @param {Object} node the node.
 * @param {boolean} maintainChildren if true, won't delete a node with children, otherwise it will delete a node and its children. Default is true.
 * @returns {Object} the node if deleted, null otherwise.
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
 * @param {Object} svg The SVG data structure.
 * @param {Object} node The node to remove.
 * @returns {Object} The node if it was a success, null otherwise.
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
 * @param {Object} root the node of the tree to traverse.
 * @param options
 * <ul>
 *     <li>anchor - The anchor of the children when dragging a node. Options are 'none' and 'children'. Default is 'none'</li>
 *     <li>cornerRadius - The corner radius of each node. Default is 2.</li>
 *     <li>fill - The fill color of regular nodes. Default is #BBDDFF.</li>
 *     <li>lineStroke - The stroke color of tree edges/lines. Default is the same as stroke color. Default is </li>
 *     <li>lineType - The type of line to connect nodes with. Options are 'bezier' and 'line'. Default is 'line'.</li>
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
	var tree = new Tree(root);
	tree.defaults = {};

	if(options.fill)
		tree.defaults.fill = options.fill;
	else
		tree.defaults.fill = '#BBDDFF';

	if(options.stroke)
		tree.defaults.stroke = options.stroke;
	else
		tree.defaults.stroke = '#6688BB';

	if(options.rootFill)
		tree.defaults.rootFill = options.rootFill;
	else
		tree.defaults.rootFill = '#FF6666';

	if(options.rootStroke)
		tree.defaults.rootStroke = options.rootStroke;
	else
		tree.defaults.rootStroke = '#DD2222';

	if(options.lineStroke)
		tree.defaults.lineStroke = options.lineStroke;
	else
		tree.defaults.lineStroke = tree.defaults.stroke;

	if(!options.lineType) {
		options.lineType = 'line';
	}

	if(options.cornerRadius)
		tree.defaults.cornerRadius = options.cornerRadius;
	else
		tree.defaults.cornerRadius = 2;

	if(self.clearable)
		self.clear();

	tree.lineType = options.lineType;

	tree.traverse(function(node, level, index, parent) {
		node._tree = tree;
		if(node.contents) {
			node._text = self.addText(0, 0, node.contents);
		}

		var rect;
		if(!parent) {
			rect = self.addRectangle(0, 0, 5, 5, tree.defaults.cornerRadius, tree.defaults.cornerRadius, {
				clickable: true,
				fill: tree.defaults.rootFill,
				stroke: tree.defaults.rootStroke,
				child: node._text
			});
		}
		else {
			rect = self.addRectangle(0, 0, 5, 5, tree.defaults.cornerRadius, tree.defaults.cornerRadius, {
				clickable: true,
				fill: tree.defaults.fill,
				stroke: tree.defaults.stroke,
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
					stroke: tree.defaults.lineStroke
				});
			} else {
				options.lineType = 'line'
				node._line = self.addLine(parent.x + offset.parX, parent.y + offset.parY, node.x + offset.x, node.y + offset.y, {
					stroke: tree.defaults.lineStroke
				});
			}

			node._direction = self.addCircle(node.x + offset.x, node.y + offset.y, 2, {
				fill: tree.defaults.lineStroke,
				stroke: tree.defaults.lineStroke,
			});
		}
	});

	if(!options.anchor)
		options.anchor = 'none';
	self.anchor = options.anchor;

	tree.traverse(function(node, level, index, parent) {
		node._rect.addEventListener('mousedown', function(e) {
			e.preventDefault();
			if (self.selectedAction)
				self.selectedAction(node);
			updateSelectedNode(self, node, {
				fill: options.selectedFill,
				stroke: options.selectedStroke
			});
			self.dragging.node = node;
			self.dragging.parent = parent;
			self.dragging.anchorX = e.clientX * self.scale - node.x;
			self.dragging.anchorY = e.clientY * self.scale - node.y;
		});
		node._rect.addEventListener('touchstart', function(e) {
			e.preventDefault();
			if(e.touches.length == 1) {
				if (self.selectedAction)
					self.selectedAction(node);
				updateSelectedNode(self, node, {
					fill: options.selectedFill,
					stroke: options.selectedStroke
				});
				self.dragging.node = node;
				self.dragging.parent = parent;
				self.dragging.anchorX = e.touches[0].clientX * self.scale - node.x;
				self.dragging.anchorY = e.touches[0].clientY * self.scale - node.y;
			}
		});
	});

	self.trees.push(tree);
};

/**
 * Given an event's new position, update the current node.
 * @param {Object} self the SVG object.
 * @param {Object} tree the tree structure.
 * @param {Object} currNode the node to move.
 * @param {Object} nodeParent the node's parent.
 * @param {Number} ex event x position.
 * @param {Number} ey event y position.
 * @param options
 * <ul>
 *     <li>anchor - the object to anchor child nodes to. Options are 'descendents', 'children' and 'none'. Default is 'none'</li>
 * <ul>
 */
function handleMove(self, tree, currNode, nodeParent, ex, ey, options) {
	if(!options)
		options = {};
	var origX = currNode.x;
	var origY = currNode.y;
	currNode.x = ex * self.scale - self.dragging.anchorX;
	currNode.y = ey * self.scale - self.dragging.anchorY;
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
	if(tree.lineType == 'bezier') {
		if (currNode._line)
			self.resetBezier(currNode._line, nodeParent.x + currNode._offset.parX, nodeParent.y + currNode._offset.parY, currNode.x + currNode._offset.x, currNode.y + currNode._offset.y);
		for (i = 0; i < currNode.children.length; i++) {
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
		for (i = 0; i < currNode.children.length; i++) {
			if (currNode.children[i]._line) {
				self.moveLine(currNode.children[i]._line, currNode.x + currNode.children[i]._offset.parX, currNode.y + currNode.children[i]._offset.parY, currNode.children[i].x + currNode.children[i]._offset.x, currNode.children[i].y + currNode.children[i]._offset.y);
			}
		}
	}
	if(options.anchor == 'children') {
		for(i = 0; i < currNode.children.length; i++) {
			handleMove(self, tree, currNode.children[i], currNode, (currNode.children[i].x + currNode.x - origX + self.dragging.anchorX) / self.scale, (currNode.children[i].y + currNode.y - origY + self.dragging.anchorY) / self.scale, {
				anchor: 'none',
				lineType: options.lineType
			});
		}
	} else if(options.anchor == 'descendents') {
		for(i = 0; i < currNode.children.length; i++) {
			handleMove(self, tree, currNode.children[i], currNode, (currNode.children[i].x + currNode.x - origX + self.dragging.anchorX) / self.scale, (currNode.children[i].y + currNode.y - origY + self.dragging.anchorY) / self.scale, {
				anchor: 'descendents',
				lineType: options.lineType
			});
		}
	}
}

/**
 * Gets the offset required for the first and second control point for a bezier curve
 * given two nodes.
 * @param {Object} node the current node.
 * @param {Object} parent the current node's parent.
 * @param options
 * <ul>
 *     <li>layout - The orientation of the lines/edges, options are 'horizontal' and 'vertical'. Default is 'horizontal'.</li>
 * <ul>
 * @returns {Object} The offset of the node.
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