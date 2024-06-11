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

// 获取相邻格子
function getNeighbors(x: number, y: number, boardWidth: number, boardHeight: number) {
    // 当前格子的奇偶行
    const eRow = isEvenRow(y + 1);
    // 六个方向的相邻格子坐标变化
    const directions = eRow ? e_dir : o_dir;
    const neighbors: { x: number; y: number }[] = [];
    directions.forEach((dir) => {
        const neighborX = x + dir.dx;
        const neighborY = y + dir.dy;
        // 检查相邻格子是否在棋盘范围内
        if (neighborX >= 0 && neighborX < boardWidth && neighborY >= 0 && neighborY < boardHeight) {
            neighbors.push({ x: neighborX, y: neighborY });
        }
    });
    return neighbors;
}

// 计算奇偶行
function isEvenRow(y: number) {
    return y % 2 === 0;
}

// 获取所有可到达的点
export function findReachableTiles(
    startX: number,
    startY: number,
    maxDistance: number,
    boardWidth: number,
    boardHeight: number,
    hasStartPoint?: boolean,
) {
    const reachableTiles: Set<string> = new Set();
    const queue: { x: number; y: number; distance: number }[] = [{ x: startX, y: startY, distance: 0 }];
    while (queue.length > 0) {
        const current = queue.shift() as { x: number; y: number; distance: number };
        const currentX = current.x;
        const currentY = current.y;
        const currentDistance = current.distance;

        // 将当前格子标记为可到达
        reachableTiles.add(`${currentX}:${currentY}`);

        // 获取当前格子的相邻格子
        const neighbors = getNeighbors(currentX, currentY, boardWidth, boardHeight);
        for (const neighbor of neighbors) {
            const neighborX = neighbor.x;
            const neighborY = neighbor.y;

            // 如果相邻格子未被访问过且在可移动范围内，则加入队列
            if (!reachableTiles.has(`${neighborX}:${neighborY}`) && currentDistance + 1 <= maxDistance) {
                queue.push({
                    x: neighborX,
                    y: neighborY,
                    distance: currentDistance + 1,
                });
            }
        }
    }

    !hasStartPoint && reachableTiles.delete(`${startX}:${startY}`);

    return reachableTiles;
}
