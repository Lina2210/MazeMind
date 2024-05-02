import Game from "./scene/game.js";
import Menu from "./scene/menu.js";
import Options from "./scene/options.js";
import Mastermind from "./scene/mastermind.js";



const config = {
    type:Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH,
        width:1920,
        height:1080,             
    },
    physics: {
        default:"arcade",
        arcade: {
            gravity: {y:0},
            debug: true
        }
    },
    backgroundColor: '#222288',
    dom: {
        createContainer: true
    },
    //scene: [new Register()]
    scene: [new Menu(), new Options(), new Game(), new Mastermind()]
}

var index = new Phaser.Game(config)