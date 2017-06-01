/**
 * The representation of a node of the tree.
 */
export default class Node {
  _id: number;
  _children: Array<Node>;
  _text: string;
  parent: Node;

  constructor(text: string, x: number = undefined, y: number = undefined, id: number = undefined) {
    this.setText(text);
    this.setId(id);
  }

  /**
   * Sets the identifier of the node. Uniqueness of the identifier is not determined.
   * @param id
   */
  setId(id: number): void {
    this._id = id;
  }

  getId(): number {
    return this._id;
  }

  setText(text: string): void {
    this._text = text;
  }

  /**
   * Adds a child to the current node and sets the parent of the child as the object of the calling the method.
   * @param child 
   */
  addChild(child: Node): void {
    this._children.push(child);
    child.parent = this;
  }

  /**
   * Gets the child with a specific identifier.
   * TODO make faster with a binary search, maybe? Probably not though.
   * @param id
   */
  getChild(id: number): Node {
    for(let i = 0; i < this._children.length; i++) {
      let child = this._children[i];
      if(child.getId() === id) {
        return child;
      }
    }
    return null;
  }
}