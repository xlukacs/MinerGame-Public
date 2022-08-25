import { game, states } from '../main.js'
import * as objects from '../objects.js'
import { misc } from '../helpers/misc.js'
import { loader } from './assetLoader.js'

export class DifficultyManager {
    constructor(file) {
        this.file = file;
        var parsedData;
    }
    async init() {
        this.parsedData = this.loadData(this.file);
    }

    loadData(file) {
        var response;
        var data;
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.status == 200 && xhttp.readyState == 4) {
                response = this.responseText;
            }
        }
        xhttp.open("GET", file, false);
        xhttp.send();

        data = JSON.parse(response);

        return data;
    }

    setupDay(dayNumber) {
        //set day text
        game.stateManager.states.gameState.objects[13].setText("DAY: " + states.currentDay);

        //set target text
        game.stateManager.states.gameState.objects[8].setText(this.parsedData.days[dayNumber - 1].data[0].requiredMoney + " $");

        //push objects to gameState
        //push GOLD ores
        this.parsedData.days[dayNumber - 1].data[1].gold.forEach(gold => {
            game.stateManager.states.gameState.objects.push(new objects.Gold(gold.xPos, gold.yPos, 70, 70, loader.getImage("gold"), gold.size, gold.id));
        });
        //push DIAMOND ores
        this.parsedData.days[dayNumber - 1].data[1].diamond.forEach(diamond => {
            game.stateManager.states.gameState.objects.push(new objects.Diamond(diamond.xPos, diamond.yPos, 70, 70, loader.getImage("diamond"), diamond.size, diamond.id));
        });
    }

    getRequiredMoney() {
        if (this.getMaxDays() <= states.currentDay)
            return this.parsedData.days[this.getMaxDays() - 1].data[0].requiredMoney;
        return this.parsedData.days[states.currentDay - 1].data[0].requiredMoney;
    }

    getOreCount() {
        let count = 0;
        this.parsedData.days[states.currentDay - 1].data[1].gold.forEach(gold => {
            count++;
        });
        this.parsedData.days[states.currentDay - 1].data[1].diamond.forEach(gold => {
            count++;
        });
        return count;
    }

    getMaxDays() {
        return this.parsedData.days.length;
    }
}