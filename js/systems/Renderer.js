import { CONFIG } from '../core/config.js';
import { settings } from '../core/settings.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a0a2e');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawCenterLine();
    }

    drawCenterLine() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawBall(ball) {
        this.ctx.shadowBlur = 0;
        ball.trail.forEach((point, index) => {
            const alpha = (index / ball.trail.length) * 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, ball.radius * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawPaddle(paddle) {
        this.ctx.fillStyle = paddle.color;
        this.ctx.shadowBlur = paddle.isEnlarged ? 25 : 15;
        this.ctx.shadowColor = paddle.color;

        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        this.ctx.shadowBlur = 0;
    }

    drawPlanet(planet) {
        const gradient = this.ctx.createRadialGradient(
            planet.x, planet.y, planet.radius,
            planet.x, planet.y, planet.radius * planet.gravityStrength
        );
        gradient.addColorStop(0, `hsla(${planet.hue}, 80%, 60%, 0.3)`);
        gradient.addColorStop(0.5, `hsla(${planet.hue}, 80%, 50%, 0.1)`);
        gradient.addColorStop(1, `hsla(${planet.hue}, 80%, 40%, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius * planet.gravityStrength, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = `hsl(${planet.hue}, 80%, 60%)`;
        this.ctx.fillStyle = `hsl(${planet.hue}, 70%, 50%)`;
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawLives(lives1, lives2) {
        const heartSize = 30;
        const spacing = 40;
        const y = 30;

        for (let i = 0; i < CONFIG.GAME.MAX_LIVES; i++) {
            const x = 50 + i * spacing;
            this.drawHeart(x, y, heartSize, i < lives1);
        }

        for (let i = 0; i < CONFIG.GAME.MAX_LIVES; i++) {
            const x = this.canvas.width - 50 - (CONFIG.GAME.MAX_LIVES - 1 - i) * spacing;
            this.drawHeart(x, y, heartSize, i < lives2);
        }
    }

    drawHeart(x, y, size, filled) {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.moveTo(0, size / 4);
        ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 8, 0, size);
        ctx.bezierCurveTo(size, size / 8, size / 2, -size / 4, 0, size / 4);

        if (filled) {
            ctx.fillStyle = '#ff4466';
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff4466';
            ctx.fill();
        } else {
            ctx.strokeStyle = 'rgba(255, 68, 102, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    drawHints(hintManager, isPlayer1) {
        if (settings.showHints === false) return;
        if (!isPlayer1 && settings.gameMode === 'AI') return;
        const ctx = this.ctx;
        const x = isPlayer1 ? 20 : CONFIG.CANVAS.WIDTH - 220;
        const y = CONFIG.CANVAS.HEIGHT - 120;

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Подсказки:', x, y);

        const hints = [
            { type: 'freeze', icon: '⏸️', name: 'Заморозка' },
            { type: 'shield', icon: '🛡️', name: 'Щит' },
            { type: 'enlarge', icon: '⬆️', name: 'Увеличение' }
        ];

        hints.forEach((hint, index) => {
            const hintY = y + 30 + index * 35;
            const count = hintManager.hints[hint.type];
            const active = hintManager.activeEffects[hint.type];

            this.ctx.font = '20px Arial';
            this.ctx.fillText(hint.icon, x, hintY);

            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = active ? '#00ff00' : '#ffffff';
            this.ctx.fillText(`${hint.name} x${count}`, x + 30, hintY);

            if (active) {
                const remaining = hintManager.getRemainingTime(hint.type);
                this.ctx.fillStyle = '#ffaa00';
                this.ctx.fillText(`(${remaining}s)`, x + 150, hintY);
            }
        });
    }

    drawShield(paddle, isPlayer1) {
        const x = isPlayer1 ? 0 : this.canvas.width - 25;
        const width = 25;

        const gradient = this.ctx.createLinearGradient(
            x, 0, x + (isPlayer1 ? width : -width), 0
        );
        gradient.addColorStop(0, 'rgba(255, 170, 0, 0.25)');
        gradient.addColorStop(1, 'rgba(255, 170, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, 0, width, this.canvas.height);

        this.ctx.strokeStyle = 'rgba(255, 200, 50, 0.6)';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, 0, width, this.canvas.height);
    }

    drawFreezeEffect(ball) {
        const gradient = this.ctx.createRadialGradient(
            ball.x, ball.y, ball.radius,
            ball.x, ball.y, ball.radius * 3
        );
        gradient.addColorStop(0, 'rgba(0, 204, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 204, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius * 3, 0, Math.PI * 2);
        this.ctx.fill();

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = ball.x + Math.cos(angle) * ball.radius * 2;
            const y = ball.y + Math.sin(angle) * ball.radius * 2;

            this.ctx.fillStyle = 'rgba(0, 204, 255, 0.6)';
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        }
    }

    drawGameOver(winner) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 60px Arial';
        this.ctx.fillStyle = winner === 'player1' ? CONFIG.PADDLE.COLORS.PLAYER : CONFIG.PADDLE.COLORS.AI;
        this.ctx.textAlign = 'center';

        const text = settings.gameMode === 'AI' && winner === 'player2'
            ? 'AI ПОБЕДИЛ!'
            : `ИГРОК ${winner === 'player1' ? '1' : '2'} ПОБЕДИЛ!`;

        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 50);

        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Нажмите ENTER для новой игры', this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.fillText('или ESC для выхода в меню', this.canvas.width / 2, this.canvas.height / 2 + 90);
        this.ctx.shadowBlur = 0;
        this.ctx.textAlign = 'left';
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('Нажмите SPACE для продолжения', this.canvas.width / 2, this.canvas.height / 2 + 50);

        this.ctx.textAlign = 'left';
    }
}
