import Camera from "./Components/Camera";
import EventSystem from "./Components/EventSystem";
import Renderer from "./Components/Renderer";
import Tree from "./Models/Tree";

export default class TreesJS {
  _camera: Camera;
  _eventSystem: EventSystem;
  _renderer: Renderer;
  _tree: Tree;

  constructor(id: string, options?: any) {
    if(options === undefined) {
      options = {};
    }

    if(options.node === undefined) {
      options.node = {};
    }
    if(options.node.color === undefined) {
      options.node.color = "#FFAA55";
    }
    if(options.node.rounded === undefined) {
      options.node.rounded = 4;
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
      options.shadow.path.blur = 0;
    }
    if(options.shadow.path.color === undefined) {
      options.shadow.path.color = "#000";
    }
    if(options.shadow.path.offsetX === undefined) {
      options.shadow.path.offsetX = 0;
    }
    if(options.shadow.path.offsetY === undefined) {
      options.shadow.path.offsetY = 0;
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

    this._camera = new Camera(0, 0, 2);
    this._renderer = new Renderer(id, this._camera, options);
    this._eventSystem = new EventSystem(this._camera, this._renderer);
  }
}

/*
// Example of options object.
options = {
  node: {
    color: "#FFAA55",
    rounded: 5,
    stroke: {
      color: "#000"
      size: 0
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