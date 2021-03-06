// Create the SVG.
var svg = new require('trees.js').SVG('mySVG', {width: 1920, height: 980});

// Create some trees.
var root = {contents: "Hello", children: [
	{ contents: "Whoa", children: [
		{ contents: "Um", children: [] },
		{ contents: "Dude", children: [] },
		{ contents: "Breadth-First", children: [] }
	] },
	{ contents: "Another", children: [
		{ contents: "Um", children: [] }
	] }
]};

var anotherRoot = {contents: "1", children: [
	{ contents: "1.1", children: [
		{ contents: "1.1.1", children: [] },
		{ contents: "1.1.2", children: [] },
		{ contents: "1.1.3", children: [] }
	] },
	{ contents: "1.2", children: [
		{ contents: "1.2.1", children: [] }
	] },
	{ contents: "1.3", children: [
		{ contents: "1.3.1", children: [] },
		{ contents: "1.3.2", children: [] }
	] }
]};



var lastRoot = { contents: "Um", children: [
	{ contents: "Fantastic", children: [] },
	{ contents: "Awesome", children: [
		{ contents: "Wow", children: [] },
		{ contents: "Awesome", children: [
			{ contents: "Testing", children: [] },
			{ contents: "The", children: [] },
			{ contents: "Anchors", children: [] },
		] },
	] },
	{ contents: "Such", children: [
		{ contents: "Bezier", children: [] }
	] }
] };

// Draw the trees.
svg.drawTree(root, {
	anchor: 'none',
	lineType: 'line',
	rootFill: '#999',
	rootStroke: '#555',
	lineStroke: '#555'
});
svg.drawTree(anotherRoot);
svg.drawTree(lastRoot, {
	lineType: 'bezier',
});

// Set the anchor for pressing different keys
window.onkeypress = function(e) {
	if(e.keyCode == '97') // a is pressed
		svg.setAnchor('descendents');
	if(e.keyCode == '115') // s is pressed
		svg.setAnchor('children');
}

window.onkeyup = function(e) {
	svg.setAnchor('');
}