export default class UserPerfil extends Phaser.Scene {
    constructor() {
        super('userPerfil');
        this.tableContainer = null; // Inicializa la propiedad para contener el contenedor de la tabla
    }

    preload() {
        // Carga de assets, como imágenes y sonidos, aquí
    }

    create() {
        // Configuración inicial de la escena, como la disposición de elementos y la interacción con el usuario
        
        // Nombre de usuario
        const username = localStorage.getItem('username');

        // Título de la escena que contenga el nombre de usuario
        this.add.text(960, 100, `Perfil de ${username}`, {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Subtítulo de la escena que diga "Puntajes Personales"
        this.add.text(960, 200, 'Puntajes Personales', {
            fontSize: '36px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Crear la tabla para mostrar los puntajes
        this.tableContainer = this.createScoreTable(); // Guarda la referencia al contenedor de la tabla

        // Obtener los puntajes del usuario
        this.getScores(username);

        // Botón para volver al menú
        const backButton = this.add.text(100, 980, 'Volver', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0, 1);

        // Configurar el evento del botón para volver al menú
        backButton.setInteractive().on('pointerdown', () => {
            if (this.tableContainer) {
                this.tableContainer.remove(); // Eliminar la tabla y el contenedor del DOM
            }
            this.scene.start('menu'); // Muestrar la escena del menú
        });
    }

    createScoreTable() {
        // Crear la tabla HTML para mostrar los puntajes
        const tableContainer = document.createElement('div');
        tableContainer.id = 'scores-table';

        const table = document.createElement('table');
        table.style.width = '100%'; // Asegura que la tabla ocupe el 100% del contenedor
        table.style.borderCollapse = 'collapse'; // Colapsa los bordes de la tabla

        tableContainer.appendChild(table); // Agregar la tabla al contenedor
        document.body.appendChild(tableContainer); // Agregar el contenedor al DOM
        return tableContainer; // Devuelve el contenedor para guardar la referencia
    }

    getScores(username) {
        // Obtener los puntajes del usuario desde el servidor
        fetch(`http://localhost:3000/scores?username=${username}`)
            .then(response => response.json())
            .then(scores => {
                // Mostrar los puntajes en la tabla
                this.displayScores(scores);
            })
            .catch(error => console.error('Error al obtener los puntajes:', error));
    }
    
    displayScores(scores) {
        // Limpiar la tabla antes de agregar nuevos puntajes
        const table = this.tableContainer.querySelector('table');
        if (!table) {
            return;
        }
        table.innerHTML = '';

        // Crear la fila de encabezado
        const headerRow = table.insertRow();
        const scoreHeader = document.createElement('th');
        scoreHeader.textContent = 'Puntaje';
        headerRow.appendChild(scoreHeader);
        const levelHeader = document.createElement('th');
        levelHeader.textContent = 'Nivel';
        headerRow.appendChild(levelHeader);
        const createdAtHeader = document.createElement('th');
        createdAtHeader.textContent = 'Fecha';
        headerRow.appendChild(createdAtHeader);

        // Crear filas de la tabla y agregar los puntajes y las fechas de creación
        scores.forEach(score => {
            const row = table.insertRow();
            const scoreCell = row.insertCell();
            scoreCell.textContent = score.score;
            const levelCell = row.insertCell();
            levelCell.textContent = score.levelDificult;
            const createdAtCell = row.insertCell();
            createdAtCell.textContent = new Date(score.created_at).toLocaleString();
        });
    }
}
