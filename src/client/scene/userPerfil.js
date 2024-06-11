export default class UserPerfil extends Phaser.Scene {
    constructor() {
        super('userPerfil');
    }

    preload() {
        // Carga de assets, como imágenes y sonidos, aquí
    }

    create() {
        // Configuración inicial de la escena, como la disposición de elementos y la interacción con el usuario
        
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
        // Lógica de actualización de la escena, como la detección de colisiones o el movimiento de personajes
    }
}
