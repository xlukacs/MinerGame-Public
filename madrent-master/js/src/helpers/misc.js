import { game, states } from '../main.js'
import * as objects from '../objects.js'
import { sounds } from '../managers/soundManager.js'

export const ScoreBoard = [];

class Misc {
    detectCollision(x, y) {
        return game.stateManager.getCollision(x, y);
    }

    async startTimer(seconds) {
        var clock = game.objects[11];
        this.timer = window.setInterval(function() {
            if (states.gameover == 0) {
                if (seconds == 60) {
                    clock.setText("1 : 00");
                } else {
                    clock.setText("0 : " + seconds);
                }

                if (seconds > 0)
                    seconds--;
                else {
                    clearInterval(this.timer);
                    states.gameover = 1;
                }
            }
        }, 1000)
    }

    checkForGameOver(loop) {
        if (game.player.getX() < 0 || game.player.getX() > (game.canvas.width - game.player.getWidth()) || states.gameover == 1) {
            game.stateManager.currentState.objects.push(new objects.Button(game.canvas.width / 2 - 250, 300, 200, 100, "#7F3300", "#FF6A00", "Play again", "playAgain"));
            game.stateManager.currentState.objects.push(new objects.Button(game.canvas.width / 2 + 50, 300, 200, 100, "#7F3300", "#FF6A00", "Submit Score", "submitScore"));

            if (states.gameover == 0)
                sounds.setTrack('gameOver');

            states.animationOnHold = 1;
            states.gameover = 1;
            cancelAnimationFrame(states.frameID);
        }
    }

    animateAnchor() {
        var state = states.animationOnHold;
        const angleSpeed = 0.7;
        let currentAngle = game.anchor.getAngle();
        let phase = game.anchor.getPhase();
        var skip = 0;

        //moving the anchor to the left
        if (phase == 0 && state == 0) {
            currentAngle -= angleSpeed;
            game.anchor.setAngle(currentAngle);
            game.anchorLine.setRotation(currentAngle);
            if (currentAngle <= -45)
                game.anchor.setPhase(1);
            skip = 1;
        }

        if (skip == 0 && phase == 1 && state == 0) {
            currentAngle += angleSpeed;
            game.anchor.setAngle(currentAngle);
            game.anchorLine.setRotation(currentAngle);
            if (currentAngle >= 45)
                game.anchor.setPhase(0);
        }
    }

    fireAnchor() {
        states.animationOnHold = 1;
        var characterFrame = 0;
        var stepCount = 32;
        var beforeAnimX = game.anchor.getX();
        var beforeAnimLineX = game.anchorLine.getEndX();
        var beforeAnimY = game.anchor.getY();
        var beforeAnimLineY = game.anchorLine.getEndY();

        var moveEntity = 0;

        const anchorFireing = window.setInterval(() => {
            if (stepCount % 2 == 0) {
                game.player.setImageState(characterFrame % 3);
                characterFrame++;
            }
            stepCount--;
            var distance = 2.5 * game.dt;

            var anchorX = game.anchor.getX();
            var anchorY = game.anchor.getY();
            var anchorEndY = game.anchorLine.getEndY();

            var angle = game.anchor.getAngle();
            angle = angle * Math.PI / 180 * -1;

            var velocityX = distance * Math.sin(angle);
            var velocityY = distance * Math.cos(angle);
            var velocityLineY = distance * Math.cos(angle);

            if (stepCount >= 16) {
                anchorX += velocityX;
                anchorY += velocityY;
                anchorEndY += velocityLineY;
            } else {
                anchorX -= velocityX;
                anchorY -= velocityY;
                anchorEndY -= velocityLineY;
            }


            game.anchor.setX(anchorX);
            game.anchor.setY(anchorY);

            game.anchorLine.setEndY(anchorEndY);

            var object = misc.detectCollision(anchorX, anchorY);
            if (object != 0) {
                stepCount = 32 - stepCount;
                game.player.setMoney(game.player.getMoney() + game.stateManager.states.gameState.objects[object].getValue());
                game.playerMoney.setText(game.player.getMoney() + "$");

                //atach ore and bring it to surface
                moveEntity = object;
            }

            if (moveEntity > 0) {
                game.stateManager.states.gameState.objects[moveEntity].setX(anchorX);
                game.stateManager.states.gameState.objects[moveEntity].setY(anchorY);
            }

            if (stepCount <= 0)
                window.clearInterval(anchorFireing);
        }, 100);

        window.setTimeout(() => {
            game.anchor.setX(beforeAnimX);
            game.anchor.setY(beforeAnimY);
            game.anchorLine.setEndX(beforeAnimLineX);
            game.anchorLine.setEndY(beforeAnimLineY);
            states.animationOnHold = 0;
            game.player.setImageState(0);
            if (moveEntity != 0) {
                game.stateManager.states.gameState.objects[moveEntity].destroy();

                this.playFeedback(game.stateManager.states.gameState.objects[moveEntity].getValue(), game.stateManager.states.gameState.objects[moveEntity].getName());
            }
            moveEntity = 0;
        }, stepCount * 101);
    }

    playFeedback(oreValue, type) {
        if (type == "gold")
            sounds.setTrack("goldImpact");
        if (type == "diamond")
            sounds.setTrack("diamondImpact");

        game.stateManager.states.gameState.objects.push(new objects.Text(game.canvas.width / 2 - 50, 200, "+ " + oreValue + "$", "#00FF21", "bold 50px Balthazar"));
        window.setTimeout(() => {
            game.stateManager.states.gameState.objects.pop();
            this.checkIfEnoughMoney();
        }, 2000);
    }

    clearListeners() {
        window.removeEventListener('keydown', () => {}, true);
        window.removeEventListener('click', () => {}, true);
    }

    checkIfEnoughMoney() {
        if (game.player.getMoney() >= game.difficultyManager.getRequiredMoney()) {
            states.currentDay++;
            game.dayManager.loadDay(states.currentDay);
        }
    }

    resetTimer() {
        clearInterval(this.timer);
        this.startTimer(game.secondsTillGameOver);
    }
}

export const misc = new Misc();