class HexCoords {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        this.sqrt3 = Math.sqrt(3);
        this.pos = {
            x: this.q * this.sqrt3 + this.r * (this.sqrt3 / 2),
            y: this.r * 1.5,
        };
    }

    getDistance(other) {
        return this.axialLength(this.subtract(other));
    }

    subtract(other) {
        return new HexCoords(this.q - other.q, this.r - other.r);
    }

    axialLength() {
        if (this.q === 0 && this.r === 0) return 0;
        if (this.q > 0 && this.r >= 0) return this.q + this.r;
        if (this.q <= 0 && this.r > 0) return Math.max(-this.q, this.r);
        if (this.q < 0) return -this.q - this.r;
        return Math.max(-this.r, this.q);
    }

    toString() {
        return `${this.q}:${this.r}`;
    }
}

export { HexCoords };
