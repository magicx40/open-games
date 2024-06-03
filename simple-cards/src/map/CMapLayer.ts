import { CompositeTilemap } from '@pixi/tilemap';
import { TextureSource } from 'pixi.js';

export class CMapLayer extends CompositeTilemap {
    public selectedMapTiles: string[] = [];
    constructor(tileset?: Array<TextureSource>) {
        super(tileset);
    }
}
