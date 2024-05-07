import { Container } from 'pixi.js';
import { LargeButton } from '../ui/LargeButton';
import { GameLogo } from '../ui/GameLogo';
import { GameScreen } from '../screens/GameScreen';
import { navigation } from '../utils/navigation';

/** Screen shown while loading assets */
export class LoadScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['preload', 'common'];
    /** The PixiJS logo */
    private gameLogo: GameLogo;

    private playButton: LargeButton;

    constructor() {
        super();
        this.gameLogo = new GameLogo();
        this.addChild(this.gameLogo);

        this.playButton = new LargeButton({ text: 'start game' });
        this.playButton.onPress.connect(() => navigation.showScreen(GameScreen));
        this.addChild(this.playButton);
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.gameLogo.x = width * 0.5;
        this.gameLogo.y = height * 0.2;
        this.playButton.x = width * 0.5;
        this.playButton.y = height - 150;
    }

    /** Show screen with animations */
    public async show() {
        
    }

    /** Hide screen with animations */
    public async hide() {
        
    }
}
