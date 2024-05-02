const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const server = http.createServer(app);
require('dotenv').config();

const cors = require('cors');
const path = require('path'); // Importa el módulo 'path'

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
// Middleware para permitir solicitudes CORS
app.use(cors());

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
    const mazeWidth = 53;
    const mazeHeight = 31;
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
    //maze[1][0] = 2;

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
    // Obtener los datos del usuario del cuerpo de la solicitud
    const { username, email, password } = req.body;

    // Hashear el password antes de insertarlo en la base de datos
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error al hashear el password:', err);
            res.status(500).json({ error: 'Error al hashear el password' });
            return;
        }

        // Insertar los datos del usuario en la base de datos con el password hasheado
        connection.query('INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                res.status(500).json({ error: 'Error al registrar el usuario' });
                return;
            }
            console.log('Usuario registrado correctamente');
            res.json({ message: 'Usuario registrado correctamente' });
        });
    });
});

// Inicia el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})