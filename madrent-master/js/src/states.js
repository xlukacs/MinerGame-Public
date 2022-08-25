import { Text, Sprite, Player, Cart, Button, SettingsButton, BackgroundWithOpacity, BackButton, SoundButton, QuestionButton, Anchor, Gold, Line, Diamond } from './objects.js'
import { loader } from './managers/assetLoader.js'
import { sounds } from './managers/soundManager.js'
import { game, states } from './main.js'
import { ScoreBoard } from './helpers/misc.js'

class Base {
    constructor(manager, canvas) {
        this.manager = manager;
        var objects = [];
        this.canvas = canvas;
    }
    render(ctx) {
        this.objects.forEach(element => {
            element.render(ctx);
        });
    }
    handleEvent(ev, game) {
        this.objects.forEach((object) => {
            object.handleEvent(ev, game);
        });
    }
    addObject(obj) {
        this.objects.push(obj);
    }

    getCollision(x, y) {
        var save = 0,
            tmp;
        this.objects.forEach(obj => {
            tmp = obj.getCollision(x, y);
            if (tmp > save) {
                save = tmp;
            }
        });

        return save;
    }
}

export class MenuState extends Base {
    constructor(manager, canvas) {
        super(manager, canvas);
        const startGameButton = new Button(this.canvas.width / 2 - 350, 300, 200, 100, "#7F3300", "#FF6A00", "Start Game", "newGame");
        const shopButton = new Button(this.canvas.width / 2 - 350, 450, 200, 100, "#bf997f", "#d8c1b2", "SHOP", "enterShop");
        const settingsButton = new SettingsButton(this.canvas.width / 2 - 210, 600, 61, 58, loader.getImage("settingsBtn"), "no", manager);

        this.objects = [
            new Sprite(0, 0, this.canvas.width, this.canvas.height, loader.getImage("background")),
            new Sprite(this.canvas.width / 2, 50, 587, 659, loader.getImage("menuCharacter")),
            new Text(this.canvas.width / 2 - 115, 100, "Epic Miner Game", "#000000", "bold 35px Balthazar"),
            startGameButton,
            shopButton,
            settingsButton
        ];
        sounds.setTrack('mainTheme');
    }
}

export class GameState extends Base {
    constructor(manager, canvas) {
        super(manager, canvas);
        const player = new Player(20, 140, 90, 150, loader.getImage("chSprite"));
        const anchor = new Anchor(player.getX() + 36, 260, 18, 30, loader.getImage("anchor"), 0);
        this.objects = [
            new Sprite(0, 290, this.canvas.width, this.canvas.height, loader.getImage("mapBg")),
            new Text(this.canvas.width / 2 - 115, 50, "EPIC MINER GAME", "#000000", "bold 35px Balthazar"),
            new Sprite(0, 0, this.canvas.width, 300, loader.getImage("background")),

            player,
            new Cart(player.getX() + 9, 250, 73, 50, loader.getImage("cart")),
            anchor,
            new Line(player.getX() + 45, 270, 0, 9, 2, "#000000", anchor.getAngle()),

            new Text(50, 50, "TARGET: ", "#000000", "bold 30px Balthazar"),
            new Text(200, 50, "850$", "#000000", "bold 30px Balthazar"),
            new Text(50, 100, "MONEY: ", "#000000", "bold 30px Balthazar"),
            new Button(170, 60, 100, 50, "#333333", "#FFD800", "0 $", "misc", "#4CFF00"),

            new Button(this.canvas.width - 220, 18, 130, 54, "#7F3300", "#FF6A00", "1 : 00", "misc"),
            new QuestionButton(this.canvas.width - 80, 15, 61, 58, loader.getImage("settingsBtn"), "no", manager, this.canvas),

            new Text(this.canvas.width / 2, 50, "DAY: " + states.currentDay, "#000000", "bold 25px Calibri")
        ];
    }
}

export class SettingsState extends Base {
    constructor(manager, canvas) {
        super(manager, canvas);
        this.objects = [
            new Sprite(0, 0, this.canvas.width, this.canvas.height, loader.getImage("background")),
            new Text(this.canvas.width / 2 - 75, 50, "SETTINGS", "#FFD800", "bold 35px Balthazar"),
            new BackgroundWithOpacity(this.canvas.width / 2 - 300, this.canvas.height / 2 - 200, 600, 400, '#000000', 0.4),
            new Text(this.canvas.width / 2 - 250, 250, "Controls", "black", "bold 30px Balthazar"),

            new Text(this.canvas.width / 2 - 250, 320, "LEFT / RIGHT", "black", "bold 25px Balthazar"),
            new Sprite(this.canvas.width / 2 + 150, 280, 137, 59, loader.getImage("buttonPair")),

            new Text(this.canvas.width / 2 - 250, 390, "SHOOT ANCHOR", "black", "bold 25px Balthazar"),
            new Sprite(this.canvas.width / 2 + 150, 350, 137, 59, loader.getImage("spaceButton")),

            new Text(this.canvas.width / 2 - 250, 460, "USE ITEM", "black", "bold 25px Balthazar"),
            new Sprite(this.canvas.width / 2 + 150, 420, 137, 59, loader.getImage("enterButton")),

            new BackButton(this.canvas.width - 160, 60, 60, 58, loader.getImage("backButton"), "no", manager, 'menuState'),
            new SoundButton(this.canvas.width / 2 - 270, 520, 60, 58, loader.getImage("sound1Button"), "no", manager, "on"),
            new SoundButton(this.canvas.width / 2 - 200, 520, 60, 58, loader.getImage("noSound1Button"), "no", manager, "off"),
        ];
    }
}

export class ScoreState extends Base {
    constructor(manager, canvas) {
        super(manager, canvas);
        this.objects = [
            new Sprite(0, 0, this.canvas.width, this.canvas.height, loader.getImage("background")),
            new Text(this.canvas.width / 2 - 75, 50, "HIGHEST SCORES", "#000000", "bold 35px Balthazar"),
            new BackButton(this.canvas.width - 160, 60, 60, 58, loader.getImage("backButton"), "no", manager, 'menuState'),
            new BackgroundWithOpacity(this.canvas.width / 2 - 300, this.canvas.height / 2 - 200, 600, 400, '#000000', 0.4),
        ];
    }
    startProcess() {
        if (game.addScore == 0) {
            game.addScore++;
            states.continue = 1;
            var name = this.getName();
            this.addNameToBoard(name);
            this.clearBoard();
            this.renderBoard();
        }
    }

    getName() {
        return prompt("Please enter your name down below to submit score!");
    }

    addNameToBoard(name) {
        ScoreBoard.push({ "name": name, "score": game.player.getMoney() });
    }

    clearBoard() {
        this.objects.splice(4, this.objects.length - 4);
    }

    renderBoard() {
        var i = 1;
        ScoreBoard.sort((a, b) => b.score - a.score);
        ScoreBoard.forEach(node => {
            if (i < 7)
                this.objects.push(new Text(this.canvas.width / 2 - 250, this.canvas.height / 2 - 150 + i * 50, i + ": " + node.score + "$  by  " + node.name, "#000000", "normal 25px Balthazar"))
            i++;
        });
    }
}