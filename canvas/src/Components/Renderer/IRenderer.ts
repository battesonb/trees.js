import Node from "../../Models/Node";
import SpatialHash from "../SpatialHash";

export interface IRenderer {
    /**
     * Clears the screen.
     */
    clear(): void;

    /**
     * Draws the tree
     */
    drawTree(): void;

    /**
    * A debugging method for visualising how the spatial hash looks.
    */
    drawHashGroups(hash: SpatialHash): void;

    /**
     * Draws the node to the screen.
     */
    drawNode(node: Node, selected?: boolean): void;
    
    /**
     * Draws all paths leaving a node.
     */
    drawPaths(node: Node): void;

    /**
     * Sets the selected node for potentially different coloring.
     */
    setSelectedNode(node: Node): void;
}