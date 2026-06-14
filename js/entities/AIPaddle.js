import { CONFIG } from '../core/config.js';
import { Paddle } from './Paddle.js';

export class AIPaddle extends Paddle {
    constructor(x) {
        super(x, false);
        this.color = CONFIG.PADDLE.COLORS.AI;
    }
}
