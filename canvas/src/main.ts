import Renderer from "./Components/Renderer";

export default class TreesJS {
  renderer: Renderer;

  constructor(id: string, options?: Object) {
    this.renderer = new Renderer(id);
  }
}

/*
// Example of options object.
options = {
  stroke: {
    color: "#55AAFF"
    size: 2
  },
  fill: "#FFAA55",
  shadow: {
    node: {
      blur: 8
      color: "rgba(0, 0, 0, 0.25)"
      offsetX: 0
      offsetY: 4
    },
    path: {
      blur: 8
      color: "rgba(0, 0, 0, 0.25)"
      offsetX: 0
      offsetY: 4
    }
  }
  shape: {
    rounded: 5
  }
}
*/

(<any>window).TreesJS = TreesJS;