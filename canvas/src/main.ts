import Camera from "./Components/Camera";
import CanvasStage from "./Components/Stage/CanvasStage";
import EventSystem from "./Components/EventSystem";
import CanvasRenderer from "./Components/Renderer/CanvasRenderer";
import Tree from "./Models/Tree";

import { IRenderer } from "./Components/Renderer/IRenderer";
import { IStage } from "./Components/Stage/IStage";

export default class TreesJS {
  private camera: Camera;
  private stage: IStage;
  private eventSystem: EventSystem;
  private renderer: IRenderer;
  private tree: Tree;

  constructor(id: string, json: object, options?: any) {
    if(options === undefined) {
      options = {};
    }

    if(options.node === undefined) {
      options.node = {};
    }
    if(options.node.color === undefined) {
      options.node.color = "#55AAFF";
    }
    if(options.node.rounded === undefined) {
      options.node.rounded = 4;
    }
    if(options.node.padding === undefined) {
      options.node.padding = 4;
    }
    if(options.node.margin === undefined) {
      options.node.margin = 32;
    }
    if(options.node.stroke === undefined) {
      options.node.stroke = {};
    }
    if(options.node.stroke.color === undefined) {
      options.node.stroke.color = "#000";
    }
    if(options.node.stroke.size === undefined) {
      options.node.stroke.size = 0;
    }
    if(options.node.selected === undefined) {
      options.node.selected = {};
    }
    if(options.node.selected.color === undefined) {
      options.node.selected.color = "#FFAA55";
    }
    if(options.node.selected.stroke === undefined) {
      options.node.selected.stroke = {};
    }
    if(options.node.selected.stroke.color === undefined) {
      options.node.selected.stroke.color = "#000";
    }
    if(options.node.selected.stroke.size === undefined) {
      options.node.selected.stroke.size = 1;
    }

    if(options.path === undefined) {
      options.path = {};
    }
    if(options.path.color === undefined) {
      options.path.color = "#55AAFF";
    }
    if(options.path.size === undefined) {
      options.path.size = 2;
    }

    if(options.text === undefined) {
      options.text = {};
    }
    if(options.text.color === undefined) {
      options.text.color = "#FFF";
    }
    if(options.text.family === undefined) {
      options.text.family = "Arial";
    }
    if(options.text.size === undefined) {
      options.text.size = 18;
    }
    if(options.text.stroke === undefined) {
      options.text.stroke = {};
    }
    if(options.text.stroke.color === undefined) {
      options.text.stroke.color = "#000";
    }
    if(options.text.stroke.size === undefined) {
      options.text.stroke.size = 0;
    }

    if(options.shadow === undefined) {
      options.shadow = {};
    }
    if(options.shadow.node === undefined) {
      options.shadow.node = {};
    }
    if(options.shadow.node.blur === undefined) {
      options.shadow.node.blur = 8;
    }
    if(options.shadow.node.color === undefined) {
      options.shadow.node.color = "rgba(0, 0, 0, 0.25)";
    }
    if(options.shadow.node.offsetX === undefined) {
      options.shadow.node.offsetX = 0;
    }
    if(options.shadow.node.offsetY === undefined) {
      options.shadow.node.offsetY = 4;
    }
    if(options.shadow.path === undefined) {
      options.shadow.path = {};
    }
    if(options.shadow.path.blur === undefined) {
      options.shadow.path.blur = 1;
    }
    if(options.shadow.path.color === undefined) {
      options.shadow.path.color = "rgba(0, 0, 0, 0.25)";
    }
    if(options.shadow.path.offsetX === undefined) {
      options.shadow.path.offsetX = 0;
    }
    if(options.shadow.path.offsetY === undefined) {
      options.shadow.path.offsetY = 4;
    }
    if(options.shadow.text === undefined) {
      options.shadow.text = {};
    }
    if(options.shadow.text.blur === undefined) {
      options.shadow.text.blur = 1;
    }
    if(options.shadow.text.color === undefined) {
      options.shadow.text.color = "rgba(0, 0, 0, 0.3)";
    }
    if(options.shadow.text.offsetX === undefined) {
      options.shadow.text.offsetX = 0;
    }
    if(options.shadow.text.offsetY === undefined) {
      options.shadow.text.offsetY = 0;
    }

    this.stage = new CanvasStage(id);
    this.camera = new Camera(0, 0, this.stage.getWidth() / 2, this.stage.getHeight() / 2, 1);
    this.tree = new Tree(json, this.stage);
    this.renderer = new CanvasRenderer(this.camera, <CanvasStage>this.stage, this.tree, options);
    this.eventSystem = new EventSystem(this.camera, this.renderer, this.stage, this.tree);
  }
}

/*
// Example of options object.
options = {
  node: {
    color: "#FFAA55",
    rounded: 5,
    margin: 32,
    padding: 5,
    stroke: {
      color: "#000"
      size: 0
    },
    selected {
      color: "#FFAA55",
      stroke: {
        color: "#000"
        size: 0
      }
    }
  },
  path: {
    color: "#55AAFF",
    size: 2
  },
  text: {
    color: "#FFF",
    family: "Arial",
    size: 18,
    stroke: {
      color: "#000",
      size: 0
    }
  },
  shadow: {
    node: {
      blur: 8,
      color: "rgba(0, 0, 0, 0.25)",
      offsetX: 0,
      offsetY: 4
    },
    path: {
      blur: 0,
      color: "#000",
      offsetX: 0,
      offsetY: 0
    },
    text: {
      blur: 0,
      color: "#000",
      offsetX: 0,
      offsetY: 0
    }
  }
}
*/

(<any>window).TreesJS = TreesJS;