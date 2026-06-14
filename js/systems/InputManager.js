import { CONFIG } from '../core/config.js';

export class InputManager {
    constructor() {
        this.keys = {};
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    isPressed(code) {
        return !!this.keys[code];
    }

    getPlayer1Direction() {
        let dir = 0;
        if (this.isPressed(CONFIG.CONTROLS.PLAYER1.UP)) dir = -1;
        if (this.isPressed(CONFIG.CONTROLS.PLAYER1.DOWN)) dir = 1;
        return dir;
    }

    getPlayer2Direction() {
        let dir = 0;
        if (this.isPressed(CONFIG.CONTROLS.PLAYER2.UP)) dir = -1;
        if (this.isPressed(CONFIG.CONTROLS.PLAYER2.DOWN)) dir = 1;
        return dir;
    }

    isHintPressed(player, hintType) {
        if (player === 'player1') {
            const controls = CONFIG.CONTROLS.PLAYER1;
            if (hintType === 'freeze') return this.isPressed(controls.HINT1);
            if (hintType === 'shield') return this.isPressed(controls.HINT2);
            if (hintType === 'enlarge') return this.isPressed(controls.HINT3);
        } else {
            const controls = CONFIG.CONTROLS.PLAYER2;
            if (hintType === 'freeze') return this.isPressed(controls.HINT1);
            if (hintType === 'shield') return this.isPressed(controls.HINT2);
            if (hintType === 'enlarge') return this.isPressed(controls.HINT3);
        }
        return false;
    }
}
