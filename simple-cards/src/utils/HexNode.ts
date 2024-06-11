import { HexCoords } from './HexCoords';

// 棋子为偶数行时，周围点的位置
const o_dir = [
    { dx: 0, dy: -1 }, // 左上
    { dx: -1, dy: 0 }, // 左
    { dx: 0, dy: 1 }, // 左下
    { dx: 1, dy: -1 }, // 右上
    { dx: 1, dy: 0 }, // 右
    { dx: 1, dy: 1 }, // 右下
];

// 棋子为奇数行时，周围点的位置
const e_dir = [
    { dx: -1, dy: -1 }, // 左上
    { dx: -1, dy: 0 }, // 左
    { dx: -1, dy: 1 }, // 左下
    { dx: 0, dy: -1 }, // 右上
    { dx: 1, dy: 0 }, // 右
    { dx: 0, dy: 1 }, // 右下
];

class HexNode {
    coords: HexCoords;
    walkable: boolean;
    neighbors: Array<HexNode>;
    g: number;
    h: number;
    f: number;
    connection: HexNode | null;

    constructor(walkable: boolean, coords: HexCoords) {
        this.walkable = walkable;
        this.coords = coords;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.neighbors = [];
        this.connection = null;
    }

    setH(h: number) {
        this.h = h;
        this.f = this.g + this.h;
    }

    setG(g: number) {
        this.g = g;
        this.f = this.g + this.h;
    }

    setConnection(connectionNode: HexNode) {
        this.connection = connectionNode;
    }

    // Helper to reduce noise in pathfinding
    getDistance(other: HexNode) {
        return this.coords.getDistance(other.coords);
    }

    cacheNeighbors(grid: Array<HexNode>, bounds: { minQ: number; maxQ: number; minR: number; maxR: number }) {
        // 当前格子的奇偶行
        const eRow = isEvenRow(this.coords.r + 1);
        // 六个方向的相邻格子坐标变化
        const directions = eRow ? e_dir : o_dir;
        this.neighbors = directions
            .map((dir) => new HexCoords(this.coords.q + dir.dx, this.coords.r + dir.dy))
            .map((item) => grid.find((gItem) => item.q === gItem.coords.q && item.r === gItem.coords.r))
            .filter(
                (neighbor) =>
                    neighbor !== undefined &&
                    neighbor.coords.q >= bounds.minQ &&
                    neighbor.coords.q <= bounds.maxQ &&
                    neighbor.coords.r >= bounds.minR &&
                    neighbor.coords.r <= bounds.maxR,
            ) as Array<HexNode>;

        console.log(`节点${this.coords.toString()} 的邻居点是`, this.neighbors);
    }
}

// 计算奇偶行
function isEvenRow(y: number) {
    return y % 2 === 0;
}

export { HexNode };
