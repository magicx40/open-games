import { Container, Point, Texture } from 'pixi.js';
import { MAP_POINT } from '../map/const';
import { app } from '../main';
import { copyPoint } from '../utils/tool';
import { SHORTCUT } from '../utils/global';
import { CMapLayer } from '../map/CMapLayer';
import { CMap } from '../map/CMap';
import { Role, RoleType } from '../map/Role';
import { HexNode } from '../utils/HexNode';
import { HexCoords } from '../utils/HexCoords.js';
import { Pathfinding } from '../utils/Pathfinding.js';

/** The screen that holds the Resistance Actions game */
export class GameScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['game', 'common'];
    public readonly mapContainer: Container;
    public mapContainerOriginalPos = new Point();
    public mouseDownPoint = new Point();
    public touchBlank = false;
    public moveGridMap: HexNode[] = [];

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
        this.moveGridMap = [];
        MAP_POINT.forEach((tiles: Array<number>, i: number) => {
            tiles.forEach((_item: number, j: number) => {
                const x = ((i + 1) % 2 === 0 ? 25 : 0) + j * 50;
                const y = i * 44;
                const ct = new CMap(Texture.from(`editor_m${_item}`), mapLayer);
                ct.label = `${j}:${i}`;
                ct.position.set(x, y);
                mapLayer.addChild(ct);

                // 初始化移动map地图
                this.moveGridMap.push(new HexNode(_item != 9, new HexCoords(j, i)));
            });
        });
        this.moveGridMap.forEach((tile) => tile.cacheNeighbors(this.moveGridMap));
        this.mapContainer.addChild(mapLayer);
        this.mapContainer.position.set(
            (app.renderer.width - this.mapContainer.width) / 2,
            (app.renderer.height - this.mapContainer.height) / 2,
        );
        console.log('移动范围地图：', this.moveGridMap);
    }

    public initEntity() {
        const entityLayer = new CMapLayer();
        const mapLayer = this.mapContainer.getChildByLabel('mapLayer') as CMapLayer;
        if (mapLayer && mapLayer.getChildByLabel(`2:2`)) {
            const targetPos = mapLayer.getChildByLabel(`2:2`)!.position;
            const role = new Role(RoleType.soldiers, '2:2', entityLayer, mapLayer);
            role.position = targetPos;
            entityLayer.addChild(role);

            setTimeout(() => {
                const startNode = new HexNode(true, new HexCoords(2, 2));
                const endNode = new HexNode(true, new HexCoords(8, 8));
                const path = Pathfinding.findPath(startNode, endNode);
                console.log(path, '1123');
                if (path) {
                    console.log('Path found:');
                    // for (const node of path) {
                    //     console.log(`(${node.q}, ${node.r})`);
                    //     if (mapLayer.getChildByLabel(`${node.q}:${node.r}`)) {
                    //         mapLayer.getChildByLabel(`${node.q}:${node.r}`)?.setMapTile(Texture.from('editor_m1'));
                    //     }
                    // }
                    console.log('最优路径：', path);
                } else {
                    console.log('No path found.');
                }
            }, 8000);
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
    public update() {}

    /** Pause gameplay - automatically fired when a popup is presented */
    public async pause() {}

    /** Resume gameplay */
    public async resume() {}

    /** Fully reset the game, clearing all pieces and shelf blocks */
    public reset() {}

    /** Resize the screen, fired whenever window size changes */
    public resize() {}

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

    /** Auto pause the game when window go out of focus */
    public blur() {}
}
