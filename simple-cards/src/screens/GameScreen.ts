import { Container, Point, Sprite, Texture, Ticker } from 'pixi.js';
import { MAP_POINT } from '../map/const';
import { app } from '../main';
import { copyPoint } from '../utils/tool';
import { SHORTCUT } from '../utils/global';
import { CMapLayer } from '../map/CMapLayer';
import { CMap, Entity } from '../map/CMap';

/** The screen that holds the Resistance Actions game */
export class GameScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['game', 'common'];
    public readonly mapContainer: Container;
    public mapContainerOriginalPos = new Point();
    public mouseDownPoint = new Point();
    public touchBlank = false;

    constructor() {
        super();
        this.mapContainer = new Container();
        this.addChild(this.mapContainer);

        app.stage.eventMode = 'static';
        app.stage.on('pointerdown', this.onPointerdown.bind(this));
        app.stage.on('pointermove', this.onPointermove.bind(this));
        app.stage.on('pointerup', this.onPointerup.bind(this));
        app.stage.on('pointerupoutside', this.onPointerup.bind(this));

        this.initMapLayer();
        this.initEntity();
    }

    public initMapLayer() {
        const mapLayer = new CMapLayer();
        mapLayer.label = 'mapLayer';
        MAP_POINT.forEach((tiles: Array<number>, i: number) => {
            tiles.forEach((_item: number, j: number) => {
                const x = ((i + 1) % 2 === 0 ? 29 : 0) + j * 58;
                const y = i * 51;
                const ct = new CMap(Texture.from(`map_${_item}`), mapLayer);
                ct.label = `${i}:${j}`;
                ct.position.set(x, y);
                mapLayer.addChild(ct);
            });
        });
        this.mapContainer.addChild(mapLayer);
        this.mapContainer.position.set(
            (app.renderer.width - this.mapContainer.width) / 2,
            (app.renderer.height - this.mapContainer.height) / 2,
        );
    }

    public initEntity() {
        const entityLayer = new CMapLayer();
        const mapLayer = this.mapContainer.getChildByLabel('mapLayer') as CMapLayer;
        if (mapLayer && mapLayer.getChildByLabel(`5:12`)) {
            const targetPos = mapLayer.getChildByLabel(`5:12`)!.position;
            const sp = new Sprite(Texture.from('tank-1'));
            sp.anchor.set(0.5);
            sp.scale.set(0.25);
            sp.interactive = true;
            sp.eventMode = 'static';
            sp.position.set(targetPos.x, targetPos.y);
            entityLayer.addChild(sp);
        }
        this.mapContainer.addChild(entityLayer);
    }

    public onPointerdown(event: any) {
        const globalPos = event.global;
        if (SHORTCUT.key === ' ') {
            this.mapContainerOriginalPos = copyPoint(this.mapContainer.position);
            this.mouseDownPoint = copyPoint(globalPos);
        }
        this.touchBlank = true;
    }

    public onPointerup() {
        this.touchBlank = false;
    }

    public onPointermove(event: any) {
        const globalPos = event.global;
        if (this.touchBlank && SHORTCUT.key === ' ') {
            // 拖拽画布
            const dx = globalPos.x - this.mouseDownPoint.x;
            const dy = globalPos.y - this.mouseDownPoint.y;
            this.mapContainer.position.set(this.mapContainerOriginalPos.x + dx, this.mapContainerOriginalPos.y + dy);
        }
    }

    /** Prepare the screen just before showing */
    public prepare() {}

    /** Update the screen */
    public update(time: Ticker) {}

    /** Pause gameplay - automatically fired when a popup is presented */
    public async pause() {}

    /** Resume gameplay */
    public async resume() {}

    /** Fully reset the game, clearing all pieces and shelf blocks */
    public reset() {}

    /** Resize the screen, fired whenever window size changes */
    public resize(width: number, height: number) {}

    /** Show screen with animations */
    public async show() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    /** Hide screen with animations */
    public async hide() {
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }

    public onKeyDown(event: KeyboardEvent) {
        SHORTCUT.key = event.key;
    }

    public onKeyUp() {
        SHORTCUT.key = '';
    }

    /** Finish the gameplay, save stats and go to the results */
    private async finish() {}

    /** Auto pause the game when window go out of focus */
    public blur() {}
}
