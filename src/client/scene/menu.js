import { initRegisterForm } from './register.js';
export default class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    preload() {
        // Cargar los recursos necesarios para el menú
        this.load.path = './assets/';
        this.load.image('backgorund-menu', 'backgorund-menu.jpg');
    }

    create() {
        // IMAGEN FONDO
        this.add.image(960, 540, 'backgorund-menu').setScale(1.4);

        // TITULO
        const title = this.add.text(960, 180, 'MazeMind', {
            fontSize: '150px',
            fill: '#0D7205'
        }).setOrigin(0.5);

        // BOTONES
        // Boton para iniciar partida
        const buttonRegister = this.add.text(960, 420, 'Registrarse', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);
        const buttonStart = this.add.text(960, 480, 'Nueva Partida', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Boton para continuar partida
        const buttonContinue = this.add.text(960, 540, 'Continuar Partida', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Boton para cambiar personaje
        const buttonSkins = this.add.text(960, 600, 'Personajes', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Boton para como jugar
        const buttonHelp = this.add.text(960, 660, 'Cómo Jugar', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Boton para opiones
        const buttonOptions = this.add.text(960, 720, 'Opciones', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // CONFIGURAR BOTONES
        buttonRegister.setInteractive().on('pointerdown', () => {
            // Inicializar el formulario de registro
            initRegisterForm();

        });


        // Configuracion del evento del botón para iniciar la partida
        buttonStart.setInteractive().on('pointerdown', () => {
            this.scene.start('game'); // Mostrar la escena del juego
        });

        // Configuracion del evento del botón para continuar la partida
        buttonContinue.setInteractive().on('pointerdown', () => {
            this.scene.start('continueGame'); // Mostrar la escena de continuar juego
        });

        // Configuracion el evento del botón para entrar en personajes
        buttonSkins.setInteractive().on('pointerdown', () => {
            this.scene.start('skins'); // Mostrar la escena de personajes
            

        });

        // Configuracion del evento del botón para como jugar
        buttonHelp.setInteractive().on('pointerdown', () => {
            this.scene.start('help'); // Mostrar la escena de como jugar
        });

        // Configuracion el evento del botón para entrar en opciones
        buttonOptions.setInteractive().on('pointerdown', () => {
            this.scene.start('options'); // Mostrar la escena de opciones
        });

    }
    update() {

    }
}