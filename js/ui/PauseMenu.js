// js/ui/PauseMenu.js

class PauseMenu {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.hintsEnabled = true;
        this.createPauseMenuHTML();
        this.attachEventListeners();
    }

    createPauseMenuHTML() {
        const existingMenu = document.getElementById('pause-menu');
        if (existingMenu) existingMenu.remove();

        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'pause-overlay';
        pauseMenu.style.display = 'none';

        pauseMenu.innerHTML = `
            <div class="pause-content">
                <h2>ПАУЗА</h2>
                
                <div class="pause-settings">
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="pause-hints-toggle" checked>
                            Показывать подсказки
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="pause-sound-toggle" checked>
                            Звуковые эффекты
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="pause-sound-volume">Громкость звуков:</label>
                        <div class="slider-container">
                            <input type="range" id="pause-sound-volume" min="0" max="100" value="50">
                            <span id="pause-sound-volume-value">50%</span>
                        </div>
                    </div>
                    
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="pause-music-toggle" checked>
                            Фоновая музыка
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="pause-music-volume">Громкость музыки:</label>
                        <div class="slider-container">
                            <input type="range" id="pause-music-volume" min="0" max="100" value="30">
                            <span id="pause-music-volume-value">30%</span>
                        </div>
                    </div>
                </div>
                
                <div class="pause-buttons">
                    <button class="menu-btn" id="btn-resume">Продолжить (ESC)</button>
                    <button class="menu-btn" id="btn-restart">Начать заново</button>
                    <button class="menu-btn" id="btn-exit">Выйти в меню</button>
                </div>
            </div>
        `;

        document.body.appendChild(pauseMenu);
    }

    // js/ui/PauseMenu.js - метод attachEventListeners

    attachEventListeners() {
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.game.resume();
        });

        document.getElementById('btn-restart').addEventListener('click', () => {
            this.hide();
            this.game.restart();
        });

        document.getElementById('btn-exit').addEventListener('click', () => {
            // Сначала скрываем меню паузы
            this.hide();
            // Затем возвращаемся в главное меню (это остановит игру)
            this.game.returnToMenu();
        });

        // Подсказки
        document.getElementById('pause-hints-toggle').addEventListener('change', (e) => {
            SETTINGS.showHints = e.target.checked;
        });

        // Звук
        document.getElementById('pause-sound-toggle').addEventListener('change', (e) => {
            if (window.audioManager) {
                window.audioManager.soundEnabled = e.target.checked;
            }
        });

        document.getElementById('pause-sound-volume').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('pause-sound-volume-value').textContent = `${value}%`;
            if (window.audioManager) {
                window.audioManager.setSoundVolume(value / 100);
            }
        });

        // Музыка
        // Музыка
        document.getElementById('pause-music-toggle').addEventListener('change', (e) => {
            if (window.audioManager) {
                // ✅ Просто устанавливаем флаг, остальное сделает toggleMusic()
                window.audioManager.musicEnabled = e.target.checked;

                if (e.target.checked) {
                    // Включаем музыку
                    if (window.audioManager.context === 'game') {
                        window.audioManager.playGameMusic();
                    } else {
                        window.audioManager.playMenuMusic();
                    }
                } else {
                    // Выключаем музыку
                    window.audioManager.stopMusic();
                }
            }
        });

        document.getElementById('pause-music-volume').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('pause-music-volume-value').textContent = `${value}%`;
            if (window.audioManager) {
                window.audioManager.setMusicVolume(value / 100);
            }
        });
    }

    show() {
        this.visible = true;
        const menu = document.getElementById('pause-menu');
        menu.style.display = 'flex';

        // Синхронизируем состояние чекбоксов
        if (window.audioManager) {
            document.getElementById('pause-sound-toggle').checked = window.audioManager.soundEnabled;
            document.getElementById('pause-music-toggle').checked = window.audioManager.musicEnabled;
            document.getElementById('pause-sound-volume').value = window.audioManager.soundVolume * 100;
            document.getElementById('pause-music-volume').value = window.audioManager.musicVolume * 100;
        }
        document.getElementById('pause-hints-toggle').checked = SETTINGS.showHints !== false;
    }

    hide() {
        this.visible = false;
        document.getElementById('pause-menu').style.display = 'none';
    }
}

window.PauseMenu = PauseMenu;