import { CONFIG } from '../core/config.js';
import { HintManager } from '../entities/Hint.js';
import { dispatchGameEvent, EVENT_TYPES } from '../core/events.js';

export class HintSystem {
    constructor() {
        this.hintManager1 = new HintManager('player1');
        this.hintManager2 = new HintManager('player2');
    }

    update() {
        this.hintManager1.update();
        this.hintManager2.update();
    }

    activate(player, type, audioManager) {
        const manager = player === 'player1' ? this.hintManager1 : this.hintManager2;
        if (!manager.activate(type)) return false;

        dispatchGameEvent(EVENT_TYPES.HINT_USED, {
            player,
            hintType: type,
            remainingUses: manager.hints[type]
        });

        if (audioManager) {
            audioManager.playSound('powerup');
        }

        return true;
    }

    getManager(player) {
        return player === 'player1' ? this.hintManager1 : this.hintManager2;
    }

    applyEffect(player, type, ball, paddle) {
        if (type === 'freeze') {
            this.applyFreeze(ball);
        } else if (type === 'enlarge') {
            this.applyEnlarge(paddle);
        }
    }

    applyFreeze(ball) {
        if (!ball) return;

        ball.velocityX *= 0.3;
        ball.velocityY *= 0.3;
        ball.ignoreGravity = true;
        ball.isFrozen = true;

        setTimeout(() => {
            if (ball) {
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

    applyEnlarge(paddle) {
        if (paddle && typeof paddle.activateEnlarge === 'function') {
            paddle.activateEnlarge();
        }
    }

    checkShield(scorer, ball) {
        if (scorer === 'player2' && this.hintManager1.activeEffects.shield) {
            this.hintManager1.activeEffects.shield = false;
            ball.reset(-1);
            return true;
        }
        if (scorer === 'player1' && this.hintManager2.activeEffects.shield) {
            this.hintManager2.activeEffects.shield = false;
            ball.reset(1);
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
