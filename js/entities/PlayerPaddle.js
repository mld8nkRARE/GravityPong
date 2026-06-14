import { CONFIG } from '../core/config.js';
import { Paddle } from './Paddle.js';

export class PlayerPaddle extends Paddle {
    constructor(x, isPlayer1 = true) {
        super(x, isPlayer1);
        this.enlargeEndTime = 0;
    }

    update(direction) {
        super.update(direction);

        if (this.isEnlarged && Date.now() >= this.enlargeEndTime) {
            this.deactivateEnlarge();
        }
    }

    activateEnlarge() {
        this.isEnlarged = true;
        this.height = this.baseHeight * CONFIG.PADDLE.ENLARGE_MULTIPLIER;
        this.enlargeEndTime = Date.now() + CONFIG.HINTS.ENLARGE.duration;
    }

    deactivateEnlarge() {
        this.isEnlarged = false;
        this.height = this.baseHeight;
    }
}
