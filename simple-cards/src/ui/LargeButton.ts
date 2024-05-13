import { FancyButton } from '@pixi/ui';
import { NineSliceSprite, Texture } from 'pixi.js';
import { Label } from './Label';
import gsap from 'gsap';

const defaultLargeButtonOptions = {
    text: '',
    width: 240,
    height: 50,
    default: 'button-large',
    hover: 'button-large-hover',
    press: 'button-large-press',
};

type LargeButtonOptions = typeof defaultLargeButtonOptions;

/**
 * The big rectangle button, with a label, idle and pressed states
 */
export class LargeButton extends FancyButton {
    /** The buttoon message displayed */
    private messageLabel?: Label;

    constructor(options: Partial<LargeButtonOptions> = {}) {
        const opts = { ...defaultLargeButtonOptions, ...options };

        const defaultView = new NineSliceSprite({
            texture: Texture.from(opts.default),
            leftWidth: 10,
            topHeight: 10,
            rightWidth: 10,
            bottomHeight: 10,
            width: opts.width,
            height: opts.height,
        });

        const hoverView = new NineSliceSprite({
            texture: Texture.from(opts.hover),
            leftWidth: 10,
            topHeight: 10,
            rightWidth: 10,
            bottomHeight: 10,
            width: opts.width,
            height: opts.height,
        });

        const pressedView = new NineSliceSprite({
            texture: Texture.from(opts.press),
            leftWidth: 10,
            topHeight: 10,
            rightWidth: 10,
            bottomHeight: 10,
            width: opts.width,
            height: opts.height,
        });

        super({
            defaultView,
            hoverView,
            pressedView,
            anchor: 0.5,
        });
        if (opts.text) {
            this.messageLabel = new Label(opts.text, {
                fill: 0x000000,
                align: 'center',
            });
            this.addChild(this.messageLabel);
        }

        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
        this.onHover.connect(this.handleHover.bind(this));
        this.on('pointerupoutside', this.handleUp.bind(this));
        this.on('pointerout', this.handleUp.bind(this));
    }

    private handleHover() {
        // sfx.play('common/sfx-hover.wav');
    }

    private handleDown() {
        // sfx.play('common/sfx-press.wav');
    }

    private handleUp() {}

    /** Show the component */
    public async show(animated = true) {
        gsap.killTweensOf(this.pivot);
        this.visible = true;
        if (animated) {
            this.pivot.y = -200;
            await gsap.to(this.pivot, { y: 0, duration: 0.5, ease: 'back.out' });
        } else {
            this.pivot.y = 0;
        }
        this.interactiveChildren = true;
    }

    /** Hide the component */
    public async hide(animated = true) {
        this.interactiveChildren = false;
        gsap.killTweensOf(this.pivot);
        if (animated) {
            await gsap.to(this.pivot, { y: -200, duration: 0.3, ease: 'back.in' });
        } else {
            this.pivot.y = -200;
        }
        this.visible = false;
    }
}
