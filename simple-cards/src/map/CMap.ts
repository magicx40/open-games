import { Container, Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';
import { CMapLayer } from './CMapLayer';
import { SHORTCUT } from '../utils/global';

export interface Entity {
    name: string;
    texture: Texture;
}

export class CMap extends Container {
    public tileSprite = new Sprite();
    public tileHoverSprite = new Sprite();
    public _texture;
    public cmapLayer;
    public selected = false;
    public isEditorMode = false;
    public tileId = 0;

    constructor(texture: Texture, cmapLayer: CMapLayer, isEditorMode: boolean = false) {
        super();
        this._texture = texture;
        this.cmapLayer = cmapLayer;
        this.isEditorMode = isEditorMode;
        this.tileSprite.texture = texture;
        this.tileSprite.anchor.set(0.5);
        if (!isEditorMode) {
            this.tileSprite.scale.set(0.125);
            this.tileSprite.interactive = true;
            this.tileSprite.eventMode = 'static';
            this.tileSprite.onclick = this.clickHandler.bind(this);
        } else {
            this.tileSprite.scale.set(0.125);
        }

        this.addChild(this.tileSprite);
        if (!isEditorMode) {
            this.tileHoverSprite.texture = Texture.from('editor_mh');
            this.tileHoverSprite.interactive = true;
            this.tileHoverSprite.eventMode = 'static';
            this.tileHoverSprite.anchor.set(0.5);
            this.tileHoverSprite.scale.set(0.125);
            this.tileHoverSprite.alpha = 0;
            this.tileHoverSprite.onclick = this.clickHandler.bind(this);
            this.addChild(this.tileHoverSprite);
        }
    }

    private clickHandler() {
        if (SHORTCUT.key === ' ' || this.isEditorMode) return;
        const isClickBlank = !this.cmapLayer.selectedMapTiles.includes(this.label);
        console.log('ddd', this.selected);
        const reachableTiles = JSON.parse(JSON.stringify(this.cmapLayer.selectedMapTiles));
        if (reachableTiles.length && isClickBlank) {
            reachableTiles.forEach((tilePos: string) => {
                const cmap = this.cmapLayer.getChildByLabel(tilePos) as CMap;
                if (cmap) {
                    cmap.setSelected(false);
                    const needDeleteMapTilePosIndex = reachableTiles.indexOf(tilePos);
                    if (needDeleteMapTilePosIndex >= 0) {
                        this.cmapLayer.selectedMapTiles.splice(needDeleteMapTilePosIndex, 1);
                    }
                }
            });
        } else {
            this.selected = !this.selected;

            this.cmapLayer.setChildIndex(this, this.cmapLayer.children.length - 1);
            gsap.killTweensOf(this.tileHoverSprite);
            gsap.to(this.tileHoverSprite, {
                alpha: this.selected ? 1 : 0,
                duration: 0.4,
                ease: 'back.out',
            });
        }
    }

    setSelected(isSelected = false) {
        this.selected = isSelected;

        this.cmapLayer.setChildIndex(this, this.cmapLayer.children.length - 1);
        gsap.killTweensOf(this.tileHoverSprite);
        gsap.to(this.tileHoverSprite, {
            alpha: this.selected ? 1 : 0,
            duration: 0.4,
            ease: 'back.out',
        });
    }

    setMapTile(texture: Texture) {
        this.tileSprite.texture = texture;
    }

    setMapTileId(tileId: number) {
        this.tileId = tileId;
    }
}
