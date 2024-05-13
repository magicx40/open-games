import { Container } from 'pixi.js';
import { LargeButton } from '../ui/LargeButton';
import { GameLogo } from '../ui/GameLogo';
import { GameScreen } from '../screens/GameScreen';
import { navigation } from '../utils/navigation';
import { EditorScreen } from './EditorScreen';

/** Screen shown while loading assets */
export class LoadScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['preload', 'common'];
    /** The PixiJS logo */
    private gameLogo: GameLogo;

    private playButton: LargeButton;
    private drawMapButton: LargeButton;

    constructor() {
        super();
        this.gameLogo = new GameLogo();
        this.addChild(this.gameLogo);

        this.playButton = new LargeButton({ default: 'single-button', hover: 'single-button', press: 'single-button' });
        this.playButton.onPress.connect(() => navigation.showScreen(GameScreen));
        this.addChild(this.playButton);

        this.drawMapButton = new LargeButton({ default: 'net-button', hover: 'net-button', press: 'net-button' });
        this.drawMapButton.onPress.connect(() => navigation.showScreen(EditorScreen));
        this.addChild(this.drawMapButton);
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.gameLogo.x = width * 0.5;
        this.gameLogo.y = height * 0.2;
        this.playButton.x = width * 0.5;
        this.playButton.y = height - 200;
        this.drawMapButton.x = width * 0.5;
        this.drawMapButton.y = height - 320;
    }

    /** Show screen with animations */
    public async show() {}

    /** Hide screen with animations */
    public async hide() {}
}
