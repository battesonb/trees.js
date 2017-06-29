import Node from "../../Models/Node";
import SpatialHash from "../SpatialHash";

export interface IRenderer {
    clear(): void;
    drawTree(): void;
    drawHashGroups(hash: SpatialHash): void;
    drawNode(node: Node, selected?: boolean): void;
    drawPaths(node: Node): void;
    setSelectedNode(node: Node): void;
}