'use strict';

var SVG = require('./component/SVG');

var Tree = require('./component/Tree');

window.onload = function() {
	var svg = new SVG('mySVG', {width: 1880, height: 960});
	/*for(var i = 0; i < 10; i++) {
		for(var j = 0; j < 10; j++) {
			svg.addRectangle(i * 25 + 5, j * 25 + 5, 20, 20, 5, 5).onclick = function() {
				this.style.fill = "#FF0000";
			};
		}
	}*/

	/*
	var tree = new Tree();	
	var node = tree.root;
	for(var i = 0; i < 10; i++) {
		for(var j = 0; j < 20; j++) {
			node.addChild();
		}
		node = node.children[0];
	}
	tree.initialize();
	*/

	var tree = new Tree();	
	var node = tree.root;
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < 3; j++) {
			node.addChild();
		}
		node = node.children[0];
	}
	tree.initialize();

	svg.drawTree(tree);
};