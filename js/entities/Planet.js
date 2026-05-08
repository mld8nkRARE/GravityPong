// js/entities/Planet.js

class Planet {
    constructor() {
        this.radius = 35 + Math.random() * 30; // 30-60
        this.x = CONFIG.CANVAS.WIDTH * (0.3 + Math.random() * 0.4);
        this.y = CONFIG.CANVAS.HEIGHT * (0.2 + Math.random() * 0.6);

        this.gravity = 0.8 + Math.random() * 0.4; // 0.8-1.2
        this.gravityStrength = 3 + Math.random() * 2; // 3-5

        this.velocityX = (Math.random() - 0.5) * 0.5;
        this.velocityY = (Math.random() - 0.5) * 0.5;

        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Отскок от стен
        const margin = 100;
        if (this.x - this.radius < margin || this.x + this.radius > CONFIG.CANVAS.WIDTH - margin) {
            this.velocityX *= -1;
        }
        if (this.y - this.radius < margin || this.y + this.radius > CONFIG.CANVAS.HEIGHT - margin) {
            this.velocityY *= -1;
        }

        // Медленное изменение силы гравитации
        this.gravity += (Math.random() - 0.5) * 0.02;
        this.gravity = Math.max(0.5, Math.min(1.5, this.gravity));
    }

    draw(ctx) {
        // Гравитационное поле
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius,
            this.x, this.y, this.radius * this.gravityStrength
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0.3)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 50%, 0.1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.gravityStrength, 0, Math.PI * 2);
        ctx.fill();

        // Планета
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${this.hue}, 80%, 60%)`;
        ctx.fillStyle = `hsl(${this.hue}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

window.Planet = Planet;