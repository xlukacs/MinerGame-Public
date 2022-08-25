import { StateManager } from './managers/stateManager.js'
import { misc } from './helpers/misc.js'
import { DifficultyManager } from './managers/difficulty.js'
import { DayManager } from './managers/dayManager.js'

export const states = {
    gameover: 0,
    animationOnHold: 0,
    frameID: null,
    continue: 0,
    eventListeners: [],
    currentDay: 1
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.stateManager = new StateManager(this.canvas);
        this.difficultyManager = new DifficultyManager('./days.json');
        this.dayManager = new DayManager();

        const ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        this.time;
        this.dt;
        this.then;

        this.startTime = new Date().getTime();
        this.secondsTillGameOver = 60;
        this.globalGameOver = 0;

        this.day = 1;

        this.addScore;
    }

    async start() {
        await this.stateManager.init();
        await this.difficultyManager.init();
        this.initialise();
        if (states.frameID == null)
            this.gameLoop();
    }

    initialise() {
        //functions to run
        this.dayManager.loadDay(states.currentDay);

        //variables
        this.player = this.stateManager.states.gameState.objects[3];
        this.cart = this.stateManager.states.gameState.objects[4];
        this.anchor = this.stateManager.states.gameState.objects[5];
        this.anchorLine = this.stateManager.states.gameState.objects[6];
        this.objects = this.stateManager.states.gameState.objects;
        this.playerMoney = this.stateManager.states.gameState.objects[10];
        states.gameover = 0;
        states.animationOnHold = 0;
        this.addScore = 0;

        //event listeners
        if (states.eventListeners.length == 0) {
            states.eventListeners.push(window.addEventListener('keydown', (ev) => {
                this.move(ev);
            }, true));

            states.eventListeners.push(window.addEventListener('click', (ev) => {
                this.checkClick(ev, game);
            }, true));
        }
    }

    async checkClick(event, game) {
        this.stateManager.handleEvent(event, game);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(loop) {
        //handle movement and interactions
        this.updateTime();
        misc.animateAnchor();

        if (this.stateManager.currentState == this.stateManager.states.gameState)
            misc.checkForGameOver(loop);
    }

    render() {
        this.clear();
        this.stateManager.render(this.ctx);
    }

    updateTime() {
        this.time = Date.now();
        this.dt = (this.time - this.then);
        this.then = this.time;
    }

    gameLoop() {

        states.frameID = requestAnimationFrame(() => {
            this.update();
            this.render();
            this.gameLoop();
        })
    }


    move(ev) {
        if (states.animationOnHold == 0)
            switch (ev.keyCode) {
                case 37:
                    //move left
                    this.player.move(-1)
                    this.cart.move(-1)
                    this.anchor.setPos(-1);
                    this.anchorLine.move(-1);
                    break;
                case 39:
                    //move right
                    this.player.move(+1)
                    this.cart.move(+1)
                    this.anchor.setPos(+1);
                    this.anchorLine.move(+1);
                    break;
                case 32:
                    //fire anchor
                    if (states.animationOnHold == 0)
                        misc.fireAnchor()
                default:
                    break;
            }
    }
}

export const game = new Game('gameArea');
game.start();