export class HexNode {
    constructor(q: number, r: number, walkable = true) {
        this.q = q; // 列坐标
        this.r = r; // 行坐标
        this.walkable = walkable;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
    q: number;
    r: number;
    walkable: boolean;
    g: number;
    h: number;
    f: number;
    parent: HexNode | null;
}

export class HexAStar {
    grid: HexNode[][];
    openList: HexNode[];
    closedList: HexNode[];
    constructor(grid: HexNode[][]) {
        this.grid = grid;
        this.openList = [];
        this.closedList = [];
    }

    heuristic(node: HexNode, end: HexNode) {
        // 使用六边形网格的曼哈顿距离作为启发式函数
        return (Math.abs(node.q - end.q) + Math.abs(node.q + node.r - end.q - end.r) + Math.abs(node.r - end.r)) / 2;
    }

    findPath(start: HexNode, end: HexNode) {
        this.openList.push(start);

        while (this.openList.length > 0) {
            // 找到F值最小的节点
            let lowIndex = 0;
            for (let i = 1; i < this.openList.length; i++) {
                if (this.openList[i].f < this.openList[lowIndex].f) {
                    lowIndex = i;
                }
            }
            const currentNode = this.openList[lowIndex];

            // 如果找到了终点
            if (currentNode.q === end.q && currentNode.r === end.r) {
                let curr = currentNode;
                const ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                console.log(ret, '最优解');
                return ret.reverse();
            }

            // 从openList中移除currentNode，加入到closedList中
            this.openList.splice(lowIndex, 1);
            this.closedList.push(currentNode);

            // 获取当前节点的邻居节点
            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (this.closedList.includes(neighbor) || !neighbor.walkable) {
                    continue;
                }

                const gScore = currentNode.g + 1; // 假设每个移动代价为1
                let gScoreIsBest = false;

                if (!this.openList.includes(neighbor)) {
                    gScoreIsBest = true;
                    neighbor.h = this.heuristic(neighbor, end);
                    this.openList.push(neighbor);
                } else if (gScore < neighbor.g) {
                    gScoreIsBest = true;
                }

                if (gScoreIsBest) {
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }

        // 没有找到路径
        return [];
    }

    getNeighbors(node: HexNode) {
        const neighbors = [];
        const directions = [
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, 0],
            [-1, 1],
            [0, 1],
        ];

        for (const direction of directions) {
            const q = node.q + direction[0];
            const r = node.r + direction[1];

            if (this.isValidPosition(q, r)) {
                neighbors.push(this.grid[r][q]);
            }
        }

        return neighbors;
    }

    isValidPosition(q: number, r: number) {
        return r >= 0 && r < this.grid.length && q >= 0 && q < this.grid[r].length;
    }
}

// // 示例使用
// const grid = [];
// for (let r = 0; r < 10; r++) {
//     const row = [];
//     for (let q = 0; q < 10; q++) {
//         row.push(new HexNode(q, r));
//     }
//     grid.push(row);
// }

// // 设置障碍物
// grid[1][1].walkable = false;
// grid[1][2].walkable = false;
// grid[1][3].walkable = false;

// const startNode = grid[0][0];
// const endNode = grid[9][9];

// const astar = new HexAStar(grid);
// const path = astar.findPath(startNode, endNode);

// if (path.length > 0) {
//     console.log('Path found:');
//     for (const node of path) {
//         console.log(`(${node.q}, ${node.r})`);
//     }
// } else {
//     console.log('No path found.');
// }
