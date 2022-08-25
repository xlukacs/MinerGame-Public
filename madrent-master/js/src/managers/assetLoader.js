export class ResourceLoader {
    constructor() {
        this.assets = new Map();
        this.loadedSounds = new Map();
        this.images = [
            { name: 'background', src: './assets/img/bg.png' },
            { name: 'mapBg', src: './assets/img/mapBg.png' },
            { name: 'player', src: './assets/img/character.png' },
            { name: 'cart', src: './assets/img/cart.png' },
            { name: 'map', src: './assets/img/map.png' },
            { name: 'gold', src: './assets/img/gold.png' },
            { name: 'diamond', src: './assets/img/diamond.png' },
            { name: 'menuCharacter', src: './assets/img/splashCharacter.png' },
            { name: 'settingsBtn', src: './assets/img/settingsButton.png' },
            { name: 'buttonPair', src: './assets/img/buttonPair.png' },
            { name: 'spaceButton', src: './assets/img/spaceButton.png' },
            { name: 'enterButton', src: './assets/img/enterButton.png' },
            { name: 'backButton', src: './assets/img/backButton.png' },
            { name: 'sound1Button', src: './assets/img/sound1Button.png' },
            { name: 'noSound1Button', src: './assets/img/noSound1Button.png' },
            { name: 'sound2Button', src: './assets/img/sound2Button.png' },
            { name: 'questionButton', src: './assets/img/questionButton.png' },
            { name: 'anchor', src: './assets/img/anchor.png' },
            { name: 'chSprite', src: './assets/img/characterSprite.png' },
            { name: 'reloadButton', src: './assets/img/reloadButton.png' },
        ]
        this.sounds = [
            { name: "mainTheme", src: './assets/snd/mainTheme1.mp3' },
            { name: "goldImpact", src: './assets/snd/gold.mp3' },
            { name: "metalImpact", src: './assets/snd/metal.mp3' },
            { name: "gameOver", src: './assets/snd/gameOver.mp3' },
            { name: "diamondImpact", src: './assets/snd/diamond.mp3' },
        ]
    }

    async init() {
        await this.loadImages();
        await this.loadSounds();
    }

    //images
    async loadImages() {
        await Promise.all(
            this.images.map(image => this.loadImage(image))
        )
    }

    async loadImage(asset) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = asset.src;
            img.onload = () => {
                this.assets.set(asset.name, img);
                resolve(img);
            }
        })
    }

    getImage(imageName) {
        return this.assets.get(imageName);
    }

    //sounds
    async loadSounds() {
        await Promise.all(
            this.sounds.map(sound => this.loadSound(sound))
        )
    }

    async loadSound(soundResource) {
        return new Promise((resolve, reject) => {
            const sound = new Audio(soundResource.src);
            sound.oncanplaythrough = () => {
                this.loadedSounds.set(soundResource.name, sound);
                resolve(sound);
            }
            sound.onerror = (err) => {
                reject(err);
            }
        });
    }

    getSound(soundName) {
        return this.loadedSounds.get(soundName);
    }
}
export const loader = new ResourceLoader();