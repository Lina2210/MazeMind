export default class Login extends Phaser.Scene {
    constructor() {
        super('login');
    }

    preload() {
        // Load any assets you need for this scene
    }

    create() {
        // Estilo del formulario
        const style = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #000;
            color: #fff;
            padding: 20px;
            border: 2px solid #fff;
            border-radius: 5px;
            width: 300px;
            /* Ajusta el alto del div */
            height: auto;
            /* Ajusta el espacio entre los elementos */
            margin: 20px auto;
            text-align: center; /* Centra el texto */
        `;

        // Crear el formulario
        const form = document.createElement('div');
        form.id = 'login-form';
        form.style.cssText = style; // Aplica los estilos definidos en la cadena 'style'

        // Agregar elementos al formulario
        form.innerHTML = `
            <h1>Iniciar Sesión</h1>
            <input type="text" id="usernameLogin" placeholder="Username o Email">
            <input type="password" id="passwordLogin" placeholder="Password">
            <input type="submit" id="login-button">
        `;
        // Insertar el formulario en el cuerpo del documento
        document.body.appendChild(form);

        // Evento de clic del botón de registro
        document.getElementById('login-button').addEventListener('click', () => {
            // Lógica de validación y envío de datos
            const username = document.getElementById('usernameLogin').value;
            const password = document.getElementById('passwordLogin').value;

            // Validar que todos los campos estén completos
            if (!username || !password) {
                this.displayError("¡No te olvides de completar todos los campos para seguir adelante!");
                return;
            }

            //enviar datos al servidor
            fetch('http://localhost:3000/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernameLogin: username, passwordLogin: password })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if(data.error){
                        this.displayError(data.error);
                    }
                    else{
                        this.displaySuccess(data.message);
                        localStorage.setItem('username', data.username);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                });
                });

        let errorMessage = null;

        // Función para mostrar un mensaje de error con x para cerrarlo
        this.displayError = (message) => {
            const error = document.createElement('div');
            error.style.cssText = `
                position: absolute;
                left: 50%;
                top: 10%;
                transform: translate(-50%, 0);
                background-color: #ff0000;
                color: #fff;
                padding: 10px;
                border: 2px solid #fff;
                border-radius: 5px;
                width: 300px;
                text-align: center;
            `;
            error.textContent = message;
            document.body.appendChild(error);

            // Asignar la referencia a la variable errorMessage
            errorMessage = error;

        }

        //funcion para mostrar mensaje de exito
        this.displaySuccess = (message) => {
            const success = document.createElement('div');
            success.style.cssText = `
                position: absolute;
                left: 50%;
                top: 10%;
                transform: translate(-50%, 0);
                background-color: #00ff00;
                color: #fff;
                font-size: 30px;
                padding: 10px;
                border: 2px solid #fff;
                border-radius: 5px;
                width: 300px;
                text-align: center;
            `;
            if (errorMessage) {
                errorMessage.remove();
                errorMessage = null;
            }
            success.textContent = message;
            document.body.appendChild(success);

            // Eliminar el mensaje después de 5 segundos
            setTimeout(() => {
                success.remove();
                form.remove();
                
                this.scene.start('menu');
            }, 3000);
        }
         
       // Botón para volver al menú
       const backButton = this.add.text(100, 980, 'Volver', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0, 1);

        // Configurar el evento del botón para volver al menú
        backButton.setInteractive().on('pointerdown', () => {
            form.remove();
            this.scene.start('menu'); // Muestrar la escena del menú
            
        });

    }



    update() {
        // Update logic for your scene
    }
}

