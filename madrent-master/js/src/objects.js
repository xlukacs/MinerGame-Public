import { loader } from './managers/assetLoader.js'
import { sounds } from './managers/soundManager.js'
import { misc } from './helpers/misc.js'
import { states, game } from './main.js'

export class Object {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = "obj";
        this.id = Math.random();
    }
    handleEvent(ev, game) {
        if (this.isClicked(ev))
            this.onclick(game);
    }

    onclick(game) {};

    isClicked(ev) {
        const mX = ev.offsetX;
        const mY = ev.offsetY;

        if (mX >= this.x && mX <= this.x + this.width && mY >= this.y && mY <= this.y + this.height) {
            return true;
        }
        return false;
    }

    getName() {
        return this.name;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getY() {
        return this.y;
    }

    getCollision(x, y) {}
}

export class BackgroundWithOpacity extends Object {
    constructor(x, y, width, height, color, opacity) {
        super(x, y, width, height);
        this.color = color;
        this.opacity = opacity;
    }
    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

export class Sprite extends Object {
    constructor(x, y, width, height, image, partial = "no") {
        super(x, y, width, height);
        this.image = image;
        this.partial = partial;
    }

    setPos(x) {
        this.x += x * 3;
    }

    render(ctx) {
        if (this.partial == "no")
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else if (this.partial == "yes") {
            var imageAspectRatio = this.image.width / this.image.height;
            var canvasAspectRatio = this.width / this.height; //we need some other way here
            var renderableWidth;

            //clip image
            renderableWidth = this.image.width * (this.height / this.image.height);

            ctx.drawImage(this.image, this.x, this.y, renderableWidth, this.height);
        }
    }
}

export class Anchor extends Sprite {
    constructor(x, y, width, height, image, rotation) {
        super(x, y, width, height, image)
        this.rotation = rotation;
        this.phase = 0;
    }
    getPhase() {
        return this.phase;
    }
    setPhase(phase) {
        this.phase = phase;
    }
    setAngle(angle) {
        this.rotation = angle;
    }
    getAngle() {
        return this.rotation;
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(game.anchorLine.getX(), game.anchorLine.getY());
        ctx.translate(this.x + this.width / 2, this.y + 10);
        ctx.lineWidth = 2;
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.lineTo(-this.width / 2 + 9, +10);
        ctx.stroke();
        ctx.drawImage(this.image, -this.width / 2, -10, this.width, this.height);
        ctx.restore();
    }
}

export class Text extends Object {
    constructor(x, y, text, color = "#000000", font = "15px Balthazar") {
        super(x, y);
        this.text = text;
        this.color = color;
        this.font = font;
    }
    render(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    setText(text) {
        this.text = text;
    }
}

export class Player extends Object {
    constructor(x, y, width, height, image) {
        super(x, y, width, height, image);
        this.image = image;
        this.money = 0;
        this.stage = 0;
        this.speed = 3;
        this.frame = 0;
    }

    render(ctx) {
        ctx.drawImage(this.image, this.frame * 67, 0, 67, 122, this.x, this.y, this.width, this.height);
    }

    move(distance) {
        this.x += distance * this.speed;
    }

    getX() {
        return this.x;
    }

    setImageState(frame) {
        this.frame = frame;
    }

    getWidth() {
        return this.width;
    }

    getMoney() {
        return this.money;
    }

    setMoney(money) {
        this.money = money;
    }
}

export class Cart extends Player {
    constructor(x, y, width, height, image) {
        super(x, y, width, height, image);
    }
    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(distance) {
        this.x += distance * this.speed;
    }

    getX() {
        return this.x;
    }
}

export class Gold extends Object {
    constructor(x, y, width, height, image, size, id) {
        super(x, y, width, height);
        this.image = image;
        this.size = size;
        this.sizeConst = 0.8;
        this.name = "gold";
        this.width = this.width * this.sizeConst * this.size;
        this.height = this.height * this.sizeConst * this.size;
        this.id = id;
        this.value = 100;
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width * this.sizeConst, this.height * this.sizeConst);
    }
    getCollision(x, y) {
        if (x > this.x && x < (this.x + this.width * this.sizeConst) && y > this.y && y < (this.y + this.height * this.sizeConst))
            return this.id;
        else
            return 0;
    }
    getValue() {
        return this.size * this.value;
    }
    getWidth() {
        return this.width;
    }
    destroy() {
        this.width = 0;
        this.height = 0;
        this.x = -1;
        this.y = -1;
    }

}

export class Diamond extends Gold {
    constructor(x, y, width, height, image, size, id) {
        super(x, y, width, height, image, size, id);
        this.sizeConst = 0.5;
        this.value = 200;
        this.name = "diamond";
    }
}

export class Button extends Object {
    constructor(x, y, width, height, primaryColor, secondaryColor, text, functionToRun, textColor = "#FFFFFF") {
        super(x, y, width, height);
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.text = text;
        this.functionToRun = functionToRun;
        this.shadowBlur = 3;
        this.textColor = textColor;
    }

    render(ctx) {
        ctx.save();
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowColor = this.secondaryColor;
        ctx.fillStyle = this.secondaryColor;

        //shadow
        ctx.fillRect(this.x - this.shadowBlur, this.y - this.shadowBlur, this.width + this.shadowBlur * 2, this.height + this.shadowBlur * 2);

        //main bg
        ctx.fillStyle = this.primaryColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        //text on the button
        ctx.font = "bold 30px Balthazar";
        ctx.fillStyle = this.textColor;
        ctx.shadowBlur = 0;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

        ctx.restore();
    }

    onclick(game) {
        switch (this.functionToRun) {
            case "newGame":
                game.stateManager.currentState = game.stateManager.states.gameState;
                misc.startTimer(game.secondsTillGameOver);
                break;
            case "playAgain":
                console.log("PLAYAGAIN");
                game.start();
                break;
            case "GOLD":
                game.player.setMoney(game.player.getMoney() + 100);
                game.playerMoney.setText(game.player.getMoney() + "$");
                break;
            case "submitScore":
                //TODO
                game.stateManager.changeState("scoreState");
                game.stateManager.currentState.startProcess();
                break;
            case "enterShop":
                console.log("Stay tuned for more updates. This option is not implemented!");
                alert("This function is not available yet!");
                break;
        }
    }

    setText(txt) {
        this.text = txt;
    }
}

export class SettingsButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager) {
        super(x, y, width, height, image, partial, manager);
        this.manager = manager;
    }

    onclick() {
        this.manager.changeState('settingsState');
    }
}

export class QuestionButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager, canvas) {
        super(x, y, width, height, image, partial, manager, canvas);
        this.manager = manager;
        this.canvas = canvas;
        this.isSeen = false;
    }

    onclick() {
        if (this.isSeen == false) {
            this.manager.currentState.objects.push(new InstructionsButton(this.canvas.width - 80, 75, 60, 58, loader.getImage("questionButton"), "no", this.manager, this.canvas));
            this.manager.currentState.objects.push(new ReloadButton(this.canvas.width - 80, 140, 60, 58, loader.getImage("reloadButton"), "no", this.manager, this.canvas));
            this.isSeen = true;
        } else {
            this.manager.currentState.objects.pop();
            this.isSeen = false;
        }
    }
}

class ReloadButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager, canvas) {
        super(x, y, width, height, image, partial, manager, canvas);
        this.manager = manager;
        this.canvas = canvas;
    }
    onclick() {
        game.dayManager.loadDay(1);
        states.currentDay = 1;
        game.stateManager.states.gameState.objects[13].setText("DAY: 1");
    }
}

/*export class InGameSettingsButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager) {
        super(x, y, width, height, image, partial, manager);
        this.manager = manager;
    }
    onclick() {
        //TODO back to menu, enter settings etc...
    }
}*/

export class InstructionsButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager, canvas) {
        super(x, y, width, height, image, partial, manager);
        this.manager = manager;
        this.canvas = canvas;
    }
    onclick() {
        if (document.getElementsByClassName("instructions")[0].style.display == "none") {
            document.getElementsByClassName("instructions")[0].style.display = "block";
        } else {
            document.getElementsByClassName("instructions")[0].style.display = "none";
        }
    }
}

export class BackButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager, toState) {
        super(x, y, width, height, image, partial, manager);
        this.manager = manager;
        this.newState = toState;
    }

    onclick() {
        this.manager.changeState(this.newState);
        if (this.newState == "menuState")
            game.start();
    }
}

export class SoundButton extends Sprite {
    constructor(x, y, width, height, image, partial, manager, toState) {
        super(x, y, width, height, image, partial, manager);
        this.manager = manager;
        this.toState = toState;
    }

    onclick() {
        if (this.toState == "on")
            sounds.playAllTrack();
        else
            sounds.stopAllTrack();
    }
}

export class Line extends Object {
    constructor(x, y, endX, endY, width, color, rotation) {
        super(x, y, width);
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.rotation = rotation;
        this.speed = 3;
    }

    render(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.rotation * Math.PI / 180);

        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(0, 0);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.restore();
    }

    move(distance) {
        this.x += distance * this.speed;
    }

    setRotation(angle) {
        this.rotation = angle;
    }

    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }

    setEndX(x) {
        this.endX = x;
    }
    setEndY(y) {
        this.endY = y;
    }
    getEndX() {
        return this.endX;
    }
    getEndY() {
        return this.endY;
    }
}