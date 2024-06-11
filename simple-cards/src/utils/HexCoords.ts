class HexCoords {
    q: number;
    r: number;

    constructor(q: number, r: number) {
        this.q = q;
        this.r = r;
    }

    // 计算曼哈顿距离
    getDistance(other: HexCoords): number {
        const delta = this.subtract(other);
        return delta.axialLength();
    }

    // 计算两个坐标之间的差异
    subtract(other: HexCoords): HexCoords {
        return new HexCoords(this.q - other.q, this.r - other.r);
    }

    // 计算轴长度
    axialLength(): number {
        return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.q + this.r));
    }

    toString(): string {
        return `${this.q}:${this.r}`;
    }
}

export { HexCoords };
