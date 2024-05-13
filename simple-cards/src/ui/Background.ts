import { Container, Texture, Sprite } from 'pixi.js';

/**
 * The app's background based on Sprite, always present in the screen
 */
export class Background extends Container {
    private sprite: Sprite;

    constructor() {
        super();

        this.sprite = new Sprite({
            texture: Texture.from('background'),
        });
        this.addChild(this.sprite);
    }

    /** Get the sprite width */
    public get width() {
        return this.sprite.width;
    }

    /** Set the sprite width */
    public set width(value: number) {
        this.sprite.width = value;
    }

    /** Get the sprite height */
    public get height() {
        return this.sprite.height;
    }

    /** Set the sprite height */
    public set height(value: number) {
        this.sprite.height = value;
    }

    /** Resize the background, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
