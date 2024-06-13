export default class MenuNiveles extends Phaser.Scene {
    constructor() {
        super('menuNiveles');
    }

    preload() {
        // Cargar los recursos necesarios para el menú
        this.load.path = './assets/';
        this.load.image('backgorund-menu', 'fondoMenu.png');
        this.load.image('title-image', 'titulo.png');
    }

    create() {
        // IMAGEN FONDO
        //this.add.image(960, 540, 'backgorund-menu').setScale(1);

        // TITULO
        this.add.text(960, 200, 'NIVELES DE JUEGO', {
            fontSize: '36px',
            fill: '#fff'
        }).setOrigin(0.5);

        // BOTONES
        // Boton para iniciar partida
        
       // Definir el estilo común para los botones
        const buttonStyle = {
            fontSize: '45px',
            fill: '#ffffff',
            fontWeight: 'extra-bold',
            
            //fontFamily: 'Arial'
        };
      

        const buttonFacil = this.add.text(960, 590, 'FACIL', buttonStyle).setOrigin(0.5);
        const buttonDesafio = this.add.text(960, 670, 'DESAFIO', buttonStyle).setOrigin(0.5);
        const buttonExperto = this.add.text(960, 750, 'EXPERTO', buttonStyle).setOrigin(0.5);

        // Función para animar el botón al agrandarlo y cambiar su color
        const enlargeButton = (button) => {
            button.setScale(1.1); // Escalar el botón al 110%
            button.setFill('#07F60A'); // Cambiar el color del texto a dorado
        }

        // Función para animar el botón al reducirlo y restaurar su color original
        const shrinkButton = (button) => {
            button.setScale(1); // Restaurar la escala original
            button.setFill('#fff'); // Restaurar el color original del texto
        }
       
        const buttons = [buttonFacil, buttonDesafio, buttonExperto];

        buttons.forEach(button => {
            button.setInteractive();

            // Animar el botón al agrandarlo y cambiar su color cuando el cursor se coloca sobre él
            button.on('pointerover', () => {
                enlargeButton(button);
                                
            });

            // Animar el botón al reducirlo y restaurar su color original cuando el cursor sale del botón
            button.on('pointerout', () => {
                shrinkButton(button);
            });


        });

        // Configurar eventos de clic para cada botón
    
        buttonFacil.on('pointerdown', () => {
            // Inicializar el formulario de registro
            //initRegisterForm();
            this.scene.start('mazeCreateFacil'); //Mostrar escena de juego facil
        });

        buttonDesafio.on('pointerdown', () => {
            this.scene.start('mazeCreateDesafio'); // Mostrar la escena del juego
        });

        buttonExperto.on('pointerdown', () => {
            this.scene.start('mazeCreateExperto'); // Mostrar la escena de cómo jugar
        });

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