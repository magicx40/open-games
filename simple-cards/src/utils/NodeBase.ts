class NodeBase {
    constructor(walkable, coords) {
        this.walkable = walkable;
        this.coords = coords;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.connection = null;
        this.neighbors = [];
    }

    setConnection(nodeBase) {
        this.connection = nodeBase;
    }

    setG(g) {
        this.g = g;
        this.f = this.g + this.h;
    }

    setH(h) {
        this.h = h;
        this.f = this.g + this.h;
    }

    cacheNeighbors(grid) {
        throw new Error('cacheNeighbors() must be implemented in subclasses');
    }
}

export { NodeBase };
