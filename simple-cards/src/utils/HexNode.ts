import { NodeBase } from './NodeBase.js';

class HexNode extends NodeBase {
    cacheNeighbors(grid) {
        this.neighbors = grid.filter((tile) => this.coords.getDistance(tile.coords) === 1);
        console.log('this.ne', this.neighbors);
    }
}

export { HexNode };
