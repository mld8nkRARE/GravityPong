// js/ui/Menu.js

class Menu {
  constructor() {
    this.dataLoader = new DataLoader();
    this.statistics = window.gameStatistics;
    this.createMenuHTML();
    this.attachEventListeners();
    this.loadGameData();
  }

  createMenuHTML() {
    const menuContainer = document.getElementById('menu');

    menuContainer.innerHTML = `
            <div id="main-menu" class="menu-screen active">
                <h1 class="game-title">GRAVITY PONG</h1>
                <div class="menu-buttons">
                    <button class="menu-btn" id="btn-play">Играть</button>
                    <button class="menu-btn" id="btn-howtoplay">Как играть</button>
                    <button class="menu-btn" id="btn-stats">Статистика</button>
                    <button class="menu-btn" id="btn-settings">Настройки</button>
                    <button class="menu-btn" id="btn-controls">Управление</button>
                </div>
            </div>

            <div id="mode-menu" class="menu-screen">
                <h2>Выбор режима</h2>
                <div class="mode-selection">
                    <div class="mode-card" data-mode="AI">
                        <div class="mode-icon">🤖</div>
                        <h3>Против AI</h3>
                        <p>Сразись с компьютером</p>
                    </div>
                    <div class="mode-card" data-mode="PVP">
                        <div class="mode-icon">👥</div>
                        <h3>2 игрока</h3>
                        <p>Играйте вместе</p>
                    </div>
                </div>
                <button class="menu-btn back-btn" id="btn-back-mode">Назад</button>
            </div>

            <div id="difficulty-menu" class="menu-screen">
                <h2>Выбор сложности</h2>
                <div class="difficulty-selection">
                    <div class="difficulty-card" data-difficulty="EASY">
                        <div class="difficulty-icon">👶</div>
                        <h3>Легко</h3>
                        <ul><li>Медленная реакция</li><li>Не предсказывает траекторию</li><li>Не использует подсказки</li></ul>
                    </div>
                    <div class="difficulty-card selected" data-difficulty="MEDIUM">
                        <div class="difficulty-icon">🧑</div>
                        <h3>Средне</h3>
                        <ul><li>Нормальная реакция</li><li>Предсказывает траекторию</li><li>Редко использует подсказки</li></ul>
                    </div>
                    <div class="difficulty-card" data-difficulty="HARD">
                        <div class="difficulty-icon">💀</div>
                        <h3>Сложно</h3>
                        <ul><li>Быстрая реакция</li><li>Точное предсказание</li><li>Умно использует подсказки</li></ul>
                    </div>
                </div>
                <button class="menu-btn back-btn" id="btn-back-difficulty">Назад</button>
            </div>


            <div id="settings-menu" class="menu-screen">
                <h2>Настройки</h2>
                <div class="settings-container">
                    <div class="setting-item">
                        <label for="planet-count">Количество планет:</label>
                        <div class="slider-container">
                            <input type="range" id="planet-count" min="2" max="4" value="3">
                            <span id="planet-count-value">3</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label for="speed-increase">Ускорение мяча:</label>
                        <div class="slider-container">
                            <input type="range" id="speed-increase" min="1" max="15" value="5">
                            <span id="speed-increase-value">+5%</span>
                        </div>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="sound-toggle" checked>
                            Звуковые эффекты
                        </label>
                    </div>
                    <div class="setting-item">
                        <label for="sound-volume">Громкость звуков:</label>
                        <div class="slider-container">
                            <input type="range" id="sound-volume" min="0" max="100" value="50">
                            <span id="sound-volume-value">50%</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="music-toggle" checked>
                            Фоновая музыка
                        </label>
                    </div>
                    <div class="setting-item">
                        <label for="music-volume">Громкость музыки:</label>
                        <div class="slider-container">
                            <input type="range" id="music-volume" min="0" max="100" value="30">
                            <span id="music-volume-value">30%</span>
                        </div>
                    </div>
                </div>
                <button class="menu-btn back-btn" id="btn-back-settings">Назад</button>
            </div>

            <div id="controls-menu" class="menu-screen">
                <h2>Управление</h2>
                <div class="controls-container">
                    <div class="controls-section">
                        <h3>Игрок 1</h3>
                        <div class="control-item"><span class="key">W</span><span class="action">Вверх</span></div>
                        <div class="control-item"><span class="key">S</span><span class="action">Вниз</span></div>
                        <div class="control-item"><span class="key">1</span><span class="action">Заморозка</span></div>
                        <div class="control-item"><span class="key">2</span><span class="action">Щит</span></div>
                        <div class="control-item"><span class="key">3</span><span class="action">Увеличение</span></div>
                    </div>
                    <div class="controls-section">
                        <h3>Игрок 2</h3>
                        <div class="control-item"><span class="key">↑</span><span class="action">Вверх</span></div>
                        <div class="control-item"><span class="key">↓</span><span class="action">Вниз</span></div>
                        <div class="control-item"><span class="key">7</span><span class="action">Заморозка</span></div>
                        <div class="control-item"><span class="key">8</span><span class="action">Щит</span></div>
                        <div class="control-item"><span class="key">9</span><span class="action">Увеличение</span></div>
                    </div>
                </div>
                <button class="menu-btn back-btn" id="btn-back-controls">Назад</button>
            </div>
        `;


  }





  attachEventListeners() {
    document.getElementById('btn-play').addEventListener('click', () => this.showScreen('mode-menu'));
    document.getElementById('btn-settings').addEventListener('click', () => this.showScreen('settings-menu'));
    document.getElementById('btn-controls').addEventListener('click', () => this.showScreen('controls-menu'));
    document.getElementById('btn-howtoplay').addEventListener('click', () => { this.showHowToPlay(); });
    document.getElementById('btn-stats').addEventListener('click', () => { this.showStatistics(); });
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        SETTINGS.gameMode = card.dataset.mode;
        setTimeout(() => {
          if (SETTINGS.gameMode === 'AI') {
            this.showScreen('difficulty-menu');
          } else {
            this.startGame(); // сразу стартуем PvP
          }
        }, 150);
      });
    });

    document.querySelectorAll('.difficulty-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        SETTINGS.difficulty = card.dataset.difficulty;
        setTimeout(() => this.startGame(), 150);
      });
    });

    document.addEventListener('click', (e) => {
      const card = e.target.closest('.paddle-shape-card');
      if (card) {
        const player = parseInt(card.dataset.player);
        const shape = card.dataset.shape;
        document.querySelectorAll(`#player${player}-shapes .paddle-shape-card`).forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        if (player === 1) SETTINGS.player1Shape = shape;
        else SETTINGS.player2Shape = shape;
      }
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.id;
        if (id === 'btn-back-mode') this.showScreen('main-menu');
        else if (id === 'btn-back-difficulty') this.showScreen('mode-menu');
        else if (id === 'btn-back-paddle') this.showScreen(SETTINGS.gameMode === 'AI' ? 'difficulty-menu' : 'mode-menu');
        else this.showScreen('main-menu');
      });
    });

    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    // Настройки
    document.getElementById('planet-count').addEventListener('input', (e) => {
      SETTINGS.planetCount = parseInt(e.target.value);
      document.getElementById('planet-count-value').textContent = e.target.value;
    });

    document.getElementById('speed-increase').addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      SETTINGS.speedIncrease = 1 + val / 100;
      document.getElementById('speed-increase-value').textContent = `+${val}%`;
    });

    // Звуковые настройки
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
      if (window.audioManager) {
        window.audioManager.toggleSound();
      }
    });

    document.getElementById('sound-volume').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      document.getElementById('sound-volume-value').textContent = `${value}%`;
      if (window.audioManager) {
        window.audioManager.setSoundVolume(value / 100);
      }
    });

    document.getElementById('music-toggle').addEventListener('change', (e) => {
      if (window.audioManager) {
        window.audioManager.toggleMusic();
      }
    });

    document.getElementById('music-volume').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      document.getElementById('music-volume-value').textContent = `${value}%`;
      if (window.audioManager) {
        window.audioManager.setMusicVolume(value / 100);
      }
    });
  }

  showScreen(screenId) {
    // Убираем все active и скрываем все экраны
    const allScreens = document.querySelectorAll('.menu-screen');
    allScreens.forEach(screen => {
      screen.classList.remove('active');
      screen.style.display = 'none';
    });

    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      targetScreen.style.display = 'flex';
    } else {
      // Fallback на главное меню
      const mainMenu = document.getElementById('main-menu');
      if (mainMenu) {
        mainMenu.classList.add('active');
        mainMenu.style.display = 'flex';
      }
    }
  }

  startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    if (window.audioManager) {
      window.audioManager.playGameMusic();
    }
    if (window.game) {
      window.game.stop();
      window.game.init();
      window.game.start();
    }
  }

  show() {
    document.getElementById('menu').style.display = 'flex';
    this.showScreen('main-menu');
  }
  async loadGameData() {
    const data = await this.dataLoader.loadRules();
    console.log('Загружены данные игры:', data);
  }
  showHowToPlay() {
    const data = this.dataLoader.getRules();
    const rulesList = this.dataLoader.getRulesList();

    // Удаляем предыдущее модальное окно, если есть
    const oldModal = document.getElementById('howtoplay-modal');
    if (oldModal) oldModal.remove();

    const modalHTML = `
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
            </div>
        `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Обработчик закрытия
    document.getElementById('modal-close-btn').addEventListener('click', () => {
      modalContainer.remove();
    });

    // Закрытие по клику на фон
    modalContainer.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target === modalContainer.querySelector('.modal-overlay')) {
        modalContainer.remove();
      }
    });
  }
  showStatistics() {
    const stats = this.statistics.getHistory();
    const winStats = this.statistics.getWinStats();

    let html = `
            <div id="stats-modal" class="modal-overlay">
                <div class="modal-content stats-modal">
                    <h2>📊 Статистика</h2>
                    
                    <div class="stats-summary">
                        <div>Всего игр: <strong>${winStats.total}</strong></div>
                        <div>Побед Игрока 1: <strong>${winStats.player1}</strong></div>
                        <div>Побед Игрока 2 / AI: <strong>${winStats.player2}</strong></div>
                    </div>

                    <h3>Последние матчи</h3>
                    <div class="stats-list">
                        ${stats.length === 0 ?
        '<p style="color:#888; text-align:center; padding:20px;">Пока нет завершённых игр</p>' :
        stats.map((game, i) => `
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
            </div>
        `;

    // Удаляем старое модальное окно
    const old = document.getElementById('stats-modal');
    if (old) old.parentElement.remove();

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = html;
    document.body.appendChild(modalContainer);

    document.getElementById('stats-close').addEventListener('click', () => {
      modalContainer.remove();
    });

    document.getElementById('stats-clear').addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите очистить всю статистику?')) {
        this.statistics.clearAll();
        modalContainer.remove();
        // Сразу показываем обновлённое окно
        setTimeout(() => this.showStatistics(), 100);
      }
    });
  }
}

window.Menu = Menu;