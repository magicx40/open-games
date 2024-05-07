import { CompositeTilemap } from '@pixi/tilemap';
import { TextureSource } from 'pixi.js';

export class CMapLayer extends CompositeTilemap {
    constructor(tileset?: Array<TextureSource>) {
        super(tileset);
    }
}
