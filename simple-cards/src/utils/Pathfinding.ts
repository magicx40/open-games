class Pathfinding {
    static findPath(startNode, targetNode) {
        const toSearch = [startNode];
        const processed = new Set();

        while (toSearch.length > 0) {
            let current = toSearch[0];
            for (const node of toSearch) {
                if (node.f < current.f || (node.f === current.f && node.h < current.h)) {
                    current = node;
                }
            }

            processed.add(current);
            toSearch.splice(toSearch.indexOf(current), 1);

            if (current.coords.toString() === targetNode.coords.toString()) {
                let currentPathTile = targetNode;
                const path = [];
                while (currentPathTile !== startNode) {
                    path.push(currentPathTile);
                    currentPathTile = currentPathTile.connection;
                }
                path.reverse();
                return path;
            }
            console.log(current, '123123213213');

            for (const neighbor of current.neighbors.filter((t) => t.walkable && !processed.has(t))) {
                const inSearch = toSearch.includes(neighbor);
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
