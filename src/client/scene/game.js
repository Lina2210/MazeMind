import MazeCreate from './mazeCreate.js';
export default class Game extends Phaser.Scene {
    constructor () {
        super ('game');
        this.walls = null;
        this.skin = null;
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('floor-loby', 'floor-lobby.jpg');
    }

    create() {
        //this.add.image(500, 500, 'floor-loby').setScale(5);
        
        this.scene.add('mazeCreate', MazeCreate, true);
      
        
    }

    update() {
        
    }
}