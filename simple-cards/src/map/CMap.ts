import { Container, Sprite, Texture, FederatedPointerEvent } from 'pixi.js';

export class CMap extends Container {
    constructor(texture: Texture) {
        super();
        const sprite = new Sprite(texture);
        sprite.interactive = true;
        sprite.eventMode = 'static';
        sprite.onclick = this.clickHandler.bind(this);
        this.addChild(sprite);
    }

    clickHandler(event: FederatedPointerEvent) {
        console.log(event);
    }
}
