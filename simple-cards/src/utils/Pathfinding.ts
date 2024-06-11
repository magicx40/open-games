import { HexNode } from './HexNode';

class Pathfinding {
    static findPath(startNode: HexNode, targetNode: HexNode) {
        const toSearch = [startNode];
        const processed = new Set();

        while (toSearch.length > 0) {
            let current = toSearch[0];
            for (const node of toSearch) {
                if (node.f < current.f || (node.f === current.f && node.h < current.h)) {
                    current = node;
                }
            }

            processed.add(current.coords.toString());
            toSearch.splice(toSearch.indexOf(current), 1);

            if (current.coords.toString() === targetNode.coords.toString()) {
                let currentPathTile = current;
                const path = [];
                while (currentPathTile.coords.toString() !== startNode.coords.toString()) {
                    path.push(currentPathTile);
                    currentPathTile = currentPathTile.connection as HexNode;
                }
                path.reverse();
                return path;
            }

            for (const neighbor of current.neighbors.filter((t) => t.walkable && !processed.has(t.coords.toString()))) {
                const inSearch = toSearch.some(
                    (toSearchHexNode) => toSearchHexNode.coords.toString() === neighbor.coords.toString(),
                );
                const costToNeighbor = current.g + current.coords.getDistance(neighbor.coords);

                if (!inSearch || costToNeighbor < neighbor.g) {
                    neighbor.setG(costToNeighbor);
                    neighbor.setConnection(current);

                    if (!inSearch) {
                        neighbor.setH(neighbor.coords.getDistance(targetNode.coords));
                        toSearch.push(neighbor);
                    }
                }
            }
        }
        return null;
    }
}

export { Pathfinding };
