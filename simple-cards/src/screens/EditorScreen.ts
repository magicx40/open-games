import { Container, FederatedPointerEvent, FederatedWheelEvent, Point, Sprite, Texture } from 'pixi.js';
import { RoundedBox } from '../ui/RoundedBox';

import { app } from '../main';
import { CheckBox, RadioGroup } from '@pixi/ui';
import { Label } from '../ui/Label';
import { CMapLayer } from '../map/CMapLayer';
import { CMap } from '../map/CMap';
import { MapPoint } from '../map/const';

const MapSize = [
    {
        text: '10*10',
        value: [10, 10],
    },
    {
        text: '25*25',
        value: [25, 25],
    },
    {
        text: '50*50',
        value: [50, 50],
    },
];

function generateNestedArray(levels: Array<number>, fillValue: number) {
    if (!Array.isArray(levels) || levels.length !== 2) {
        throw new Error('The "levels" parameter must be an array with exactly two elements.');
    }

    const [firstLevelCount, secondLevelCount] = levels;

    if (!Number.isInteger(firstLevelCount) || !Number.isInteger(secondLevelCount)) {
        throw new Error('Both elements in the "levels" array must be integers.');
    }

    if (firstLevelCount <= 0 || secondLevelCount <= 0) {
        throw new Error('Both elements in the "levels" array must be positive integers.');
    }

    // 生成二维数组
    const nestedArray = [];

    for (let i = 0; i < firstLevelCount; i++) {
        const secondLevelArray = [];

        for (let j = 0; j < secondLevelCount; j++) {
            secondLevelArray.push(fillValue);
        }

        nestedArray.push(secondLevelArray);
    }

    return nestedArray;
}

export class EditorScreen extends Container {
    public static assetBundles = ['game', 'common'];
    private editorToolPopup: RoundedBox;
    private editorContainer: Container;
    private editorLayer!: CMapLayer;
    private currentSelectEditorMapTile: number = 1;
    private currentSelectEditorMapSize: number[] = [25, 25];
    private touchMap = false;

    constructor() {
        super();

        app.stage.eventMode = 'static';
        app.stage.on('wheel', this.onWheelEvent.bind(this));

        this.editorContainer = new Container();
        this.addChild(this.editorContainer);

        this.editorContainer.eventMode = 'static';
        this.editorContainer.on('pointerdown', this.onPointerdown.bind(this));
        this.editorContainer.on('pointermove', this.onPointermove.bind(this));
        this.editorContainer.on('pointerup', this.onPointerup.bind(this));
        this.editorContainer.on('pointerupoutside', this.onPointerup.bind(this));

        this.editorToolPopup = new RoundedBox();
        this.editorToolPopup.position.set(150, app.screen.height / 2);
        this.addChild(this.editorToolPopup);

        this.initEditorToolPopup();
        this.initEditorDefaultMap(
            generateNestedArray(this.currentSelectEditorMapSize, this.currentSelectEditorMapTile),
        );
    }

    public initEditorToolPopup() {
        // 地图大小
        const mapSizelabel = new Label('地图大小：', { fontSize: 20, fontWeight: '500', fill: 0xffffff });
        mapSizelabel.position.set(-65, -230);
        this.editorToolPopup.addChild(mapSizelabel);
        const mapSizeRadioGroup = new RadioGroup({
            items: MapSize.map(
                (item) =>
                    new CheckBox({
                        text: item.text,
                        style: {
                            unchecked: `switch_off`,
                            checked: `switch_on`,
                            text: {
                                fill: 0xffffff,
                            },
                        },
                    }),
            ),
            type: 'vertical',
            elementsMargin: 5,
        });
        mapSizeRadioGroup.selectItem(this.currentSelectEditorMapTile);
        this.currentSelectEditorMapSize = MapSize[this.currentSelectEditorMapTile]!.value;
        mapSizeRadioGroup.position.set(0, -270);
        mapSizeRadioGroup.onChange.connect((radioSelectedId: number) => {
            this.currentSelectEditorMapSize = MapSize[radioSelectedId]!.value;
            this.editorContainer.removeChild(this.editorLayer);
            this.initEditorDefaultMap(
                generateNestedArray(this.currentSelectEditorMapSize, this.currentSelectEditorMapTile),
            );
        });
        this.editorToolPopup.addChild(mapSizeRadioGroup);

        // 地图瓦片
        const mapTilelabel = new Label('地形瓦片：', { fontSize: 20, fontWeight: '500', fill: 0xffffff });
        mapTilelabel.position.set(-65, -150);
        this.editorToolPopup.addChild(mapTilelabel);

        // sprites 是你的精灵数组
        const sprites = [1, 2, 3, 4, 5, 6, 7]; // 假设这里存放了你的精灵对象

        const spritesPerRow = 3; // 每行显示的精灵数量
        const spriteWidth = 56; // 精灵的宽度
        const spriteHeight = 64; // 精灵的高度
        const horizontalSpacing = 15; // 横向间隔
        const verticalSpacing = 15; // 纵向间隔
        const startX = -98; // 第一行精灵起始 X 坐标
        const startY = -95; // 第一行精灵起始 Y 坐标

        // 遍历精灵数组，设置位置
        sprites.forEach((_sprite, index) => {
            const spriteSelect = new Container();
            spriteSelect.label = `mapTile${_sprite}`;
            const spriteSelectBg = Sprite.from('editor_tile_select');
            spriteSelectBg.label = `tileBg`;
            spriteSelectBg.position.set(-4, -5);
            spriteSelectBg.alpha = this.currentSelectEditorMapTile === _sprite ? 1 : 0;
            spriteSelect.addChild(spriteSelectBg);
            const sprite = Sprite.from(`editor_m${_sprite}`);
            sprite.interactive = true;
            sprite.eventMode = 'static';
            sprite.onclick = () => {
                sprites.forEach((_sprite1) => {
                    const spc = this.editorToolPopup.getChildByLabel(`mapTile${_sprite1}`);
                    if (spc && spc.getChildByLabel('tileBg')) {
                        spc.getChildByLabel('tileBg')!.alpha = 0;
                    }
                });
                spriteSelectBg.alpha = 1;
                this.currentSelectEditorMapTile = _sprite;
                console.log(this.currentSelectEditorMapTile);
            };
            // 计算当前精灵所在行和列
            const row = Math.floor(index / spritesPerRow); // 当前精灵所在行数
            const col = index % spritesPerRow; // 当前精灵所在列数
            // 计算精灵的位置
            const x = startX + col * (spriteWidth + horizontalSpacing);
            const y = startY + row * (spriteHeight + verticalSpacing);

            spriteSelect.position.set(x, y);
            spriteSelect.addChild(sprite);

            // 将精灵添加到舞台或容器中
            this.editorToolPopup.addChild(spriteSelect);
        });
    }

    public initEditorDefaultMap(mapPoint: MapPoint) {
        this.editorLayer = new CMapLayer();
        this.editorLayer.label = 'mapLayer';
        mapPoint.forEach((tiles: Array<number>, i: number) => {
            tiles.forEach((_item: number, j: number) => {
                const x = ((i + 1) % 2 === 0 ? 27 : 0) + j * 52;
                const y = i * 44;
                const ct = new CMap(Texture.from(`editor_m${_item}`), this.editorLayer, true);
                ct.label = `${i}:${j}`;
                ct.position.set(x, y);
                this.editorLayer.addChild(ct);
            });
        });
        this.editorContainer.addChild(this.editorLayer);
        this.editorContainer.position.set(
            (app.renderer.width - this.editorContainer.width) / 2,
            (app.renderer.height - this.editorContainer.height) / 2,
        );
    }

    public calcInAABB(point: Point) {
        if (!this.editorLayer) return;
        console.log(point);
        // 遍历容器的子元素，查找事件发生的位置是否在子元素范围内
        for (const child of this.editorLayer.children) {
            // 获取子元素的包围盒
            const bounds = child.getBounds();

            // 检查选中的点是否在子元素的包围盒内
            if (bounds.containsPoint(point.x, point.y)) {
                (child as CMap).setMapTile(Texture.from(`editor_m${this.currentSelectEditorMapTile}`));
            }
        }
    }

    public onWheelEvent(event: FederatedWheelEvent) {
        console.log(event);
    }

    public onPointerdown(event: FederatedPointerEvent) {
        this.touchMap = true;
        const globalPosition = event.data.global;
        this.calcInAABB(globalPosition);
    }

    public onPointerup() {
        this.touchMap = false;
    }

    public onPointermove(event: FederatedPointerEvent) {
        if (this.touchMap) {
            const globalPosition = event.data.global;
            this.calcInAABB(globalPosition);
        }
    }

    public async show() {}

    public async hide() {}
}
