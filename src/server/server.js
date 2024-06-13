const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const server = http.createServer(app);
require('dotenv').config();

const cors = require('cors');
const path = require('path'); // Importa el módulo 'path'

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
// Middleware para permitir solicitudes CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

// configuración de express-session
app.use(session({
    secret: 'UnaCadenaAleatoriaYUnica123',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Si se cambia a true, la cookie solo se enviará si la conexión es HTTPS
}));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión establecida con la base de datos');
});

// Ruta para generar y enviar el laberinto
app.get('/generar-laberinto', (req, res) => {
    const mazeWidth = 29;
    const mazeHeight = 17;
    const maze = generateMaze(mazeWidth, mazeHeight);
    res.json({ maze });
});

// Función para generar el laberinto
app.get('/generar-laberinto', (req, res) => {
    const mazeWidth = 28;
    const mazeHeight = 16;
    const maze = generateMaze(mazeWidth, mazeHeight);
    res.json({ maze });
});

// Función para generar el laberinto
function generateMaze(width, height) {
    const maze = [];
    for (let i = 0; i < height; i++) {
        maze[i] = [];
        for (let j = 0; j < width; j++) {
            maze[i][j] = 1; // Todas las celdas inicialmente son paredes
        }
    }

    // Establecer entrada en el borde superior izquierdo (0, 0)
    maze[1][0] = 3;

    // Establecer salida en el borde inferior derecho
    maze[height - 2][width - 1] = 2;

    let posX = 1;
    let posY = 1;
    maze[posX][posY] = 0; // Marcar la celda inicial como pasillo
    const moves = [posY + posX * width];

    while (moves.length) {
        const possibleDirections = [];
        if (posX + 2 > 0 && posX + 2 < height - 1 && maze[posX + 2][posY] == 1) {
            possibleDirections.push("S");
        }
        if (posX - 2 > 0 && posX - 2 < height - 1 && maze[posX - 2][posY] == 1) {
            possibleDirections.push("N");
        }
        if (posY - 2 > 0 && posY - 2 < width - 1 && maze[posX][posY - 2] == 1) {
            possibleDirections.push("W");
        }
        if (posY + 2 > 0 && posY + 2 < width - 1 && maze[posX][posY + 2] == 1) {
            possibleDirections.push("E");
        }
        if (possibleDirections.length) {
            const move = Math.floor(Math.random() * possibleDirections.length);
            switch (possibleDirections[move]) {
                case "N":
                    maze[posX - 2][posY] = 0;
                    maze[posX - 1][posY] = 0;
                    posX -= 2;
                    break;
                case "S":
                    maze[posX + 2][posY] = 0;
                    maze[posX + 1][posY] = 0;
                    posX += 2;
                    break;
                case "W":
                    maze[posX][posY - 2] = 0;
                    maze[posX][posY - 1] = 0;
                    posY -= 2;
                    break;
                case "E":
                    maze[posX][posY + 2] = 0;
                    maze[posX][posY + 1] = 0;
                    posY += 2;
                    break;
            }
            moves.push(posY + posX * width);
        } else {
            const back = moves.pop();
            posX = Math.floor(back / width);
            posY = back % width;
        }
    }
    
    //console.log(maze)
    
    return maze;
}

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error al hashear el password:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        connection.query('INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('Users.username')) {
                        return res.status(400).json({ error: '¡Ups! Parece que alguien más ya tiene ese nombre de usuario. ¿Qué te parece probar con otro?' });
                    } else if (err.sqlMessage.includes('Users.email')) {
                        return res.status(400).json({ error: '¡Ups! Parece que ese correo electrónico ya está en uso. ¿Podrías intentar con otro?' });
                    }
                }
                console.error('Error al registrar el usuario:', err);
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }
            console.log('Usuario registrado correctamente');
            return res.status(200).json({ message: '¡Genial! ¡Tu cuenta ha sido creada con éxito! ¡Bienvenido!"' });
        });
    });
});


app.post('/login', (req, res) => {
    const { usernameLogin, passwordLogin } = req.body;

    connection.query('SELECT * FROM Users WHERE username = ? or email = ?' , [usernameLogin, usernameLogin], (err, results) => {
        if (err) {
            console.error('Error al buscar el usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: '¡Ups! Parece que ese nombre de usuario no existe. ¿Podrías revisarlo?' });
        }

        const user = results[0];
        bcrypt.compare(passwordLogin, user.password_hash, (err, result) => {
            if (err) {
                console.error('Error al comparar las contraseñas:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (!result) {
                return res.status(400).json({ error: '¡Oh no! La contraseña no es correcta. ¿Podrías revisarla?' });
            }
            //Almacenar el nombre de usuario en la sesión
            req.session.username = user.username;
            return res.status(200).json({ message: '¡Hola ' + user.username + '!', username: user.username  });
        });
    });
});


//ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy();
    localStorage.clear();
    res.redirect('/');
});

//guardar puntuacion en la base de datos
app.post('/saveScore', (req, res) => {
    const { username, score, timeElapsed } = req.body;

    const query = `
        INSERT INTO Games (user_id, score)
        SELECT user_id, ?
        FROM Users
        WHERE username = ?
    `;

    connection.query(query, [score, username], (err, result) => {
        if (err) {
            console.error('Error al guardar la puntuación:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        console.log('Puntuación guardada correctamente');
        return res.status(200).json({ message: 'Puntuación guardada correctamente' });
    });
});

// Ruta para obtener puntajes del usuario actual
app.get('/scores', (req, res) => {
    console.log("entro al get scores")
    const username = req.query.username; // Recibe el nombre de usuario desde Phaser
    console.log(username)
    // Consulta SQL para obtener los puntajes del usuario
    const sql = `
        SELECT Games.score, Games.created_at
        FROM Games
        JOIN Users ON Games.user_id = Users.user_id
        WHERE Users.username = 'Thiago'
        ORDER BY Games.score DESC
    `;

    connection.query(sql, [username], (err, results) => {
        if (err) {
        throw err;
        }
        res.json(results); // Envía los resultados como JSON
    });
});
  


// Inicia el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})