export default class Mastermind extends Phaser.Scene {
    constructor() {
        super({ key: 'mastermind' });
    }

preload(){
		
	// Carga la imagen de fondo
	this.load.image('background', './assets/fondoMasterMind.jpg');

	
	//make a spritesheet with 7 colour circles for your guesses; first colour is blank/grey	
		this.load.spritesheet('colours', './assets/coloursb.png', {
			frameWidth: 54,
			frameHeight: 54
		});
		//4 colour circles show your results: green for correct in right place, yellow for correct in wrong place and white or red for wrong and one grey to start
		this.load.spritesheet('results', './assets/resultsb.png', {
			frameWidth: 27,
			frameHeight: 27
		});
		//enter button
		this.load.image('enter', './assets/checkBoton.png');

		
	// Cargar la música de fondo
	//this.load.audio('backgroundMusica', './assets/mastermind.mp3');
	
	}

create(){

	// Añadir la música de fondo y configurarla
	/*this.backgroundMusic = this.sound.add('backgroundMusica', { loop: true, volume: 0.5 });
	this.backgroundMusic.play();*/

	// Establece el tamaño del juego en 800x800
    //this.scale.setGameSize(1200, 800);

    // Centra la cámara principal en la escena
    this.cameras.main.centerOn(400, 400);

	// Agrega la imagen de fondo 
	const background = this.add.image(400, 400, 'background');

	// Ajusta la imagen al tamaño del juego
	background.setDisplaySize(1856, 1088); 

	// Botón para mute/unmute
	/*const mutedMusicButton = this.add.text(20, 20, 'Silenciar Música', { font: '20px Arial', fill: '#ffffff' }).setInteractive();
	mutedMusicButton.on('pointerdown', () => this.mutedMusic());
*/
	//secret code:4 digit code from 6 possible : you could change this to an array of 6 
		this.code = [];
		for (let i = 0; i < 4; i++) {
			let randomNumber;
			do {
				// Generate a random number between 0 and 5
				randomNumber = Phaser.Math.Between(1, 4);
			} while (this.code.includes(randomNumber)); // Check if the random number is already in the code
		
			// Push the unique random number to the code array
			this.code.push(randomNumber);
		}
			
	//this has 8 rows allowed for guesses. the x and y positions are determined here by where I wanted them, but you can change these
	//row8 HECHO
	this.group8 = this.add.group();
	let positions =[{x: 200, y:200}, {x:265, y:200}, {x:330, y:200}, {x:395, y:200}];
	this.createRow(positions, this.group8);

	//row7 HECHO
	this.group7 = this.add.group();
	positions =[{x: 200, y:270}, {x:265, y:270}, {x:330, y:270}, {x:395, y:270}];
	this.createRow(positions, this.group7);
	
	
	//row6 HECHO
	this.group6 = this.add.group();
	positions =[{x: 200, y:340}, {x:265, y:340}, {x:330, y:340}, {x:395, y:340}];
	this.createRow(positions, this.group6);
		
	//row5 HECHO
	this.group5 = this.add.group();
	positions =[{x: 200, y:410}, {x:265, y:410}, {x:330, y:410}, {x:395, y:410}];
	this.createRow(positions, this.group5);

	//row4 HECHO
	this.group4 = this.add.group();
	positions =[{x: 200, y:480}, {x:265, y:480}, {x:330, y:480}, {x:395, y:480}];
	this.createRow(positions, this.group4);
	
	//row3 HECHO
	this.group3 = this.add.group();
	positions =[{x: 200, y:550}, {x:265, y:550}, {x:330, y:550}, {x:395, y:550}];
	this.createRow(positions, this.group3);
	
	//row2 HECHO
	this.group2 = this.add.group();
	positions =[{x: 200, y:620}, {x:265, y:620}, {x:330, y:620}, {x:395, y:620}];
	this.createRow(positions, this.group2);
	
	//row1 HECHO
	this.group1 = this.add.group();
	positions =[{x: 200, y:690}, {x:265, y:690}, {x:330, y:690}, {x:395, y:690}];
	this.createRow(positions, this.group1);
	
	//enter buttons HECHO
	this.createEnterButton(500, 200, this.onEnter8, this.enter8);
    this.createEnterButton(500, 270, this.onEnter7, this.enter7);
	this.createEnterButton(500, 340, this.onEnter6, this.enter6);
    this.createEnterButton(500, 410, this.onEnter5, this.enter5);
	this.createEnterButton(500, 480, this.onEnter4, this.enter4);
    this.createEnterButton(500, 550, this.onEnter3, this.enter3);
	this.createEnterButton(500, 620, this.onEnter2, this.enter2);
    this.createEnterButton(500, 690, this.onEnter1, this.enter1);

	this.addRowNumbers();
	

	////////////HINTS///////////////// SE PUEDE MEJORAR
	//this is the result hints. They start out grey/blank
	//row 8
	this.hintpos=[{x: 600, y:200}, {x:630, y:200}, {x: 660, y:200}, {x:690, y: 200}];
	this.hint8 = this.createHint(this.hintpos);
	//row 7
	this.hintpos7=[{x: 600, y:270}, {x:630, y:270}, {x: 660, y:270}, {x:690, y: 270}];
	this.hint7 = this.createHint(this.hintpos7);
	//row 6
	this.hintpos6=[{x: 600, y:340}, {x:630, y:340}, {x: 660, y:340}, {x:690, y: 340}];
	this.hint6 = this.createHint(this.hintpos6);
	//row 5
	this.hintpos5=[{x: 600, y:410}, {x:630, y:410}, {x: 660, y:410}, {x:690, y: 410}];
	this.hint5 = this.createHint(this.hintpos5);

	//row 4
	this.hintpos4=[{x: 600, y:480}, {x:630, y:480}, {x: 660, y:480}, {x:690, y: 480}];
	this.hint4 = this.createHint(this.hintpos4);

	//row 3
	this.hintpos3=[{x: 600, y:550}, {x:630, y:550}, {x: 660, y:550}, {x:690, y: 550}];
	this.hint3 = this.createHint(this.hintpos3);
	
	//row 2
	this.hintpos2=[{x: 600, y:620}, {x:630, y:620}, {x: 660, y:620}, {x:690, y: 620}];
	this.hint2 = this.createHint(this.hintpos2);
	
	//row 1
	this.hintpos1=[{x: 600, y:690}, {x:630, y:690}, {x: 660, y:690}, {x:690, y: 690}];
	this.hint1 = this.createHint(this.hintpos1);	
	
	
//at start, all buttons disabled except row 1	HECHO		
	this.group2.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group3.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group4.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group5.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group6.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group7.getChildren().forEach(function(item){
		item.disableInteractive();
	});
	this.group8.getChildren().forEach(function(item){
		item.disableInteractive();
	});
}

	createHint(positions){
		let hintN = []
		for (var i in positions){
			let posi = positions[i];
			let hint = this.add.sprite(posi.x, posi.y, 'results', 0);
			hintN.push(hint);
		}
		return hintN;
	}
	// Función para crear las filas HECHA
	createRow(positions, group) {
		let row = [];
		for (let pos of positions) {
			let empty = this.add.sprite(pos.x, pos.y, 'colours', 0);
			empty.setInteractive();
			empty.on('pointerdown', () => this.changeFrame(empty));
			row.push(empty);
			group.add(empty);
		}
		return row;
	}

	//Función para crear los botones HECHA
	createEnterButton(x, y, callback, button) {
		button = this.add.sprite(x, y, 'enter').setInteractive();
		button.on('pointerdown', callback, this);
	}

	addRowNumbers() {
		// Define las posiciones para los números de fila
		const numberPositions = [
			{ x: 100, y: 690 },
			{ x: 100, y: 620 },
			{ x: 100, y: 550 },
			{ x: 100, y: 480 },
			{ x: 100, y: 410 },
			{ x: 100, y: 340 },
			{ x: 100, y: 270 },
			{ x: 100, y: 200 }
		];
	
		// Estilos para el texto de los números de fila
		const numberStyle = {
			fontFamily: 'Arial',
			fontSize: '36px',
			color: '#FFFFFF',  // Cambia el color aquí
			fontWeight: 'bold' // Hace que el texto sea más grueso
		};
	
		// Agrega los números de fila
		for (let i = 0; i < numberPositions.length; i++) {
			const pos = numberPositions[i];
			const number = i + 1; // El número de fila es el índice más 1
	
			// Crea el texto para el número de fila con los estilos especificados
			const text = this.add.text(pos.x, pos.y, number.toString(), numberStyle);
	
			// Alinea el texto horizontalmente al centro
			text.setOrigin(0.5);
		}
	}

	//Función para cambiar de color HECHA
	changeFrame(sprite) {
		// Acceder al fotograma actual del sprite
		const currentFrame = sprite.frame.name;
		// Avanzar al siguiente fotograma
		const nextFrame = currentFrame + 1;
		// Establecer el siguiente fotograma en el sprite
		sprite.setFrame(nextFrame);
	}

	
	onEnter1(){
		this.guess = [];
		
		let row1Sprites = this.group1.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row1Sprites) {
					let num = sprite.frame.name;
       				 this.guess.push(num);
				}
		//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");//esto hay que cambiarlo por un pop up
		}
		else{
		//lock row from being used again
			row1Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode1();	
			
		
		}
			
	}	
	checkCode1(){
		//log guess and check with code (optional)

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
					
				}
				else {
					this.getHints1();
				}
	}

	
	getHints1(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else{
					this.hintsarray.push(1);
				}
			//sort array into right, wrong place and wrong. 
			this.hintsarray.sort();
		}
		
		this.update1();
	}
	update1(){
		//optional log out. 
		
		for(var i in this.hint1){
			if(this.hintsarray[i] ===1){
				this.hint1[i].setFrame(1);
			}
			else {
				this.hint1[i].setFrame(2);
			}
		}
		this.group2.getChildren().forEach(function(item){
			
				item.setInteractive();
	});
		
	}


	onEnter2(){
		this.guess = [];
		
		let row2Sprites = this.group2.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row2Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
			//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores."); //esto hay que cambiarlo por un pop up
		}
		else{
		//lock row from being used again
			row2Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode2();	
				
		}
		
	}	
	checkCode2(){

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints2();
				}
	}
	getHints2(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {

					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update2();
	}
	update2(){
				
		for(var i in this.hint2){
			if(this.hintsarray[i] ===1){
				this.hint2[i].setFrame(1);
			}
			else {
				this.hint2[i].setFrame(2);
			}
			
		}
		
		this.group3.getChildren().forEach(function(item){
			item.setInteractive(); 
	});
	}
	
	
	onEnter3(){
		this.guess = [];
		
		let row3Sprites = this.group3.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row3Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
			//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row3Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode3();	
			
		
		}
			
	}
	checkCode3(){

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints3();
				}
	}
	getHints3(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {

					this.hintsarray.push(1);
				}
			//sort array
			this.hintsarray.sort();
		}
		
		this.update3();
	}
	update3(){
				
		for(var i in this.hint3){
			if(this.hintsarray[i] ===1){
				this.hint3[i].setFrame(1);
			}
			else 			{
				this.hint3[i].setFrame(2);
			}
			
		}
		
		this.group4.getChildren().forEach(function(item){
			item.setInteractive();
	});
		
	}

	
	onEnter4(){
		this.guess = [];
		
		let row4Sprites = this.group4.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row4Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
			//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row4Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode4();	
			
		
		}
	}
	checkCode4(){

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints4();
				}
	}	
	getHints4(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {

					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update4();
	}
	update4(){
				
		for(var i in this.hint4){
			if(this.hintsarray[i] ===1){
				this.hint4[i].setFrame(1);
			}
			else {
				this.hint4[i].setFrame(2);
			}
			
		}
	
		this.group5.getChildren().forEach(function(item){
			item.setInteractive();
	});
	}


	onEnter5(){
		this.guess = [];
		
		let row5Sprites = this.group5.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row5Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
			//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row5Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode5();	
			
		
		}
			
	}	
	checkCode5(){

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints5();
				}
	}		
	getHints5(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {
					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update5();
	}
	update5(){
				
		for(var i in this.hint5){
			if(this.hintsarray[i] ===1){

				this.hint5[i].setFrame(1)
			}else { 
				this.hint5[i].setFrame(2)
			}
			
		}
		this.group6.getChildren().forEach(function(item){
			item.setInteractive();
	});
	}
		
	onEnter6(){
		this.guess = [];
		
		let row6Sprites = this.group6.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row6Sprites) {
					let num = sprite.frame.name;
       				 this.guess.push(num);
				}
		//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row6Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode6();	
			
		
		}
	}
	checkCode6(){

			if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints6();
				}
	}
	getHints6(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {
					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update6();
	}
	update6(){
				
		for(var i in this.hint6){
			if(this.hintsarray[i] ===1){
				this.hint6[i].setFrame(1);
			}
			else {
				this.hint6[i].setFrame(2);
			}
		}
		this.group7.getChildren().forEach(function(item){
			item.setInteractive();
	});
		
	}

	
	
	onEnter7(){
		this.guess = [];
		
		let row7Sprites = this.group7.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row7Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
			//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row7Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode7();	
			
		
		}
			
	}
	checkCode7(){

				if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints7();
				}
	}
	getHints7(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {
					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update7();
	}
	update7(){
				
		for(var i in this.hint7){
			if(this.hintsarray[i] ===1){
				this.hint7[i].setFrame(1);
			}
			else {
				this.hint7[i].setFrame(2);
			}
			
		}
		this.group8.getChildren().forEach(function(item){
			item.setInteractive();
	});
		
	}


	onEnter8(){
		this.guess = [];
		
		let row8Sprites = this.group8.getChildren();
		//get frame number of each item in row and store in array
				for(let sprite of row8Sprites) {
					let num = sprite.frame.name;
       				this.guess.push(num);
				}
		//check the array doesn't contain '0' (empty)
		if(this.guess.includes(0)){
			//throw error
			this.error("El código está incompleto. Debes completar los  cuatro colores.");
		}
		else{
		//lock row from being used again
			row8Sprites.forEach(function(item) {
				item.disableInteractive();
        });
			//compare the guess with the code
		this.checkCode8();	
			
		
		}
			
	}
	checkCode8(){

			if(JSON.stringify(this.guess) === JSON.stringify(this.code))
				{
					this.puzzWin();
				}
				else {
					this.getHints8();
				}
	}
		
	getHints8(){
		this.hintsarray = [];
		//compare numbers in array to see if there are right colours in right places:
		for (var i= 0; i< 4; i++ ){
				if(this.guess[i] === this.code[i]){
					//light up right code in right place peg
					this.hintsarray.push(2);
				}
				//then check right colours in wrong place only if not right in right pace
				else {
					this.hintsarray.push(1);
				}
				
			//sort array
			this.hintsarray.sort();
		}
		
		this.update8();
	}
	
	update8(){
				
		for(var i in this.hint8){
			if(this.hintsarray[i] ===1){
				this.hint8[i].setFrame(1);
			}
			else {
				this.hint8[i].setFrame(2);
			}
			
		}
		
		this.gameOver();
		
	}

	puzzWin() {
		const successText = document.createElement('p');
		const successMessage = '¡FELICIDADES, GANASTE!';
		successText.textContent = successMessage;
		successText.style.cssText = `
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background-color: #28a745;
			color: #fff;
			font-size: 28px;
			font-weight: bold;
			padding: 20px 40px;
			border-radius: 10px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			text-align: center;
			z-index: 1000;
			opacity: 0;
			transition: opacity 0.5s ease;
		`;
		document.body.appendChild(successText);
	
		setTimeout(() => {
			successText.style.opacity = 1;
		}, 0);
	
		setTimeout(() => {
			successText.style.opacity = 0;
			setTimeout(() => {
				successText.remove();
				this.scene.start('menu')
			}, 500);
		}, 4000);
		
	}

	gameOver() {
		const overText = document.createElement('p');
		const overMessage = '¡OH NO, PERDISTE!';
		overText.textContent = overMessage;
		overText.style.cssText = `
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background-color: #dc3545;
			color: #fff;
			font-size: 28px;
			font-weight: bold;
			padding: 20px 40px;
			border-radius: 10px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			text-align: center;
			z-index: 1000;
			opacity: 0;
			transition: opacity 0.5s ease;
		`;
		document.body.appendChild(overText);
	
		setTimeout(() => {
			overText.style.opacity = 1;
		}, 0);
	
		setTimeout(() => {
			overText.style.opacity = 0;
			setTimeout(() => {
				overText.remove();
				this.scene.start('menu')
			}, 500);
		}, 4000);
		
	}
	
	error(mensaje) {
		const errorText = document.createElement('p');
		const errorMessage = mensaje;
		errorText.textContent = errorMessage;
		errorText.style.cssText = `
			position: fixed;
			left: 50%;
			top: 20%;
			transform: translate(-50%, -50%);
			background-color: #ffc107;
			color: #fff;
			font-size: 24px;
			font-weight: bold;
			padding: 15px 30px;
			border-radius: 10px;
			border: 2px solid #fff;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			text-align: center;
			z-index: 1000;
			opacity: 0;
			transition: opacity 0.5s ease;
		`;
		document.body.appendChild(errorText);
	
		setTimeout(() => {
			errorText.style.opacity = 1;
		}, 0);
	
		setTimeout(() => {
			errorText.style.opacity = 0;
			setTimeout(() => {
				errorText.remove();
			}, 500);
		}, 7000);
	}

	/*mutedMusic() {
        if (this.backgroundMusic.volume > 0) {
            this.backgroundMusic.setVolume(0);
            this.scene.sound.mute = true;
            this.updateMutedButton('Unmute Music');
        } else {
            this.backgroundMusic.setVolume(0.5);
            this.scene.sound.mute = false;
            this.updateMutedButton('Mute Music');
        }
    }

    updateMutedButton(text) {
        const mutedMusicButton = this.children.getByName('mutedMusicButton');
        if (mutedMusicButton) {
            mutedMusicButton.text = text;
        }
    }
*/

update(){}
    

}