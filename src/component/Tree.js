'use strict';

/**
 * Abstract tree data structure.
 * @param contents the root node's default contents.
 */
function Tree(contents) {
	this.root = new Node(contents);
}

/**
 * Performs a few initialization operations
 * <ul>
 *     <li>Adds x and y positions to nodes if they do not
 *     already have any.</li>
 * </ul>
 */
Tree.prototype.initialize = function() {
	var currNode = this.root;
	if(currNode != null) {
		traverse(currNode, function(node, level, index, parent) {
			if(!node.hasOwnProperty('x'))
				node.x = level * 110;
			if(!node.hasOwnProperty('y'))
				if(level === 0) {
					node.y = 0;
				} else {
					if(parent.children.length === 1)
						node.y = 0;
					else
						node.y = (index / (parent.children.length-1)) * 70;
				}
		});
	}
}

/**
 * Traverse a tree of nodes from a given node, applying a function to
 * each node.
 * @param node The node to traverse from.
 * @param func The function to apply to each node.
 * @param level The current level of the node, undefined if this is the root.
 * @param index The index of the node, undefined if this is the root.
 * @param parent The parent of the node, undefined if this is the root.
 */
function traverse(node, func, level, index, parent) {
	if(node == undefined)
		return;
	if(level == undefined) {
		level = 0
	}
	func(node, level, index, parent);
	for(var i = 0; i < node.children.length; i++) {
		traverse(node.children[i], func, level+1, i, node);
	}
}

/**
 * Wraps the traverse function for the Tree data structure.
 * @param func The function to apply to each node.
 * @param level The current level of the node, undefined if this is the root.
 * @param index The index of the node, undefined if this is the root.
 * @param parent The parent of the node, undefined if this is the root.
 */
Tree.prototype.traverse = function(func, level, index, parent) {
	traverse(this.root, func, level, index, parent);
}

/**
 * Internal node data structure, used by tree.
 */
function Node(contents) {
	this.contents = contents;
	this.children = [];
}

/**
 * Adds a child of any type to the node.
 * @param contents the contents of the child to add to the current node.
 */
Node.prototype.addChild = function(contents) {
	this.children.push(new Node(contents));
}

/**
 * Removes a child given a reference.
 * Since this is an n-tree of different types of elements
 * we'll have to go through all children of the node, unfortunately.
 * @param child the object to remove from the node.
 * @returns the child if it was removed, null otherwise.
 */
Node.prototype.removeChild = function(child) {
	for(var i = 0; i < this.children.length; i++) {
		if(this.children[i] === child) {
			this.children.pop(child)
			return child;
		}
	}
	return null;
}

module.exports = Tree;