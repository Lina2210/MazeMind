export default class Options extends Phaser.Scene {
    constructor() {
        super('options');
    }

    preload() {
        // Aquí puedes cargar los recursos necesarios para tu menú
        this.load.path = './assets/';
        this.load.image('backgorund-menu', 'backgorund-menu.jpg');
    }

    create() {
        this.add.image(960, 540, 'backgorund-menu').setScale(1.4);

        // Botón para pantalla completa
        const buttonFullScreen = this.add.text(960, 550, 'Pantalla Completa', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Configurar el evento del botón para pantalla completa
        buttonFullScreen.setInteractive().on('pointerdown', function() {
            this.scene.scale.startFullscreen();
        })

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