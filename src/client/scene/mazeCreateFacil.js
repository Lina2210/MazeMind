var gameOptions = {
    mazeWidth: 29,
    mazeHeight: 17,
    tileSize: 32
}
var text;
var timer = {
    min: '0',
    sec: '45'
}
var timeGame = { ...timer };
let live = 3;
let score = 0; // Variable para la puntuación

export default class MazeCreateFacil extends Phaser.Scene {
    constructor() {
        super('mazeCreateFacil');
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

        this.load.image('life', './heart.png');
               
    }

    create() {   
        timer = { min: '0', sec: '45' };
        live = 3;
        score = 0; 
        this.fetchMaze();
        
        this.createPlayer();
        
        
        this.events.once('mazeCreatedFacil', () => {
            // Establecer los límites de la cámara según las dimensiones del laberinto
            
            this.cameras.main.setBounds(0, 0, 1856, 1088);//esto se modifica pra limitar la camara
            
            
            // Hacer que la cámara siga al jugador
            this.cameras.main.startFollow(this.skin, true, 0.1, 0.1);
        });


        text = this.add.text(850, 40, '0:45', {
            fontSize: '50px',
            fill: '#ffffff'
        }).setDepth(0.1).setScrollFactor(0);
        
          

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.countDown();
            }
        });

        // Inicializar las vidas del jugador
        this.lives = [];

        for (let i = 0; i < live; i++) {
            const life = this.add.image(50 + i * 100, 80, 'life');
            life.setScale(4);
            life.setScrollFactor(0);
            life.setDepth(1);
            this.lives.push(life);
        }
               
    }

    //obtener matriz del servidor para generar el laberinto
    fetchMaze() {
        fetch('http://localhost:3000/generar-laberinto')
            .then(response => response.json())
            .then(data => {
                const maze = data.maze;
                if (this.layer) {
                    this.layer.destroy(); // Elimina el laberinto anterior
                }
                this.createTilemapFromMaze(maze);
            })
            .catch(error => console.error('Error al obtener el laberinto:', error));
    }
    
    //generar el laberinto
    createTilemapFromMaze(maze) {
        const tilemap = this.make.tilemap({ data: maze, tileWidth: gameOptions.tileSize, tileHeight: gameOptions.tileSize });
        const tileset = tilemap.addTilesetImage('tiles');
        this.layer = tilemap.createLayer(0, tileset, 0, 0).setScale(2);
    
        if (this.layer) {
            this.layer.setCollisionByExclusion([-1]);
        } else {
            console.error("Error: no se pudo crear la capa");
        }
        this.events.emit('mazeCreatedFacil');
        
    }

    //crear jugador
    createPlayer() {
        this.skin = this.physics.add.sprite(100, 100, 'skin'); 
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
            if (timer.sec <= 5 && timer.min === 0 || timer.min === '0' && timer.sec <= '5') {
                this.showMazeChangeWarning();
            }
            if (timer.sec < 0) {
                timer.sec = 59;
                timer.min--;
            }
            
            this.updateText();

            // Mostrar advertencia 5 segundos antes de cambiar el laberinto
            
            
        } else {
            
            this.transitionMazeChange();
        }
    }

    showMazeChangeWarning() {
        const message = "¡Alerta! ¡El laberinto cambiará pronto!";
        const warningContainer = this.createMessageContainer(message, 'yellow', 'black');
        this.animateBlinking(warningContainer);
    }

    

    transitionMazeChange() {
        live--;

        if (live > 0) {
            this.lives[live].setVisible(false);
        }

        if (live === 0) {
            this.gameOver();
        } else {
            // Desvanecer el laberinto actual
            this.cameras.main.fadeOut(2000, 0, 0, 0, () => {
                this.fetchMaze();
                this.skin.setPosition(100, 100);
                timer.min = 0;
                timer.sec = '45';
                this.cameras.main.fadeIn(2000, 0, 0, 0);
            });
        }
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
    
    }

    gameOver() {
        this.container = this.createMessageContainer('Fin de la partida', 'red', 'white');
        this.scene.pause();

        setTimeout(() => {
            if (this.container) {
                this.container.remove();
            }
            this.scene.stop('mazeCreateFacil');
            this.scene.start('menu');
        }, 2000);
    }

    gameFinish() {
        let timeBonus = (timer.min * 60 + timer.sec) * 10; // Bonificación por tiempo restante
        score += timeBonus + (live * 100); // Sumar bonificación de tiempo y vidas
        this.container = this.createMessageContainer('Ganaste ' + score + ' puntos. Pero continua el desafio.', 'green', 'white');

        this.scene.pause();
        setTimeout(() => {
            if (this.container) {
                this.container.remove();
            }
            this.scene.stop('mazeCreateFacil');
            this.scene.start('mastermind');
        }, 5000);

        //guardar puntuacion en la base de datos

        const username = localStorage.getItem('username');
        const levelDificult = 'Facil';
        if (username) {
            fetch('http://localhost:3000/saveScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, score, levelDificult })
            })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.error('No se pudo guardar la puntuación: no hay un usuario registrado');
        }


        
    }
    createMessageContainer(message, backColor, color) {
        const messageContainer = document.createElement('div');
        messageContainer.textContent = message;
        

        messageContainer.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: ${backColor};
            color: ${color};
            padding: 10px;
            border: 2px solid #fff;
            border-radius: 5px;
            width: 300px;
            text-align: center;
            font-size: 24px;
            z-index: 1000; /* Asegurar que esté encima de otros elementos */
        `;
        
        document.body.appendChild(messageContainer);
        return messageContainer;
    }
    
    animateBlinking(container) {
        let isVisible = true;
        const blinkInterval = setInterval(() => {
            if (isVisible) {
                container.style.visibility = 'hidden';
                isVisible = false;
            } else {
                container.style.visibility = 'visible';
                isVisible = true;
            }
        }, 500);
    
        // Detener la animación después de 1 segundo
        setTimeout(() => {
            clearInterval(blinkInterval);
            document.body.removeChild(container); // Eliminar el mensaje del cuerpo del documento
        }, 1000);
    }
}


