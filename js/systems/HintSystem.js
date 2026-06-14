// js/systems/HintSystem.js

class HintSystem {
    constructor() {
        this.hintManager1 = new HintManager('player1');
        this.hintManager2 = new HintManager('player2');
    }

    update() {
        this.hintManager1.update();
        this.hintManager2.update();
    }

    activate(player, type) {
        const manager = player === 'player1' ? this.hintManager1 : this.hintManager2;
        if (!manager.activate(type)) return false;

        // Отправляем событие
        dispatchGameEvent(EVENT_TYPES.HINT_USED, {
            player,
            hintType: type,
            remainingUses: manager.hints[type]
        });

        if (window.audioManager) {
            window.audioManager.playSound('powerup');
        }

        return true;
    }

    getManager(player) {
        return player === 'player1' ? this.hintManager1 : this.hintManager2;
    }

    // Применение эффектов
    applyEffect(player, type, game) {
        if (type === 'freeze') {
            this.applyFreeze(game);
        } else if (type === 'enlarge') {
            this.applyEnlarge(player, game);
        }
        // shield применяется не сразу, а при получении гола (см. handleGoal)
    }

    applyFreeze(game) {
        const ball = game.ball;
        if (!ball) return;

        ball.velocityX *= 0.3;
        ball.velocityY *= 0.3;
        ball.ignoreGravity = true;
        ball.isFrozen = true;

        setTimeout(() => {
            if (ball && game.isRunning) {
                const currentSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
                const minSpeed = 3;
                const scale = currentSpeed > 0 ? minSpeed / currentSpeed : 1;

                ball.velocityX *= scale;
                ball.velocityY *= scale;
                ball.ignoreGravity = false;
                ball.isFrozen = false;
            }
        }, CONFIG.HINTS.FREEZE.duration);
    }

    applyEnlarge(player, game) {
        const paddle = player === 'player1' ? game.paddle1 : game.paddle2;
        if (typeof paddle.activateEnlarge === 'function') {
            paddle.activateEnlarge();
        }
    }

    // Проверка щита при голе
    checkShield(scorer, game) {
        if (scorer === 'player2' && this.hintManager1.activeEffects.shield) {
            this.hintManager1.activeEffects.shield = false;
            game.ball.reset(-1);
            return true;
        }
        if (scorer === 'player1' && this.hintManager2.activeEffects.shield) {
            this.hintManager2.activeEffects.shield = false;
            game.ball.reset(1);
            return true;
        }
        return false;
    }

    reset() {
        this.hintManager1.reset();
        this.hintManager2.reset();
    }

    drawHints(renderer) {
        renderer.drawHints(this.hintManager1, true);
        renderer.drawHints(this.hintManager2, false);
    }
    isFreezeActive() {
        return this.hintManager1.activeEffects.freeze ||
            this.hintManager2.activeEffects.freeze;
    }
}

window.HintSystem = HintSystem;