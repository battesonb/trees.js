# trees.js
A somewhat optimised interactive tree diagramming library. This library uses SVG and the built in events system at this stage.

## Installing
To install the package, simply run the following command:
```
npm install trees.js
```

## Version
### 1.1.7
- Added removeEventListeners (Only removes global listeners for now, such as on window)
- Added setDeselected
- Reduced number of event listeners.
- Added new setColor function.
- Fixed zooming for an offset element.
- Zooming no longer allows document scrolling.
- SVG width and height values now accept all units, not just pixels. (This includes percentage based width/height).
- Window scaling issue fixed.
- require now exports the trees object.
- More options added to drawTree function.
- Scaling in desktop and mobile added.
- removeNode function added.
- Renamed SVG pointers that are attached to nodes.

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
anchor: 'none'            // Sets which nodes move with the current node. Options are 'children', 'descendents', 'none'.
cornerRadius: 2           // Sets the corner radius of the nodes in the given tree.
fill: '#BBDDFF'           // The fill color of a regular node.
lineStroke: stroke        // The edge/line stroke colour.
lineType: 'line'          // The type of edge/line. Options are 'bezier', 'line'.
rootFill: '#FF6666'       // The fill color of the root node.
rootStroke: '#DD2222'     // The stroke color of the root node.
selectedFill: '#33DD33'   // The fill color of the selected node.
selectedStroke: '#11BB11' // The stroke color of the selected node.
stroke: '#6688BB'         // The stroke color of a regular node.

```

## Functions
Set anchor:
```
svg.setAnchor(anchor);
```
Set the selected node's action, where the signature of func is func(node):
```
svg.setSelectedAction(func);
```
Set the deselection action, when a node is deselected, where the signature of func is func():
```
svg.setDeselectedAction(func);
```
Remove global event listeners
```
svg.removeEventListeners();
```
Remove a node from the SVG, and the Tree data structure. The default of maintainChildren is true, if false, it will delete
a node and all of its children.
```
svg.removeNode(node, maintainChildren); // Returns the node if deleted.
```
Set color of a given node:
```
svg.setColor(node, options);

//options
fill: tree default   // fill color as a string.
stroke: tree default // stroke color as a string.
```

## Variables
Get the currently selected node:
```
svg.selectedNode
```