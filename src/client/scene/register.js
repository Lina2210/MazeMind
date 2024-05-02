//import { initializeApp } from "firebase/app";

//import { getAuth, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";
//import { text } from "express";
//const provider = new GoogleAuthProvider();


const formHTML = `
    <style>
        
        #register-form {
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
        }

        #register-form h1 {
            margin-bottom: 20px; /* Aumenta el espacio inferior */
        }
    
        #register-form input[type="text"],
        #register-form input[type="email"],
        #register-form input[type="password"],
        #register-form button {
            font-family: 'Press Start 2P', cursive;
            font-size: 16px;
            padding: 8px;
            margin: 5px 0;
            width: calc(100% - 16px);
            box-sizing: border-box;
            border: 2px solid #fff;
            background-color: transparent;
            color: #fff;
        }

        input[type="submit"] {
            font-family: 'Press Start 2P', cursive;
            font-size: 16px;
            padding: 8px;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
            border: 2px solid #fff;
            background-color: transparent;
            color: #fff;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #fff;
            color: #000;
        }
    </style>
    
    <div id="register-form">
        <h1>Registrate</h1>
        <input type="text" id="username" placeholder="Username">
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <input type="password" id="confirmPassword" placeholder="Confirm Password">
        <input type="submit" id="register-button" value="Register">
        
    </div>
`;

// Exportar la función que inicializa el formulario
export function initRegisterForm() {
    
    // Insertar el formulario en el cuerpo del documento
    const canvas = document.querySelector('canvas');
    console.log(canvas)
    document.body.innerHTML += formHTML;

    // Lógica del formulario (eventos, validación, etc.)
    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', () => {
        // Manejar el evento de clic del botón de registro
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        // Realizar alguna acción con los valores del formulario
        console.log('Username:', usernameInput.value);
        console.log('Email:', emailInput.value);
        console.log('Password:', passwordInput.value);
        console.log('Confirm Password:', confirmPasswordInput.value);

        // Verificar que las contraseñas coincidan
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Crear un objeto con los datos del usuario
        const userData = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };

        // Enviar los datos del usuario al servidor
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el usuario');
            }
            return response.json();
        })
        .then(data => {
            // Manejar la respuesta del servidor
            console.log('Usuario registrado exitosamente:', data);
            // Aquí podrías redirigir al usuario a otra página o realizar otras acciones
        })
        .catch(error => {
            console.error('Error:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        });
    });

    
/*
    const firebaseApp = initializeApp ({
        apiKey: "AIzaSyA9Kmowy65cM_xg_D2n-w0us4ARJ3HWCHs",
        authDomain: "maze-mind-1.firebaseapp.com",
        projectId: "maze-mind-1",
        storageBucket: "maze-mind-1.appspot.com",
        messagingSenderId: "439571506518",
        appId: "1:439571506518:web:ce4c55c13b4cb8b63ea2f7",
        measurementId: "G-YMH4H4BL7Q"
    });

    const auth = getAuth(firebaseApp);
    connectAuthEmulator(auth, "http://localhost:9099")
    
    const loginEmailPassword = async () => {
        const loginEmail = textEmail.value;
        const loginPassword = textPassword.value;

        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log(userCredential.user);
    }

    
// Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    const analytics = getAnalytics(app);

    
    authGoogle.addEventListener('click', () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    })
    */
}