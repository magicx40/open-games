import { Container, Sprite } from 'pixi.js';

export class GameLogo extends Container {
    private image: Sprite;
    constructor() {
        super();
        this.image = Sprite.from('logo-game');
        this.image.anchor.set(0.5);
        this.image.scale.set(0.5);
        this.addChild(this.image);
    }
}