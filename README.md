# trees.js
An attempt to make a somewhat optimised interactive tree diagramming library. This library uses SVG and the built in events system currently.

## Installing
To install the package, simply run the following command:
```
npm install trees.js
```

## Using the library 
Once you have imported the .js file from the dist folder, a tree object will be brought into the global space. It can also be accessed using a require.

Once you have this, create an svg object by doing the following:
```
var svg = new trees.SVG('mySVG', { width: 1920, height: 980 });
```
Where 'mySVG' is the id of the svg element on the dom.

Now once you have a tree of the following form...

```
var root = { contents: "Hello", children: [
				{ contents: "Whoa", children: [
					{ contents: "Um", children: [] },
					{ contents: "Dude", children: [] },
					{ contents: "Breadth-First", children: [] }
				] },
				{ contents: "Another", children: [
					{ contents: "Um", children: [] }
				] }
			] };
```
... you can draw the tree to the svg by using the following function:

```
svg.drawTree(root, { lineType: 'bezier' });
```

## Options
These are the options and their defaults.

SVG Instantiation:
```
var svg = new trees.SVG(id, options)

//options:
clear: false         // Clears the previous tree if true.
height: '200px'      // Sets the height of the svg.
width: '200px'       // Sets the width of the svg.

```

SVG Draw:
```
svg.drawTree(root, options)

//options:
anchor: 'none'        // Sets which nodes move with the current node. Options are 'children', 'descendents', 'none'.
fill: '#BBDDFF'       // The fill color of a regular node.
lineStroke: stroke    // The edge/line stroke colour.
lineType: 'line'      // The type of edge/line. Options are 'bezier', 'line'.
rootFill: '#FF6666'   // The fill color of the root node.
rootStroke: '#DD2222' // The stroke color of the root node.
stroke: '#6688BB'     // The stroke color of a regular node.

```

## Functions
Set anchor:
```
svg.setAnchor(anchor)
```
Set the selected node's action, where the signature of func is func(node):
```
svg.setSelectedAction(func)
```

## Variables
Get the currently selected node:
```
svg.selectedNode
```