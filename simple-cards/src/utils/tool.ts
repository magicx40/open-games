import { Point } from 'pixi.js';

export function copyPoint(point: Point) {
    const { x, y } = point;
    return new Point(x, y);
}
