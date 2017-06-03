import Node from "./Node";
import Canvas from "../Components/Canvas";

export default class Tree {
  _root: Node;

  /**
   * Builds the tree given a nested json object representing the nodes of the tree.
   * Allowed attributes include: text, x, y, children, and id.
   * @param json Representation of the tree.
   * @param canvas Canvas object for measuring width/height and determining text-wrapping of nodes.
   */
  constructor(json: object, canvas: Canvas) {
    this._addNode(json);
  }

  _addNode(descent: object, node?: Node) {
    if(descent !== undefined) {
      if(descent["text"] !== undefined) {
        let id = descent["id"] !== undefined ? descent["id"] : -1;
        let x = descent["x"] !== undefined ? descent["x"] : 0;
        let y = descent["y"] !== undefined ? descent["y"] : 0;
        let child = new Node(descent["text"], id, x, y);
        if(node === undefined) {
          this._root = child;
          node = this._root;
        } else {
          node.addChild(child);
        }
        if(descent["children"] !== undefined) {
          for(let i = 0; i < descent["children"].length; i++) {
            this._addNode(descent["children"][i], node);
          }
        }
      }
    }
  }

  each(callback: (node: Node) => any, node: Node = this._root): void {
    if(node !== undefined && node !== null) {
      for(let i = 0; i < node._children.length; i++) {
        this.each(callback, node._children[i]);
      }
      callback(node);
    }
  }
}