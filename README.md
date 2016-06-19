# trees.js
An attempt to make a somewhat optimised interactive tree diagramming library. This library uses SVG and the built in events system currently.

## Using the library 
Once you have imported the .js file from the dist folder, a tree object will be brought into the global space. It can also be accessed using a require.

Once you have this, create an svg object by doing the following:
```
var svg = new trees.SVG('mySVG', {width: 1920, height: 980});
```
Where 'mySVG' is the id of the svg element on the dom.

Now once you have a tree of the following form...

```
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
```
... you can draw the tree to the svg by using the following function:

```
svg.drawTree(root, { lineType: 'bezier' });
```

## Options
SVG Instantiation:
```
var svg = new trees.SVG(id, options)
```
options:
| Variable | Description                       | Values         | Default |
|----------|-----------------------------------|----------------|---------|
| clear    | Clears the previous tree if true. | boolean        | false   |
| height   | Sets the height of the svg.       | Number, String | '200px' |
| width    | Sets the width of the svg.        | Number, String | '200px' |

SVG Draw:
```
svg.drawTree(root, options)
```
options:
| Variable   | Description                                  | Values                            | Default    |
|------------|----------------------------------------------|-----------------------------------|------------|
| anchor     | Sets which nodes move with the current node. | 'children', 'descendents', 'none' | 'none'     |
| fill       | The fill color of a regular node.            | String                            | '#BBDDFF'  |
| lineStroke | The edge/line stroke colour.                 | String                            | stroke     |
| lineType   | The type of edge/line.                       | 'bezier', 'line'                  | 'line'     |
| rootFill   | The fill color of the root node.             | String                            | '#FF6666'  |
| rootStroke | The stroke color of the root node.           | String                            | '#DD2222'  |
| stroke     | The stroke color of a regular node.          | String                            | '#6688BB'  |


## Functions
Set anchor:
```
svg.setAnchor(anchor)
```
Set the selected node's action, where the signature of func is func(node):
```
setSelectedAction(func)
```

## Variables
Currently selected node:
```
svg.selectedNode
```