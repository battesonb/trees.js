import 'mocha';
import { assert } from 'chai';

import Node from "../../src/Models/Node";

describe("Node", () => {
  describe("#addChild", () => {
    let parent = new Node("test_parent");
    let child = new Node("test_child");
    it("should add a child to the list.", () => {
      assert.equal(parent.childCount(), 0);
      parent.addChild(child);
      assert.equal(parent.getChildAt(0), child);
    });
    it("should set the child's parent to this node.", () => {
      assert.equal(parent.getChildAt(0).parent, parent);
    });
  });

  describe("#getChild", () => {
    let parent = new Node("test_parent");
    let childOne = new Node("test_child1", 0);
    let childTwo = new Node("test_child2", 1);
    parent.addChild(childOne);
    parent.addChild(childTwo);
    it("should return a child based on ID.", () => {
      assert.equal(parent.getChild(1), childTwo);
    });
  });

  describe("#foreachChild", () => {
    let parent = new Node("test_parent");
    for(let i = 0; i < 5; i++) {
      parent.addChild(new Node(i.toString(), i));
    }
    it("should call the callback function on every child of the node", () => {
      parent.foreachChild((node: Node) => {
        node.setText("modified");
      });
      for(let i = 0; i < parent.childCount(); i++) {
        assert.equal(parent.getChildAt(i).getText(), "modified");
      }
    });
  });

  describe("#bringToFront", () => {
    let parent = new Node("test_parent");
    let childOne = new Node("test_child1", 0);
    let childTwo = new Node("test_child2", 1);
    parent.addChild(childOne);
    parent.addChild(childTwo);
    it("should reorder the children list to bring the chosen node to the front (being the end of the list, as the last thing drawn).", () => {
      assert.equal(parent.getChildAt(0), childOne);
      childOne.bringToFront();
      assert.equal(parent.getChildAt(1), childOne);
    });
  });
});