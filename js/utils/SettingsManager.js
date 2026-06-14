// js/utils/SettingsManager.js

class SettingsManager {
    constructor() {
        this.key = 'gravityPongSettings';
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.key);
            if (saved) {
                const parsed = JSON.parse(saved);

                Object.assign(SETTINGS, {
                    planetCount: parsed.planetCount ?? SETTINGS.planetCount,
                    speedIncrease: parsed.speedIncrease ?? SETTINGS.speedIncrease,
                    showHints: parsed.showHints ?? SETTINGS.showHints,
                });

                // Аудио настройки
                if (window.audioManager) {
                    if (parsed.soundVolume !== undefined) {
                        window.audioManager.soundVolume = parsed.soundVolume;
                    }
                    if (parsed.musicVolume !== undefined) {
                        window.audioManager.musicVolume = parsed.musicVolume;
                    }
                    if (parsed.soundEnabled !== undefined) {
                        window.audioManager.soundEnabled = parsed.soundEnabled;
                    }
                    if (parsed.musicEnabled !== undefined) {
                        window.audioManager.musicEnabled = parsed.musicEnabled;
                    }
                }

                console.log('✅ Настройки загружены:', SETTINGS);
            }
        } catch (e) {
            console.warn('Не удалось загрузить настройки', e);
        }
    }

    saveSettings() {
        try {
            const dataToSave = {
                planetCount: SETTINGS.planetCount,
                speedIncrease: SETTINGS.speedIncrease,
                showHints: SETTINGS.showHints,
                soundVolume: window.audioManager ? window.audioManager.soundVolume : 0.5,
                musicVolume: window.audioManager ? window.audioManager.musicVolume : 0.3,
                soundEnabled: window.audioManager ? window.audioManager.soundEnabled : true,
                musicEnabled: window.audioManager ? window.audioManager.musicEnabled : true
            };

            localStorage.setItem(this.key, JSON.stringify(dataToSave));
            console.log('💾 Настройки сохранены');
        } catch (e) {
            console.warn('Ошибка сохранения', e);
        }
    }

    resetToDefault() {
        if (confirm('Сбросить все настройки?')) {
            localStorage.removeItem(this.key);
            location.reload();
        }
    }
}

window.SettingsManager = SettingsManager;