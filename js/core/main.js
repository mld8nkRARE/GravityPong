import { CONFIG } from './config.js';
import { AudioManager } from '../systems/Audio.js';
import { InputManager } from '../systems/InputManager.js';
import { Menu } from '../ui/Menu.js';
import { Game } from './game.js';
import { statistics } from '../utils/Statistics.js';

let game = null;
let menu = null;
let audioManager = null;
let musicStarted = false;

function init() {
    const canvas = document.getElementById('gameCanvas');

    canvas.width = CONFIG.CANVAS.WIDTH;
    canvas.height = CONFIG.CANVAS.HEIGHT;

    canvas.style.display = 'none';

    audioManager = new AudioManager();
    audioManager.playMenuMusic();

    document.addEventListener('click', startMusicOnce);
    document.addEventListener('keydown', startMusicOnce);

    const inputManager = new InputManager();

    menu = new Menu(audioManager, statistics);

    game = new Game(canvas, inputManager, audioManager, statistics);
    game.setMenu(menu);
    menu.setGame(game);
}

function startMusicOnce() {
    if (!musicStarted && audioManager) {
        audioManager.playMenuMusic();
        musicStarted = true;

        document.removeEventListener('click', startMusicOnce);
        document.removeEventListener('keydown', startMusicOnce);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    init();
});
