import { CONFIG } from '../core/config.js';

export class Planet {
    constructor() {
        this.radius = 35 + Math.random() * 30;
        this.x = CONFIG.CANVAS.WIDTH * (0.3 + Math.random() * 0.4);
        this.y = CONFIG.CANVAS.HEIGHT * (0.2 + Math.random() * 0.6);

        this.gravity = 0.8 + Math.random() * 0.4;
        this.gravityStrength = 3 + Math.random() * 2;

        this.velocityX = (Math.random() - 0.5) * 0.5;
        this.velocityY = (Math.random() - 0.5) * 0.5;

        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        const margin = 100;
        if (this.x - this.radius < margin || this.x + this.radius > CONFIG.CANVAS.WIDTH - margin) {
            this.velocityX *= -1;
        }
        if (this.y - this.radius < margin || this.y + this.radius > CONFIG.CANVAS.HEIGHT - margin) {
            this.velocityY *= -1;
        }

        this.gravity += (Math.random() - 0.5) * 0.02;
        this.gravity = Math.max(0.5, Math.min(1.5, this.gravity));
    }
}
