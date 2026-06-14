import { CONFIG } from '../core/config.js';
import { settings } from '../core/settings.js';

export class Statistics {
    constructor() {
        this.key = 'gravityPongStats';
        this.history = this.loadHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem(this.key);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.history));
        } catch (e) { }
    }

    saveResult(winner, lives1, lives2, mode, difficulty = null) {
        const result = {
            date: new Date().toISOString(),
            winner: winner,
            score1: CONFIG.GAME.MAX_LIVES - lives1,
            score2: CONFIG.GAME.MAX_LIVES - lives2,
            mode: mode,
            difficulty: difficulty || settings.difficulty || '—',
            duration: Math.floor((Date.now() - (window.gameStartTime || Date.now())) / 1000)
        };

        this.history.unshift(result);
        if (this.history.length > 30) this.history.pop();

        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    getWinStats() {
        const total = this.history.length;
        const player1Wins = this.history.filter(r => r.winner === 'player1').length;
        const player2Wins = this.history.filter(r => r.winner === 'player2').length;

        return { player1: player1Wins, player2: player2Wins, total };
    }

    clearAll() {
        this.history = [];
        localStorage.removeItem(this.key);
    }
}

export const statistics = new Statistics();
