// js/entities/Paddle.js

class Paddle {
    constructor(x, isPlayer1 = true) {
        this.x = x;
        this.y = CONFIG.CANVAS.HEIGHT / 2 - CONFIG.PADDLE.HEIGHT / 2;
        this.width = CONFIG.PADDLE.WIDTH;
        this.height = CONFIG.PADDLE.HEIGHT;
        this.baseHeight = CONFIG.PADDLE.HEIGHT;
        this.speed = CONFIG.PADDLE.SPEED;
        this.isPlayer1 = isPlayer1;
        this.shape = 'rectangle';
        this.color = isPlayer1 ? CONFIG.PADDLE.COLORS.PLAYER : CONFIG.PADDLE.COLORS.AI;

        this.isEnlarged = false;
        this.enlargeTimer = 0;
    }

    update(direction) {
        this.y += direction * this.speed;

        // Wrap around
        if (this.y > CONFIG.CANVAS.HEIGHT) this.y = -this.height;
        if (this.y + this.height < 0) this.y = CONFIG.CANVAS.HEIGHT;


    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.isEnlarged ? 25 : 15;
        ctx.shadowColor = this.color;

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.shadowBlur = 0;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerY: this.y + this.height / 2
        };
    }
}