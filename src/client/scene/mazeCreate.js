var gameOptions = {
    mazeWidth: 29,
    mazeHeight: 17,
    tileSize: 32
}
var text;
var timer = {
    min: '0',
    sec: '25'
}
var timeGame = { ...timer };
let live = 2;
let score = 0; // Variable para la puntuación
let mazeChangeWarningText;
let warningTimerEvent;
let warningInterval;
export default class MazeCreate extends Phaser.Scene {
    constructor() {
        super('mazeCreate');
    }

    layer;
    skin;
    

    preload() {
        // Carga de recursos del laberinto
        
        this.load.image('tiles',  './assets/tileSet.png');
        this.load.path = './assets/';
        this.load.spritesheet('skin', 'skin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('mask', './mask1.png'); //PRUEBA MASK

        
    }

    create() {    
        this.fetchMaze();

        this.rt = this.add.renderTexture(0, 0, this.scale.width, this.scale.height);

//  Make sure it doesn't scroll with the camera
        this.rt.setOrigin(0, 0);
        this.rt.setScrollFactor(0, 0);

        this.createPlayer();
        
        
        this.events.once('mazeCreated', () => {
            // Establecer los límites de la cámara según las dimensiones del laberinto
            this.cameras.main.setBounds(0, 0, 1856, 1088);//esto se modifica pra limitar la camara
            
            
            // Hacer que la cámara siga al jugador
            this.cameras.main.startFollow(this.skin, true, 0.1, 0.1);
        });

        text = this.add.text(850, 40, '2:00', {
            fontSize: '50px',
            fill: '#ffffff'
        }).setDepth(0.1).setScrollFactor(0);
        
        // Añadir texto de advertencia de cambio
        mazeChangeWarningText = this.add.text(this.scale.width / 2, this.scale.height / 2, '"¡Alerta! ¡El laberinto cambiará pronto! ', {
            fontSize: '70px',
            fill: 'red'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1).setVisible(false);

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.countDown();
            }
        });

        
        // Añadir texto para mostrar la puntuación
        this.scoreText = this.add.text(this.scale.width - 20, 20, `Score: ${score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(1, 0).setScrollFactor(0);
        this.scoreText.setDepth(1);
        this.updateScoreText();

        
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

        this.events.emit('mazeCreated');
        
    }

    createPlayer() {
        this.skin = this.physics.add.sprite(100, 100, 'skin'); 
        console.log(this.skin)
        this.skin.setScale(1.5);
        this.skin.setDepth(1);
        if (this.skin.texture && this.skin.texture.key === 'skin') {
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
        } else {
            console.error('Error al cargar la textura del jugador.');
        }
    
        this.physics.add.collider(this.skin, this.layer);
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    updateText() {
        text.setText(timer.min + ':' + (timer.sec >= 10 ? timer.sec : '0' + timer.sec));
    }

    countDown() {
        if (timer.sec > 0 || timer.min > 0) {
            timer.sec--;
            if (timer.sec < 0) {
                timer.sec = 59;
                timer.min--;
            }
            this.updateText();

            // Mostrar advertencia 5 segundos antes de cambiar el laberinto
            if (timer.sec <= 5 && timer.min === 0) {
                this.showMazeChangeWarning();
            }
        } else {
            console.log('¡Tiempo terminado!');
            this.transitionMazeChange();
        }
    }

    

    showMazeChangeWarning() {
        mazeChangeWarningText.setVisible(true);
        this.tweens.add({
            targets: mazeChangeWarningText,
            alpha: 0,
            yoyo: true,
            repeat: 4,
            duration: 500,
            onComplete: () => {
                mazeChangeWarningText.setVisible(false);
            }
        });
    }

    transitionMazeChange() {
        // Desvanecer el laberinto actual
        this.cameras.main.fadeOut(2000, 0, 0, 0, () => {
            this.fetchMaze();
            this.skin.setPosition(100, 100);
            timer.min = 0;
            timer.sec = '15';
            this.cameras.main.fadeIn(2000, 0, 0, 0);
        });
        if (live > 0) {
            live --;
        } else {
            this.gameOver();
        }
    }

    updateScoreText() {
        this.scoreText.setText(`Score: ${score}`);
    }

    update() {


        const velocidad = 8;
        
        if (this.cursors.up.isDown || this.wKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x, this.skin.y - 24, true);
            if(tile.index === 1 || tile.index === 3){
                //Blocked, we can't move
            }else if(tile.index === 2){
                this.gameFinish();
                
                
            }else{
                this.skin.anims.play('skin_up', true);
                this.skin.y -= velocidad;
                //this.registrarPosicion();
            }
            
        } else if (this.cursors.down.isDown || this.sKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x, this.skin.y + 16, true);
            if(tile.index === 1 || tile.index === 3){
                //Blocked, we can't move
            }else if(tile.index === 2){
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_down', true);
                this.skin.y += velocidad;
                //this.registrarPosicion();
            }
        } else if (this.cursors.left.isDown || this.aKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x - 24, this.skin.y, true);

            if (tile.index === 1 || tile.index === 3){
                //  Blocked, we can't move
            }else if(tile.index === 2){
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_left', true);
                this.skin.x -= velocidad;
                //this.registrarPosicion();
            }
        } else if (this.cursors.right.isDown || this.dKey.isDown) {
            const tile = this.layer.getTileAtWorldXY(this.skin.x + 16, this.skin.y, true);

            if (tile.index === 1 || tile.index === 3){
                //  Blocked, we can't move
            }else if(tile.index === 2){
                this.gameFinish();
            }else{
                this.skin.anims.play('skin_right', true);
                this.skin.x += velocidad;
                //this.registrarPosicion();
            }
        }  
        
        const cam = this.cameras.main;
        
//  Clear the RenderTexture
        this.rt.clear();

        //  Fill it in black
       // this.rt.fill(0x000000, 0.9);
        this.rt.depth = 1;
        
        //  Erase the 'mask' texture from it based on the player position
        //  We - 107, because the mask image is 213px wide, so this puts it on the middle of the player
        //  We then minus the scrollX/Y values, because the RenderTexture is pinned to the screen and doesn't scroll
        this.rt.erase('mask', (this.skin.x - 107) - cam.scrollX, (this.skin.y - 107) - cam.scrollY);
        
    }

    gamePause() {
        this.scene.pause();
    }

    gameOver() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Fin de la partida.', {
            fontSize: '50px',
            fill: 'red'
        }).setOrigin(0.5);
        this.updateScoreText();
        this.scene.pause();

        setTimeout(() => {
            const gameScene = this.scene.get('game');
            if (gameScene) {
                gameScene.restartMazeScene();
            }
        }, 2000);
    }

    gameFinish() {
        let timeBonus = (timer.min * 60 + timer.sec) * 10; // Bonificación por tiempo restante
        score += timeBonus + (live * 100); // Sumar bonificación de tiempo y vidas
        text = this.add.text(this.scale.width / 2, this.scale.height / 2, `Winner\nScore: ${score}`, {
            fontSize: '50px',
            fill: '#ffffff'
        }).setDepth(0.1).setOrigin(0.5);
        this.updateScoreText();
        this.scene.pause();
        setTimeout(() => {
            this.scene.stop('mazeCreate');
            this.scene.start('mastermind');
        }, 5000);

        
    }

    
}


