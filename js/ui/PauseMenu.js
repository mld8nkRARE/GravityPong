import { settings } from '../core/settings.js';

export class PauseMenu {
    constructor(game, audioManager, menu) {
        this.game = game;
        this.audioManager = audioManager;
        this.menu = menu;
        this.visible = false;
        this.elements = {};
        this.createPauseMenuHTML();
        this.attachEventListeners();
    }

    createPauseMenuHTML() {
        const existing = document.getElementById('pause-menu');
        if (existing) existing.remove();

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
        this.cacheElements();
    }

    cacheElements() {
        this.elements = {
            container: document.getElementById('pause-menu'),
            hintsToggle: document.getElementById('pause-hints-toggle'),
            soundToggle: document.getElementById('pause-sound-toggle'),
            musicToggle: document.getElementById('pause-music-toggle'),
            soundVolume: document.getElementById('pause-sound-volume'),
            musicVolume: document.getElementById('pause-music-volume'),
            soundValue: document.getElementById('pause-sound-volume-value'),
            musicValue: document.getElementById('pause-music-volume-value')
        };
    }

    attachEventListeners() {
        const els = this.elements;

        els.resumeBtn = document.getElementById('btn-resume');
        els.restartBtn = document.getElementById('btn-restart');
        els.exitBtn = document.getElementById('btn-exit');

        els.resumeBtn.addEventListener('click', () => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
            this.game.resume();
        });
        els.restartBtn.addEventListener('click', () => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
            this.hide();
            this.game.restart();
        });
        els.exitBtn.addEventListener('click', () => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
            this.hide();
            this.game.returnToMenu();
        });

        els.hintsToggle.addEventListener('change', (e) => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
            settings.showHints = e.target.checked;
            if (this.menu && this.menu.settingsManager) {
                this.menu.settingsManager.saveSettings();
            }
        });

        els.soundToggle.addEventListener('change', (e) => {
            if (this.audioManager) {
                this.audioManager.playSound('buttonClick');
                this.audioManager.soundEnabled = e.target.checked;
            }
            if (this.menu && this.menu.settingsManager) {
                this.menu.settingsManager.saveSettings();
            }
        });

        els.soundVolume.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            els.soundValue.textContent = `${value}%`;
            if (this.audioManager) {
                this.audioManager.setSoundVolume(value / 100);
            }
            if (this.menu && this.menu.settingsManager) {
                this.menu.settingsManager.saveSettings();
            }
        });

        els.soundVolume.addEventListener('mouseup', () => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        });

        els.musicToggle.addEventListener('change', (e) => {
            if (this.audioManager) {
                this.audioManager.playSound('buttonClick');
                this.audioManager.musicEnabled = e.target.checked;

                if (e.target.checked) {
                    if (this.audioManager.context === 'game') {
                        this.audioManager.playGameMusic();
                    } else {
                        this.audioManager.playMenuMusic();
                    }
                } else {
                    this.audioManager.stopMusic();
                }
            }
            if (this.menu && this.menu.settingsManager) {
                this.menu.settingsManager.saveSettings();
            }
        });

        els.musicVolume.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            els.musicValue.textContent = `${value}%`;
            if (this.audioManager) {
                this.audioManager.setMusicVolume(value / 100);
            }
            if (this.menu && this.menu.settingsManager) {
                this.menu.settingsManager.saveSettings();
            }
        });

        els.musicVolume.addEventListener('mouseup', () => {
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        });
    }

    show() {
        this.visible = true;
        this.elements.container.style.display = 'flex';

        if (this.audioManager) {
            this.elements.soundToggle.checked = !!this.audioManager.soundEnabled;
            this.elements.musicToggle.checked = !!this.audioManager.musicEnabled;

            this.elements.soundVolume.value = Math.round(this.audioManager.soundVolume * 100);
            this.elements.musicVolume.value = Math.round(this.audioManager.musicVolume * 100);

            this.elements.soundValue.textContent = `${Math.round(this.audioManager.soundVolume * 100)}%`;
            this.elements.musicValue.textContent = `${Math.round(this.audioManager.musicVolume * 100)}%`;
        }

        this.elements.hintsToggle.checked = settings.showHints !== false;
    }

    hide() {
        this.visible = false;
        if (this.elements.container) {
            this.elements.container.style.display = 'none';
        }
    }
}
