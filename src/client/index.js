import Game from "./scene/game.js";
import Menu from "./scene/menu.js";
import Options from "./scene/options.js";
import Mastermind from "./scene/mastermind.js";
import Registro from "./scene/registro.js";
import Login from "./scene/login.js";
import UserPerfil from "./scene/userPerfil.js";




const config = {
    type:Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode:Phaser.Scale.none,
        autoCenter:Phaser.Scale.CENTER_BOTH,
        width:1856,
        height:1088,             
    },
    physics: {
        default:"arcade",
        arcade: {
            gravity: {y:0},
            debug: true
        }
    },  
    backgroundColor: '#000',
    dom: {
        createContainer: true
    },
    
    scene: [new Menu(), new Options(), new Game(), new Mastermind(), new Registro(), new Login(), new UserPerfil()]
}

var game = new Phaser.Game(config)

export { game };