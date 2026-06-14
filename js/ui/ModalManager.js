export class ModalManager {
    constructor(audioManager) {
        this.currentModal = null;
        this.audioManager = audioManager;
    }

    show(html, onClose = null) {
        this.close();

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);
        this.currentModal = modalContainer;
        this.attachCloseHandlers(modalContainer, onClose);
    }

    close() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    attachCloseHandlers(container, onClose) {
        container.querySelectorAll('#modal-close-btn, #stats-close').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.audioManager) this.audioManager.playSound('buttonClick');
                this.close();
                if (onClose) onClose();
            });
        });

        const overlay = container.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                    if (onClose) onClose();
                }
            });
        }
    }

    showHowToPlay(dataLoader) {
        const data = dataLoader.getRules();
        const rulesList = dataLoader.getRulesList();

        const html = `
            <div id="howtoplay-modal" class="modal-overlay">
                <div class="modal-content">
                    <h2>${data.gameTitle || 'GRAVITY PONG'} — Как играть</h2>
                    <p>${data.description || 'Описание игры'}</p>
                    
                    <h3>Правила:</h3>
                    <ul class="rules-list">
                        ${rulesList.map(rule => `<li>${rule}</li>`).join('')}
                    </ul>

                    <div class="modal-buttons">
                        <button class="menu-btn" id="modal-close-btn">Закрыть</button>
                    </div>
                </div>
            </div>`;

        this.show(html);
    }

    showStatistics(statistics, onClear = null) {
        const stats = statistics.getHistory();
        const winStats = statistics.getWinStats();

        const html = `
            <div id="stats-modal" class="modal-overlay">
                <div class="modal-content stats-modal">
                    <h2>Статистика</h2>
                    
                    <div class="stats-summary">
                        <div>Всего игр: <strong>${winStats.total}</strong></div>
                        <div>Побед Игрока 1: <strong>${winStats.player1}</strong></div>
                        <div>Побед Игрока 2 / AI: <strong>${winStats.player2}</strong></div>
                    </div>

                    <h3>Последние матчи</h3>
                    <div class="stats-list">
                        ${stats.length === 0 ?
                '<p style="color:#888; text-align:center; padding:20px;">Пока нет завершённых игр</p>' :
                stats.map(game => `
                                <div class="stat-item">
                                    <span>${new Date(game.date).toLocaleDateString('ru-RU')}</span>
                                    <span>${game.mode} ${game.difficulty ? `(${game.difficulty})` : ''}</span>
                                    <span class="${game.winner === 'player1' ? 'win' : 'lose'}">
                                        ${game.winner === 'player1' ? 'Победа 1' : 'Победа 2'}
                                    </span>
                                </div>
                            `).join('')}
                    </div>

                    <div class="modal-buttons">
                        <button class="menu-btn" id="stats-clear">Очистить статистику</button>
                        <button class="menu-btn" id="stats-close">Закрыть</button>
                    </div>
                </div>
            </div>`;

        this.show(html);

        const clearBtn = document.getElementById('stats-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (this.audioManager) this.audioManager.playSound('buttonClick');
                if (confirm('Вы уверены, что хотите очистить всю статистику?')) {
                    statistics.clearAll();
                    this.close();
                    setTimeout(() => this.showStatistics(statistics, onClear), 150);
                }
            });
        }
    }
}
