//import Mastermind from "./mastermind";

var gameOptions = {
    mazeWidth: 53,
    mazeHeight: 31,
    tileSize: 32
}
var text;
var timer = {
    min: '1',
    sec: '00'
}
var timeRound = timer;
var timeGame = timer;
let live = 3;

export default class MazeCreate extends Phaser.Scene {
    constructor() {
        super('mazeCreate');
        this.recorrido = []; // Arreglo para almacenar el recorrido
        this.posicionAnterior = { x: -1, y: -1 };
    }

    layer;
    skin;
    

    preload() {
        // Carga de recursos del laberinto
        this.load.image('background', './assets/floor-lobby.jpg')
        this.load.image('tiles',  './assets/drawtiles1_n.png');
        this.load.path = './assets/';
        this.load.spritesheet('skin', 'skin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('mask', './assets/mask1.png'); //PRUEBA MASK

        
    }

    create() {    
        this.background = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'background').setOrigin(0, 0).setScale();
        this.fetchMaze();
        this.createPlayer()

        this.events.once('mazeCreated', () => {
            // Establecer los límites de la cámara según las dimensiones del laberinto
            this.cameras.main.setBounds(0, 0, this.layer.widthInPixels, this.layer.heightInPixels);
            console.log(this.layer.widthInPixels)
            // Hacer que la cámara siga al jugador
            this.cameras.main.startFollow(this.skin);
        });

        text = this.add.text(850, 40, '2:00', {
            fontSize: '50px',
            fill: '#ffffff'
        }).setDepth(0.1).setScrollFactor(0);;

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.countDown();
            }
        });
    
    }

    fetchMaze() {
        fetch('http://localhost:3000/generar-laberinto')
            .then(response => response.json())
            .then(data => {
                const maze = data.maze;
                console.log(maze)
                if (this.layer) {
                    this.layer.destroy(); // Elimina el laberinto anterior
                }
                this.createTilemapFromMaze(maze);
            })
            .catch(error => console.error('Error al obtener el laberinto:', error));
    }
    
    createTilemapFromMaze(maze) {
    
        const tilemap = this.make.tilemap({ data: maze, tileWidth: gameOptions.tileSize, tileHeight: gameOptions.tileSize });
        const tileset = tilemap.addTilesetImage('tiles');
        this.layer = tilemap.createLayer(0, tileset, 0, 0).setScale(2);

        //this.tilemap.setCollisionBetween(1, 1);
        this.events.emit('mazeCreated');
        
    }
    
    createPlayer() {
        this.skin = this.physics.add.sprite(100, 100, 'skin'); 
        this.physics.add.collider(this.skin, this.layer);
        this.skin.anims.create({
            key: 'skin_down',
            frames: this.anims.generateFrameNumbers('skin', { start: 0, end: 3 }),
            frameRate: 5,
        });
        this.skin.anims.create({
            key: 'skin_left',
            frames: this.anims.generateFrameNumbers('skin', { start: 4, end: 7 }),
            frameRate: 5,
        });
        this.skin.anims.create({
            key: 'skin_right',
            frames: this.anims.generateFrameNumbers('skin', { start: 8, end: 11 }),
            frameRate: 5,
        });
        this.skin.anims.create({
            key: 'skin_up',
            frames: this.anims.generateFrameNumbers('skin', { start: 12, end: 15 }),
            frameRate: 5,
        });
        this.skin.anims.play('skin_down', true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        
    }

    updateText() {
        text.setText(timer.min + ':' + timer.sec);
    }

    countDown() {
        if (timer.sec > 0 || timer.min > 0) {
            timer.sec--;
            if (timer.sec < 0) {
                timer.sec = 59;
                timer.min--;
            }
            timer.sec = (timer.sec >= 10) ? timer.sec : '0' + timer.sec;
            timer.min = (timer.min >= 10) ? timer.min : '' + timer.min;
            this.updateText();
        } else {
            console.log('¡Tiempo terminado!');
            this.fetchMaze();
            //this.skin.destroy();
            //this.skin = this.physics.add.sprite(100, 100, 'skin'); 
            timer.sec = '10';
            if (live > 0) {
                live --;
            } else {
                this.gameOver();
            }
            //this.gameOver();
        }
    }

    registrarPosicion() {
        // Obtener la posición actual del personaje
        const posicionActual = { x: this.skin.x, y: this.skin.y };
    
        // Verificar si la posición actual es diferente a la anterior
        if (posicionActual.x !== this.posicionAnterior.x || posicionActual.y !== this.posicionAnterior.y) {
            this.recorrido.push(posicionActual); // Agregar la nueva posición al recorrido
            this.posicionAnterior = posicionActual; // Actualizar la posición anterior
        }
        console.log(this.recorrido)
    }

    //Punto de partida
    update() {
        const velocidad = 8;
        
        if (this.cursors.up.isDown || this.wKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x, this.skin.y - 24, true);
            if(tile.index === 1){
                //Blocked, we can't move
            }else if(tile.index === 2){
                this.scene.start("mastermind");
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_up', true);
                this.skin.y -= velocidad;
                this.registrarPosicion();
            }
            
        } else if (this.cursors.down.isDown || this.sKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x, this.skin.y + 16, true);
            if(tile.index === 1){
                //Blocked, we can't move
            }else if(tile.index === 2){
                this.scene.start("mastermind");
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_down', true);
                this.skin.y += velocidad;
                this.registrarPosicion();
            }
        } else if (this.cursors.left.isDown || this.aKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x - 24, this.skin.y, true);

            if (tile.index === 1){
                //  Blocked, we can't move
            }else if(tile.index === 2){
                this.scene.start("mastermind");
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_left', true);
                this.skin.x -= velocidad;
                this.registrarPosicion();
            }
        } else if (this.cursors.right.isDown || this.dKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x + 16, this.skin.y, true);

            if (tile.index === 1){
                //  Blocked, we can't move
            }else if(tile.index === 2){
                this.scene.start("mastermind");
            }else{
                this.skin.anims.play('skin_right', true);
                this.skin.x += velocidad;
                this.registrarPosicion();
            }
        }    
    }

    gamePause() {
        this.scene.pause();
    }

    gameOver() {
        if (live == 0) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'Fin de la partida.', {
                fontSize: '50px',
                fill: 'red'
            }).setOrigin(0.5);
            timeRound = timer;
            this.scene.pause();
            setTimeout(() => {
                this.scene.stop();
                this.scene.start('menu');
            }, 2000)
        } else {
            this.skin.live --;
            this.scene.pause();
            this.scene.start('game');
        }
        
    }

    gameFinish() {
        text = this.add.text(850, 700, 'Winner', {
            fontSize: '500px',
            fill: '#ffffff'
        }).setDepth(0.1).setOrigin(0.5);
        this.scene.pause();
        setTimeout(() => {
            this.scene.stop('mazeCreate');
            this.scene.stop('game');
            this.scene.start('menu');
        }, 5000)
    }

    
}


