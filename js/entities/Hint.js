import { CONFIG } from '../core/config.js';

export class HintManager {
    constructor(player) {
        this.player = player;
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

        this.timers = {
            freeze: 0,
            shield: 0,
            enlarge: 0
        };

        this.consecutiveGoals = 0;
        this.lastGoalTime = Date.now();
        this.lastRewardTime = Date.now();
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

    addRandomHint() {
        const types = ['freeze', 'shield', 'enlarge'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        this.hints[randomType]++;
        return randomType;
    }

    onGoalScored() {
        this.consecutiveGoals++;
        this.lastGoalTime = Date.now();

        if (this.consecutiveGoals >= 2) {
            this.consecutiveGoals = 0;
            return this.addRandomHint();
        }
        return null;
    }

    onGoalConceded() {
        this.consecutiveGoals = 0;
        this.lastGoalTime = Date.now();
    }

    checkSurvivalReward() {
        const now = Date.now();
        const survivalTime = now - this.lastGoalTime;

        if (survivalTime >= 30000 && (now - this.lastRewardTime) >= 30000) {
            this.lastRewardTime = now;
            return this.addRandomHint();
        }
        return null;
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

        this.consecutiveGoals = 0;
        this.lastGoalTime = Date.now();
        this.lastRewardTime = Date.now();
    }
}
