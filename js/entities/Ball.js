// js/entities/Ball.js

class Ball {
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
        // Сбрасываем скорость до начальной
        const angle = (Math.random() - 0.5) * Math.PI / 3; // ±30 градусов
        this.velocityX = direction * this.initialSpeed * Math.cos(angle);
        this.velocityY = this.initialSpeed * Math.sin(angle);

        this.trail = [];
        this.ignoreGravity = false;
        this.lastHitPaddle = null;
    }

    update() {
        // Сохраняем предыдущую позицию для следа
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > CONFIG.BALL.TRAIL_LENGTH) {
            this.trail.shift();
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Отскок от верхней и нижней стен
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY *= -1;
            if (window.audioManager) window.audioManager.playSound('wallHit');
        }
        if (this.y + this.radius > CONFIG.CANVAS.HEIGHT) {
            this.y = CONFIG.CANVAS.HEIGHT - this.radius;
            this.velocityY *= -1;
            if (window.audioManager) window.audioManager.playSound('wallHit');
        }
    }

    draw(ctx) {
        // Рисуем след
        ctx.shadowBlur = 0;
        this.trail.forEach((point, index) => {
            const alpha = (index / this.trail.length) * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
        });

        // Рисуем мяч
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

window.Ball = Ball;