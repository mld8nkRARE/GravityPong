// js/ui/Menu.js

class Menu {
  constructor() {
    this.dataLoader = new DataLoader();
    this.settingsManager = new SettingsManager();
    this.statistics = window.gameStatistics;
    this.modalManager = new ModalManager();
    this.screenManager = new ScreenManager();
    this.createMenuHTML();
    this.screenManager.init();
    this.attachEventListeners();
    this.loadGameData();
  }

  // ====================== СОЗДАНИЕ HTML ======================
  createMenuHTML() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = `
            ${this.getMainMenuHTML()}
            ${this.getModeMenuHTML()}
            ${this.getDifficultyMenuHTML()}
            ${this.getSettingsMenuHTML()}
            ${this.getControlsMenuHTML()}
        `;
  }

  getMainMenuHTML() {
    return `
            <div id="main-menu" class="menu-screen active">
                <h1 class="game-title">GRAVITY PONG</h1>
                <div class="menu-buttons">
                    <button class="menu-btn" id="btn-play">Играть</button>
                    <button class="menu-btn" id="btn-howtoplay">Как играть</button>
                    <button class="menu-btn" id="btn-stats">Статистика</button>
                    <button class="menu-btn" id="btn-settings">Настройки</button>
                    <button class="menu-btn" id="btn-controls">Управление</button>
                </div>
            </div>`;
  }

  getModeMenuHTML() {
    return `
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
            </div>`;
  }

  getDifficultyMenuHTML() {
    return `
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
            </div>`;
  }

  getSettingsMenuHTML() {
    return `
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
            </div>`;
  }

  getControlsMenuHTML() {
    return `
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
            </div>`;
  }
  attachEventListeners() {
    this.attachMainMenuListeners();
    this.attachModeAndDifficultyListeners();
    this.attachSettingsListeners();
    this.attachBackButtons();
  }
  attachMainMenuListeners() {
    document.getElementById('btn-play').addEventListener('click', () => this.showScreen('mode-menu'));
    document.getElementById('btn-howtoplay').addEventListener('click', () => this.showHowToPlay());
    document.getElementById('btn-stats').addEventListener('click', () => this.showStatistics());
    document.getElementById('btn-settings').addEventListener('click', () => this.showScreen('settings-menu'));
    document.getElementById('btn-controls').addEventListener('click', () => this.showScreen('controls-menu'));
  }
  attachModeAndDifficultyListeners() {
    // Mode cards
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        SETTINGS.gameMode = card.dataset.mode;

        setTimeout(() => {
          if (SETTINGS.gameMode === 'AI') {
            this.showScreen('difficulty-menu');
          } else {
            this.startGame();
          }
        }, 150);
      });
    });

    // Difficulty cards
    document.querySelectorAll('.difficulty-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        SETTINGS.difficulty = card.dataset.difficulty;
        setTimeout(() => this.startGame(), 150);
      });
    });
  }
  attachSettingsListeners() {
    // Планеты
    document.getElementById('planet-count').addEventListener('input', (e) => {
      SETTINGS.planetCount = parseInt(e.target.value);
      document.getElementById('planet-count-value').textContent = e.target.value;
      this.settingsManager.saveSettings();
    });

    // Ускорение
    document.getElementById('speed-increase').addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      SETTINGS.speedIncrease = 1 + val / 100;
      document.getElementById('speed-increase-value').textContent = `+${val}%`;
      this.settingsManager.saveSettings();
    });

    // Звуковые настройки
    document.getElementById('sound-volume').addEventListener('input', (e) => {
      const value = parseInt(e.target.value) / 100;
      document.getElementById('sound-volume-value').textContent = `${parseInt(e.target.value)}%`;
      if (window.audioManager) window.audioManager.setSoundVolume(value);
      this.settingsManager.saveSettings();
    });

    document.getElementById('music-volume').addEventListener('input', (e) => {
      const value = parseInt(e.target.value) / 100;
      document.getElementById('music-volume-value').textContent = `${parseInt(e.target.value)}%`;
      if (window.audioManager) window.audioManager.setMusicVolume(value);
      this.settingsManager.saveSettings();
    });

    document.getElementById('sound-toggle').addEventListener('change', (e) => {
      if (window.audioManager) window.audioManager.toggleSound();
      this.settingsManager.saveSettings();
    });

    document.getElementById('music-toggle').addEventListener('change', (e) => {
      if (window.audioManager) window.audioManager.toggleMusic();
      this.settingsManager.saveSettings();
    });
  }
  attachBackButtons() {
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.id;
        if (id === 'btn-back-mode') this.showScreen('main-menu');
        else if (id === 'btn-back-difficulty') this.showScreen('mode-menu');
        else this.showScreen('main-menu');
      });
    });
  }
  // ====================== НАВИГАЦИЯ ======================
  showScreen(screenId) {
    this.screenManager.show(screenId);

    if (screenId === 'settings-menu') {
      this.syncSettingsUI();
    }
  }
  // ====================== ОСНОВНЫЕ ДЕЙСТВИЯ ======================
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

  async loadGameData() {
    const data = await this.dataLoader.loadRules();
    console.log('📋 Загружены данные игры:', data);
  }

  show() {
    document.getElementById('menu').style.display = 'flex';
    this.showScreen('main-menu');
  }
  // ====================== МОДАЛЬНЫЕ ОКНА ======================
  showHowToPlay() {
    this.modalManager.showHowToPlay(this.dataLoader);
  }

  showStatistics() {
    this.modalManager.showStatistics(this.statistics);
  }
  syncSettingsUI() {
    // Планеты и ускорение
    const planetSlider = document.getElementById('planet-count');
    if (planetSlider) {
      planetSlider.value = SETTINGS.planetCount;
      document.getElementById('planet-count-value').textContent = SETTINGS.planetCount;
    }

    const speedSlider = document.getElementById('speed-increase');
    if (speedSlider) {
      const percent = Math.round((SETTINGS.speedIncrease - 1) * 100);
      speedSlider.value = percent;
      document.getElementById('speed-increase-value').textContent = `+${percent}%`;
    }

    // Чекбоксы и громкость
    if (window.audioManager) {
      const soundToggle = document.getElementById('sound-toggle');
      const musicToggle = document.getElementById('music-toggle');
      const soundVolume = document.getElementById('sound-volume');
      const musicVolume = document.getElementById('music-volume');

      if (soundToggle) soundToggle.checked = !!window.audioManager.soundEnabled;
      if (musicToggle) musicToggle.checked = !!window.audioManager.musicEnabled;

      if (soundVolume) {
        soundVolume.value = Math.round(window.audioManager.soundVolume * 100);
        document.getElementById('sound-volume-value').textContent =
          `${Math.round(window.audioManager.soundVolume * 100)}%`;
      }
      if (musicVolume) {
        musicVolume.value = Math.round(window.audioManager.musicVolume * 100);
        document.getElementById('music-volume-value').textContent =
          `${Math.round(window.audioManager.musicVolume * 100)}%`;
      }
    }
  }
}

window.Menu = Menu;