import { MenuState, GameState, SettingsState, ScoreState } from '../states.js'
import { loader } from './assetLoader.js'
import { SoundManager } from './soundManager.js'
import * as Misc from '../helpers/functions.js'

export class StateManager {
    constructor(canvas) {
        this.canvas = canvas;
        var states = [];
        var currentState;
        this.soundManager = new SoundManager();
    }

    async init() {
        await loader.init().then(console.log("Assets loaded"));
        this.states = {
            menuState: new MenuState(this, this.canvas),
            gameState: new GameState(this, this.canvas),
            settingsState: new SettingsState(this, this.canvas),
            scoreState: new ScoreState(this, this.canvas),
        }
        this.currentState = this.states.menuState;
        Misc.setCookie("sound", "yes", 7);
    }

    changeState(toState) {
        const newState = this.states[toState];
        this.currentState = newState;
    }

    render(ctx) {
        this.currentState.render(ctx);
    }

    handleEvent(ev, game) {
        this.currentState.handleEvent(ev, game);
    }

    getCollision(x, y) {
        return this.currentState.getCollision(x, y);
    }
}