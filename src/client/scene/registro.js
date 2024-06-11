export default class Registro extends Phaser.Scene {
    constructor() {
        super('registro');
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
        form.id = 'register-form';
        form.style.cssText = style; // Aplica los estilos definidos en la cadena 'style'

        // Agregar elementos al formulario
        form.innerHTML = `
            <h1>Regístrate</h1>
            <input type="text" id="username" placeholder="Username">
            <input type="email" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Password">
            <input type="password" id="confirmPassword" placeholder="Confirm Password">
            <button id="register-button">Register</button>
        `;

        // Insertar el formulario en el cuerpo del documento
        document.body.appendChild(form);

        // Evento de clic del botón de registro
        document.getElementById('register-button').addEventListener('click', () => {
            // Lógica de validación y envío de datos
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validar que todos los campos estén completos
            if (!username || !email || !password || !confirmPassword) {
                this.displayError("¡No te olvides de completar todos los campos para seguir adelante!");
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.displayError("¡Ups! Parece que ese email no es válido. ¿Podrías revisarlo?");
                return;
            }

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                this.displayError("¡Oh no! Las contraseñas no coinciden. ¿Podrías revisarlas?");
                return;
            }

            // Validar la contraseña
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                this.displayError("¡Oh no! La contraseña debe tener al menos 8 caracteres, una letra y un número.");
                return;
            }

            // Aquí puedes enviar los datos al servidor, por ejemplo con fetch
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
                })
                .then(response => response.json())
                .then(data => {
                    if(data.error){
                        this.displayError(data.error);
                    }
                    else{
                        this.displaySuccess(data.message);
                    }
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.displayError(error.message);
                    });
        });

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

    displayError(errorMessage) {
        const errorText = document.createElement('p');
        errorText.textContent = errorMessage;
        errorText.style.cssText = `
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
        document.body.appendChild(errorText);
        setTimeout(() => {
            errorText.remove();

        }, 7000);
    }

    displaySuccess(successMessage) {

        const successText = document.createElement('p');
        successText.textContent = successMessage;
        successText.style.cssText = `
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
        document.body.appendChild(successText);
        setTimeout(() => {
            successText.remove();
        }, 7000);
    }

    
}

