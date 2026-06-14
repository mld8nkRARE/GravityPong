import { CONFIG } from '../core/config.js';
import { dispatchGameEvent, EVENT_TYPES } from '../core/events.js';

export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.BALL.RADIUS;
        this.velocityX = 0;
        this.velocityY = 0;
        this.initialSpeed = CONFIG.BALL.INITIAL_SPEED;
        this.trail = [];
        this.ignoreGravity = false;
        this.lastHitPaddle = null;
        this.isFrozen = false;
    }

    reset(direction = 1) {
        this.x = CONFIG.CANVAS.WIDTH / 2;
        this.y = CONFIG.CANVAS.HEIGHT / 2;
        this.initialSpeed = CONFIG.BALL.INITIAL_SPEED;

        const angle = (Math.random() - 0.5) * Math.PI / 12;
        this.velocityX = direction * this.initialSpeed * Math.cos(angle);
        this.velocityY = this.initialSpeed * Math.sin(angle);

        this.trail = [];
        this.ignoreGravity = false;
        this.lastHitPaddle = null;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > CONFIG.BALL.TRAIL_LENGTH) {
            this.trail.shift();
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY *= -1;
            dispatchGameEvent(EVENT_TYPES.WALL_HIT);
        }
        if (this.y + this.radius > CONFIG.CANVAS.HEIGHT) {
            this.y = CONFIG.CANVAS.HEIGHT - this.radius;
            this.velocityY *= -1;
            dispatchGameEvent(EVENT_TYPES.WALL_HIT);
        }
    }
}
