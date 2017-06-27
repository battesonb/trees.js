import AABB from "../Components/Colliders/AABB";

/**
 * The representation of a node of the tree.
 */
export default class Node extends AABB {
  private id: number;
  private children: Node[];
  private text: string;
  parent: Node;

  constructor(text: string, id: number = -1, x: number = 0, y: number = 0) {
    super(x, y);
    this.setText(text);
    this.setId(id);
    this.children = [];
    this.setWidth(70); // TEMPORARY, TODO DELETE THIS
    this.setHeight(24);
  }

  /**
   * Sets the identifier of the node. Uniqueness of the identifier is not determined.
   * @param id
   */
  setId(id: number): void {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  /**
   * Adds a child to the current node and sets the parent of the child as the object of the calling the method.
   * @param child 
   */
  addChild(child: Node): void {
    this.children.push(child);
    child.parent = this;
  }

  /**
   * Gets the child with a specific identifier.
   * TODO make faster with a binary search, maybe? Probably not though.
   * - Unlikely if we reorder children with bringToFront.
   * - Search time is O(n) and nodes aren't expected to have considerably many children.
   *    - If this becomes the case, remove bringToFront and implement binary search.
   * @param id
   */
  getChild(id: number): Node {
    for(let i = 0; i < this.children.length; i++) {
      let child = this.children[i];
      if(child.getId() === id) {
        return child;
      }
    }
    return null;
  }

  /**
   * Gets a child by its index.
   * @param index
   */
  getChildAt(index: number): Node {
    return this.children[index];
  }

  /**
   * Returns the number of children this node has.
   */
  childCount(): number {
    return this.children.length;
  }

  /**
   * Performs a callback function on each child node of this node.
   * @param callback
   */
  foreachChild(callback: (node: Node, index?: number) => any): void {
    for(let i = 0; i < this.children.length; i++) {
      callback(this.getChildAt(i), i);
    }
  }

  /**
   * Brings this node to the front of the parent's children.
   */
  bringToFront(): void {
    let parent: Node = this.parent;
    if(parent) {
      for(let i = 0; i < parent.children.length; i++) {
        if(parent.children[i] === this) {
          parent.children.splice(i, 1);
          break;
        }
      }
      parent.children.push(this);
    }
  }
}