import 'mocha';
import { assert } from 'chai';

import Node from "../../src/Models/Node";
import Tree from "../../src/Models/Tree";

describe("Tree", () => {
  describe("#constructor", () => {
    it("should create a tree from a correctly structured JS object.", () => {
      // Test no nodes
      let tree: Tree = new Tree({}, null);
      assert.equal(tree.children(), 0);
      tree = new Tree(null, null);
      assert.equal(tree.children(), 0);

      // Test single node
      tree = new Tree({
        id: 0,
        text: "Hello!",
        x: 5,
        y: 2
      }, null);
      assert.equal(tree.children(), 1);
      tree.each((node: Node) => {
        assert.equal(node.getId(), 0);
        assert.equal(node.getText(), "Hello!");
        assert.equal(node.position.x, 5);
        assert.equal(node.position.y, 2);
      });

      // Test multi node
      tree = new Tree({
        id: 0,
        text: "Hello!",
        x: 5,
        y: 2,
        children: [
          { id: 1,
          text: "What",
          x: 10,
          y: 5 },
          { id: 2,
          text: "What",
          x: 10,
          y: 5 }
        ]
      }, null);
      assert.equal(tree.children(), 3);
    });
  });

  describe("#each", () => {
    let tree: Tree = new Tree({
      id: 0,
      text: "Hello!",
      x: 5,
      y: 2,
      children: [
        { id: 1,
        text: "What",
        x: 10,
        y: 5,
        children: [
          {
            id: 3,
            text: "Another",
            x: 11,
            y: 22
          }
        ]},
        { id: 2,
        text: "What",
        x: 10,
        y: 5 }
      ]
    }, null);
    it("should perform a callback on all nodes of a tree.", () => {
      let arr: number[];

      let count: number = 0;
      tree.each((node: Node) => {
        count++;
      });
      assert.equal(count, 4);
    });
    it("should perform breadth-first searches.", () => {
      let currLevel = -1;
      tree.each((node: Node, level: number) => {
        if(currLevel <= level) {
          currLevel = level;
        } else {
          assert(false);
        }
      }, true);
    });
  });
});