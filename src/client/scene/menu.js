export default class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    preload() {
        // Cargar los recursos necesarios para el menú
        this.load.path = './assets/';
        this.load.image('backgorund-menu', 'fondoMenu.png');
        this.load.image('title-image', 'titulo.png');
    }

    create() {
        // IMAGEN FONDO
        this.add.image(960, 540, 'backgorund-menu').setScale(1);

        // TITULO
        this.add.image(960, 180, 'title-image').setOrigin(0.5);

        // BOTONES
        // Boton para iniciar partida
        
       // Definir el estilo común para los botones
        const buttonStyle = {
            fontSize: '45px',
            fill: '#ffffff',
            fontWeight: 'extra-bold',
            
            //fontFamily: 'Arial'
        };

        // Verificar si el usuario está registrado
        const username = localStorage.getItem('username');
        let buttonLogin;
        let buttonLogout;

        if (username) {
            buttonLogin = this.add.text(1700, 75, `${username}`, buttonStyle).setOrigin(0.6);
            buttonLogin.on('pointerdown', () => {
                this.scene.start('userPerfil'); // Mostrar la pantalla de usuario o cualquier otra escena
            });
            buttonLogout = this.add.text(1700, 100, 'Cerrar Sesión', buttonStyle).setOrigin(0.6);   
            buttonLogout.setFontSize(25);
            buttonLogout.on('pointerdown', () => {
                this.logout(); // Cerrar sesión
            });

        } else {
            buttonLogin = this.add.text(1700, 75, 'Iniciar Sesión', buttonStyle).setOrigin(0.6);
            buttonLogin.on('pointerdown', () => {
                this.scene.start('login'); // Mostrar la escena de login
            });
        }

        buttonLogin.setFontSize(25);
       

        const buttonRegister = this.add.text(960, 590, 'Registrarse', buttonStyle).setOrigin(0.5);
        const buttonStart = this.add.text(960, 670, 'Nueva Partida', buttonStyle).setOrigin(0.5);
        const buttonHelp = this.add.text(960, 750, 'Cómo Jugar', buttonStyle).setOrigin(0.5);
        const buttonOptions = this.add.text(960, 830, 'Opciones', buttonStyle).setOrigin(0.5);

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

        // Aplicar interactividad y animaciones a los botones
        const buttons = [buttonRegister, buttonStart, buttonHelp, buttonOptions];
        
        if (buttonLogin) {
            buttons.push(buttonLogin);
        }
        if (buttonLogout) {
            buttons.push(buttonLogout);
        }

        
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
    
        buttonRegister.on('pointerdown', () => {
            // Inicializar el formulario de registro
            //initRegisterForm();
            this.scene.start('registro'); // Mostrar la escena de registro
        });

        buttonStart.on('pointerdown', () => {
            this.scene.start('game'); // Mostrar la escena del juego
        });

        buttonHelp.on('pointerdown', () => {
            this.scene.start('help'); // Mostrar la escena de cómo jugar
        });

        buttonOptions.on('pointerdown', () => {
            this.scene.start('options'); // Mostrar la escena de opciones
        });
        
    }
    update() {

    }

    //hacer logout
    logout() {
        localStorage.removeItem('username');
        this.scene.start('menu');
    }
}