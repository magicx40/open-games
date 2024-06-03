import { Container, Sprite } from 'pixi.js';
import { CMapLayer } from './CMapLayer';
import gsap from 'gsap';
import { findReachableTiles } from '../utils/position';
import { MAP_POINT } from './const';
import { CMap } from './CMap';

export enum RoleType {
    soldiers = 'soldiers',
}

export class Role extends Container {
    public pos: string;
    public roleLayer: CMapLayer;
    public cmapLayer: CMapLayer;
    public roleSprite: Sprite;
    public _roleHoverSprite: Sprite;
    public selected: boolean = false;

    constructor(type: RoleType, pos: string, roleLayer: CMapLayer, cmapLayer: CMapLayer) {
        super();
        this.pos = pos;
        this.roleLayer = roleLayer;
        this.cmapLayer = cmapLayer;
        this.roleSprite = Sprite.from(type);
        this.roleSprite.anchor.set(0.5);
        this.roleSprite.scale.set(0.2);
        this.addChild(this.roleSprite);

        this._roleHoverSprite = Sprite.from('editor_mh');
        this._roleHoverSprite.interactive = true;
        this._roleHoverSprite.eventMode = 'static';
        this._roleHoverSprite.anchor.set(0.5);
        this._roleHoverSprite.scale.set(0.125);
        this._roleHoverSprite.alpha = 0;
        this._roleHoverSprite.onclick = this.clickHandler.bind(this);
        this.addChild(this._roleHoverSprite);
    }
    move(targetPosStr: string) {
        if (this.cmapLayer && this.cmapLayer.getChildByLabel(targetPosStr)) {
            this.pos = targetPosStr;
            const targetPos = this.cmapLayer.getChildByLabel(targetPosStr)!.position;
            gsap.killTweensOf(this);
            gsap.to(this, {
                x: targetPos.x,
                y: targetPos.y,
                duration: 0.8,
                ease: 'ease.in',
            });
        }
    }

    public clickHandler() {
        this.selected = !this.selected;

        this.roleLayer.setChildIndex(this, this.roleLayer.children.length - 1);
        gsap.killTweensOf(this._roleHoverSprite);
        gsap.to(this._roleHoverSprite, {
            alpha: this.selected ? 1 : 0,
            duration: 0.4,
            ease: 'back.out',
        });

        console.log('点击了' + this.pos);
        const pos = this.pos.split(':');
        const set = findReachableTiles(+pos[0], +pos[1], 3, MAP_POINT[0].length, MAP_POINT.length);
        const reachableTiles = Array.from(set);
        reachableTiles.forEach((tilePos: string) => {
            const cmap = this.cmapLayer.getChildByLabel(tilePos) as CMap;
            if (cmap) {
                cmap.setSelected(this.selected);
                if (this.selected) {
                    this.cmapLayer.selectedMapTiles.push(tilePos);
                } else {
                    const needDeleteMapTilePosIndex = this.cmapLayer.selectedMapTiles.indexOf(tilePos);
                    if (needDeleteMapTilePosIndex >= 0) {
                        this.cmapLayer.selectedMapTiles.splice(needDeleteMapTilePosIndex, 1);
                    }
                }
            }
        });
    }
}
