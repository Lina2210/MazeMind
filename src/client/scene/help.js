export default class Help extends Phaser.Scene {
    constructor () {
        super ('help');
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('backgorund-menu', 'backgorund-menu.jpg');
    }

    create() {
        this.add.image(960, 540, 'backgorund-menu').setScale(1.4);
        
         // Botón para volver al menú
         const backButton = this.add.text(100, 980, 'Volver', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0, 1);

        // Configurar el evento del botón para volver al menú
        backButton.setInteractive().on('pointerdown', () => {
            this.scene.start('menu'); // Muestrar la escena del menú
        });
    }

    update() {
        
    }
}