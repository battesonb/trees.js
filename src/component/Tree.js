'use strict';

/**
 * Abstract tree data structure.
 * @param node the root node.
 */
function Tree(node) {
	this.root = node;
}

var PADDING = 10;

/**
 * Sets the x and y positions of the nodes if they are not already present
 * <ul>
 *     <li>Adds x and y positions to nodes if they do not
 *     already have any.</li>
 * </ul>
 */
Tree.prototype.initialize = function() {
	var currNode = this.root;
	if(!Tree.maxIndex)
		Tree.maxIndex = 0;
	var lastMaxIndex = Tree.maxIndex;
	if(currNode != null) {
		traverseBFS(currNode, function(node, level, index) {
			if(index + 1 > Tree.maxIndex)
				Tree.maxIndex = index + 1;
			if(!node.hasOwnProperty('x'))
				node.x = level * 165;
			if(!node.hasOwnProperty('y'))
				node.y = (index + lastMaxIndex) * (node._rect.height.baseVal.value + PADDING);
		});
		Tree.maxIndex+= lastMaxIndex;
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
	if(node == undefined || func == undefined)
		return;
	if(level == undefined) {
		level = 0
	}
	if(index == undefined)
		index = 0;
	func(node, level, index, parent);
	if(node.children) {
		for (var i = 0; i < node.children.length; i++) {
			traverse(node.children[i], func, level + 1, i, node);
		}
	}
}

/**
 * Traverse a tree of nodes from a given node in level-order, applying a function to
 * each node and setting a property 'parent' to its parent node.
 * @param node The node to traverse from.
 * @param func The function to apply to each node.
 * @param level The current level of the node, undefined if this is the root.
 * @param index The index of the node, undefined if this is the root.
 */
function traverseBFS(node, func, level, index) {
	if(node == undefined || func == undefined)
		return;
	if(level == undefined)
		level = 0;
	if(index == undefined)
		index = 0;

	var list = [];
	var nextList = [];
	list.push(node);
	while(list.length > 0) {
		var currNode = list.splice(0, 1)[0];
		index++;
		if(currNode.children) {
			for (var i = 0; i < currNode.children.length; i++) {
				var childNode = currNode.children[i];
				childNode.parent = currNode;
				nextList.push(childNode);
			}
		}
		func(currNode, level, index);
		if(list.length === 0) {
			list = nextList;
			nextList = [];
			level++;
			index = 0;
		}
	}
}

/**
 * Wraps the traverse function for the Tree data structure.
 * @param func The function to apply to each node.
 */
Tree.prototype.traverse = function(func) {
	traverse(this.root, func);
}

/**
 * Wraps the traverseBFS function for the Tree data structure.
 * @param func The function to apply to each node.
 */
Tree.prototype.traverseBFS = function(func) {
	traverseBFS(this.root, func);
}

/**
 * Internal node data structure, used by tree.
 */
function Node(contents) {
	if(contents === undefined)
		this.contents = "";
	else
		this.contents = contents;
	this.children = [];
}

/**
 * Adds a child of any type to the node.
 * @param contents the contents of the child to add to the current node.
 */
Node.prototype.addChild = function(contents) {
	var newNode = new Node(contents);
	this.children.push(newNode);
	return newNode;
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