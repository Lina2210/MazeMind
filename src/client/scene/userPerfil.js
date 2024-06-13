export default class UserPerfil extends Phaser.Scene {
    constructor() {
        super('userPerfil');
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
        const table = this.createScoreTable();

        // Obtener los puntajes del usuario
        this.getScores(username, table);

        // Botón para volver al menú
        const backButton = this.add.text(100, 980, 'Volver', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0, 1);

        // Configurar el evento del botón para volver al menú
        backButton.setInteractive().on('pointerdown', () => {
            table.remove(); // Eliminar la tabla antes de volver al menú
            this.scene.start('menu'); // Muestrar la escena del menú
        });
    }

    createScoreTable() {
        // Crear la tabla HTML para mostrar los puntajes
        const table = document.createElement('table');
        table.id = 'scores-table';
        table.style.color = '#000';
        table.style.fontSize = '24px';
        table.style.margin = 'auto';
        document.body.appendChild(table); // Agregar la tabla al DOM
        return table;
    }

    getScores(username, table) {
        // Obtener los puntajes del usuario desde el servidor
        fetch(`http://localhost:3000/scores?username=${username}`)
            .then(response => response.json())
            .then(scores => {
                // Mostrar los puntajes en la tabla
                this.displayScores(scores, table);
            })
            .catch(error => console.error('Error al obtener los puntajes:', error));
    }
    
    displayScores(scores, table) {
        // Limpiar la tabla antes de agregar nuevos puntajes
        table.innerHTML = '';

        // Crear la fila de encabezado
        const headerRow = table.insertRow();
        const scoreHeader = document.createElement('th');
        scoreHeader.textContent = 'Puntaje';
        headerRow.appendChild(scoreHeader);
        const createdAtHeader = document.createElement('th');
        createdAtHeader.textContent = 'Fecha';
        headerRow.appendChild(createdAtHeader);

        // Crear filas de la tabla y agregar los puntajes y las fechas de creación
        scores.forEach(score => {
            const row = table.insertRow();
            const scoreCell = row.insertCell();
            scoreCell.textContent = score.score;
            const createdAtCell = row.insertCell();
            createdAtCell.textContent = new Date(score.created_at).toLocaleString();
        });
    }
}