import Node from "./Node";
import Canvas from "../Components/Canvas";

export default class Tree {
  _root: Node;

  /**
   * Builds the tree given a nested json object representing the nodes of the tree.
   * Allowed attributes include: text, x, y, children, and id.
   * @param json Representation of the tree.
   */
  constructor(json: object, canvas: Canvas) {
    if(json["text"] !== undefined) {
      this._root = new Node(json["text"]);
    }
  }
}