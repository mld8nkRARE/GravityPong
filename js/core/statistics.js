// js/utils/Statistics.js

class Statistics {
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
            score1: CONFIG.GAME.MAX_LIVES - lives1,  // сколько жизней осталось у победителя
            score2: CONFIG.GAME.MAX_LIVES - lives2,
            mode: mode,
            difficulty: difficulty || SETTINGS.difficulty || '—',
            duration: Math.floor((Date.now() - (window.gameStartTime || Date.now())) / 1000)
        };

        this.history.unshift(result);
        if (this.history.length > 30) this.history.pop();

        this.saveHistory();
        console.log('📊 Результат сохранён:', result);
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
        console.log('🗑️ Статистика полностью очищена');
    }
}

// Делаем один экземпляр на всю игру
if (!window.gameStatistics) {
    window.gameStatistics = new Statistics();
}

window.Statistics = Statistics;