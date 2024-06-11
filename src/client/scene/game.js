import MazeCreate from './mazeCreate.js';
export default class Game extends Phaser.Scene {
    constructor () {
        super ('game');
        this.walls = null;
        this.skin = null;
        this.currentMazeKey = null;  
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('floor-loby', 'floor-lobby.jpg');
    }

    create() {
        //this.add.image(500, 500, 'floor-loby').setScale(5);
        
        
        this.startNewMazeScene();
    
      
        
    }

    update() {
        
    }
    generateUniqueKey(baseKey) {
        return `${baseKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    startNewMazeScene() {
        // Generar una nueva clave única y arrancar la nueva escena
        const uniqueSceneKey = this.generateUniqueKey('mazeCreate');
        this.currentMazeKey = uniqueSceneKey;
        this.scene.add(uniqueSceneKey, MazeCreate, true);
    }

    restartMazeScene() {
        if (this.currentMazeKey) {
            // Detener la escena actual
            this.scene.stop(this.currentMazeKey);
            this.scene.remove(this.currentMazeKey);
            // Iniciar una nueva escena
            this.startNewMazeScene();
        }
    }
}