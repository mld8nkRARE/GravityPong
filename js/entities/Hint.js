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

        this.timerStarts = {
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
        this.timers[hintType] = duration;
        this.timerStarts[hintType] = Date.now();

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

        if (survivalTime >= 20000 && (now - this.lastRewardTime) >= 20000) {
            this.lastRewardTime = now;
            return this.addRandomHint();
        }
        return null;
    }

    update() {
        const now = Date.now();
        Object.keys(this.activeEffects).forEach(hintType => {
            if (this.activeEffects[hintType]) {
                const elapsed = now - this.timerStarts[hintType];
                if (elapsed >= this.timers[hintType]) {
                    this.activeEffects[hintType] = false;
                }
            }
        });
    }

    getRemainingTime(hintType) {
        if (!this.activeEffects[hintType]) return 0;
        const elapsed = Date.now() - this.timerStarts[hintType];
        const remaining = this.timers[hintType] - elapsed;
        return Math.max(0, Math.ceil(remaining / 1000));
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

        this.timers = {
            freeze: 0,
            shield: 0,
            enlarge: 0
        };

        this.timerStarts = {
            freeze: 0,
            shield: 0,
            enlarge: 0
        };

        this.consecutiveGoals = 0;
        this.lastGoalTime = Date.now();
        this.lastRewardTime = Date.now();
    }
}
