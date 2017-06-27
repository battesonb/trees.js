import Node from "./Node";
import Canvas from "../Components/Canvas";

export default class Tree {
  private root: Node;

  /**
   * Builds the tree given a nested json object representing the nodes of the tree.
   * Allowed attributes include: text, x, y, children, and id.
   * @param json Representation of the tree.
   * @param canvas Canvas object for measuring width/height and determining text-wrapping of nodes.
   */
  constructor(json: object, canvas: Canvas) {
    this.addNode(json);
  }

  private addNode(descent: object, node?: Node) {
    if(descent !== undefined && descent !== null) {
      if(descent["text"] !== undefined) {
        let id = descent["id"] !== undefined ? descent["id"] : -1;
        let x = descent["x"] !== undefined ? descent["x"] : 0;
        let y = descent["y"] !== undefined ? descent["y"] : 0;
        let child = new Node(descent["text"], id, x, y);
        if(node === undefined || node === null) {
          this.root = child;
          node = this.root;
        } else {
          node.addChild(child);
        }
        if(descent["children"] !== undefined) {
          for(let i = 0; i < descent["children"].length; i++) {
            this.addNode(descent["children"][i], node);
          }
        }
      }
    }
  }

  /**
   * Performs a callback on each node of this tree. Default behaviour is a depth-first on
   * the root node.
   * TODO add breadth-first descent.
   * @param callback
   * @param breadthFirst Defaults to false.
   * @param node The node to start the descent from.
   * @param level Start counting levels from this parameter's value.
   */
  each(callback: (node: Node) => any, breadthFirst?: boolean, node: Node = this.root, level: number = 0): void {
    if(node !== undefined && node !== null) {
      callback(node);
      for(let i = 0; i < node.childCount(); i++) {
        this.each(callback, breadthFirst, node.getChildAt(i), level + 1);
      }
    }
  }

  /**
   * Returns the number of nodes within this tree.
   */
  children(): number {
    let count = 0;
    this.each((node: Node) => {
      count++;
    });
    return count;
  }
}