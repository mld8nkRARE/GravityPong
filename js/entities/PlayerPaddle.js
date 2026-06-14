import { CONFIG } from '../core/config.js';
import { Paddle } from './Paddle.js';

export class PlayerPaddle extends Paddle {
    constructor(x) {
        super(x, true);
        this.color = CONFIG.PADDLE.COLORS.PLAYER;
    }

    update(direction) {
        super.update(direction);

        if (this.isEnlarged) {
            this.enlargeTimer--;
            if (this.enlargeTimer <= 0) {
                this.deactivateEnlarge();
            }
        }
    }

    activateEnlarge() {
        this.isEnlarged = true;
        this.height = this.baseHeight * CONFIG.PADDLE.ENLARGE_MULTIPLIER;
        this.enlargeTimer = 2 * CONFIG.HINTS.ENLARGE.duration / (1000 / CONFIG.GAME.FPS);
    }

    deactivateEnlarge() {
        this.isEnlarged = false;
        this.height = this.baseHeight;
    }
}
