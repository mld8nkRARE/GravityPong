// js/systems/Renderer.js

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        // Градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a0a2e');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Центральная линия
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

    drawLives(lives1, lives2) {
        const heartSize = 30;
        const spacing = 40;
        const y = 30;

        // Жизни игрока 1 (слева)
        for (let i = 0; i < CONFIG.GAME.MAX_LIVES; i++) {
            const x = 50 + i * spacing;
            this.drawHeart(x, y, heartSize, i < lives1);
        }

        // Жизни игрока 2 (справа)
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
        if (SETTINGS.showHints === false) return;
        if (!isPlayer1 && SETTINGS.gameMode === 'AI') return;
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

            // Иконка
            this.ctx.font = '20px Arial';
            this.ctx.fillText(hint.icon, x, hintY);

            // Название и количество
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = active ? '#00ff00' : '#ffffff';
            this.ctx.fillText(`${hint.name} x${count}`, x + 30, hintY);

            // Таймер если активна
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

        // Мерцание
        this.ctx.strokeStyle = 'rgba(255, 200, 50, 0.6)';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, 0, width, this.canvas.height);
    }

    drawFreezeEffect(ball) {
        // Эффект заморозки вокруг мяча
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

        // Кристаллы льда
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = ball.x + Math.cos(angle) * ball.radius * 2;
            const y = ball.y + Math.sin(angle) * ball.radius * 2;

            this.ctx.fillStyle = 'rgba(0, 204, 255, 0.6)';
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        }
    }

    drawGameOver(winner) {
        // Затемнение
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Текст победителя
        this.ctx.font = 'bold 60px Arial';
        this.ctx.fillStyle = winner === 'player1' ? CONFIG.PADDLE.COLORS.PLAYER : CONFIG.PADDLE.COLORS.AI;
        this.ctx.textAlign = 'center';

        const text = SETTINGS.gameMode === 'AI' && winner === 'player2'
            ? 'AI ПОБЕДИЛ!'
            : `ИГРОК ${winner === 'player1' ? '1' : '2'} ПОБЕДИЛ!`;

        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Подсказка
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