class GridManager {
    constructor() {
        this.tiles = [];
    }

    static get instance() {
        if (!GridManager._instance) {
            GridManager._instance = new GridManager();
        }
        return GridManager._instance;
    }

    addTile(tile) {
        this.tiles.push(tile);
    }
}

export { GridManager };
