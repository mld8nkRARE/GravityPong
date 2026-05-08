// js/entities/Hint.js

class HintManager {
    constructor(player) {
        this.player = player; // 'player1' или 'player2'
        this.hints = {
            freeze: CONFIG.HINTS.FREEZE.uses,
            shield: CONFIG.HINTS.SHIELD.uses,
            enlarge: CONFIG.HINTS.ENLARGE.uses
        };

        // Активные эффекты
        this.activeEffects = {
            freeze: false,
            shield: false,
            enlarge: false
        };

        this.timers = {
            freeze: 0,
            shield: 0,
            enlarge: 0
        };
    }

    canUse(hintType) {
        return this.hints[hintType] > 0 && !this.activeEffects[hintType];
    }

    activate(hintType) {
        if (!this.canUse(hintType)) return false;

        this.hints[hintType]--;
        this.activeEffects[hintType] = true;

        const duration = CONFIG.HINTS[hintType.toUpperCase()].duration;
        this.timers[hintType] = duration / (1000 / CONFIG.GAME.FPS);

        return true;
    }

    update() {
        Object.keys(this.activeEffects).forEach(hintType => {
            if (this.activeEffects[hintType]) {
                this.timers[hintType]--;

                if (this.timers[hintType] <= 0) {
                    this.activeEffects[hintType] = false;
                }
            }
        });
    }

    getRemainingTime(hintType) {
        if (!this.activeEffects[hintType]) return 0;
        return Math.ceil(this.timers[hintType] / CONFIG.GAME.FPS);
    }

    reset() {
        this.hints = {
            freeze: CONFIG.HINTS.FREEZE.uses,
            shield: CONFIG.HINTS.SHIELD.uses,
            enlarge: CONFIG.HINTS.ENLARGE.uses
        };

        this.activeEffects = {
            freeze: false,
            shield: false,
            enlarge: false
        };
    }
}