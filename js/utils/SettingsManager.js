// js/utils/SettingsManager.js

class SettingsManager {
    constructor() {
        this.key = 'gravityPongSettings';
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.key);
            if (!saved) return;

            const parsed = JSON.parse(saved);

            // Игровые настройки
            Object.assign(SETTINGS, {
                planetCount: parsed.planetCount ?? SETTINGS.planetCount,
                speedIncrease: parsed.speedIncrease ?? SETTINGS.speedIncrease,
                showHints: parsed.showHints ?? true,           // важно: default true
            });

            // Аудио настройки
            if (window.audioManager) {
                window.audioManager.soundEnabled = parsed.soundEnabled ?? true;
                window.audioManager.musicEnabled = parsed.musicEnabled ?? true;
                window.audioManager.soundVolume = parsed.soundVolume ?? 0.5;
                window.audioManager.musicVolume = parsed.musicVolume ?? 0.3;

                // Применяем значения
                window.audioManager.setSoundVolume(window.audioManager.soundVolume);
                window.audioManager.setMusicVolume(window.audioManager.musicVolume);
            }

            console.log('✅ Настройки успешно загружены');
        } catch (e) {
            console.warn('Ошибка загрузки настроек', e);
        }
    }

    saveSettings() {
        try {
            const audio = window.audioManager || {};

            const dataToSave = {
                planetCount: SETTINGS.planetCount,
                speedIncrease: SETTINGS.speedIncrease,
                showHints: SETTINGS.showHints,
                soundEnabled: !!audio.soundEnabled,
                musicEnabled: !!audio.musicEnabled,
                soundVolume: audio.soundVolume ?? 0.5,
                musicVolume: audio.musicVolume ?? 0.3
            };

            localStorage.setItem(this.key, JSON.stringify(dataToSave));
        } catch (e) {
            console.warn('Ошибка сохранения настроек', e);
        }
    }

    resetToDefault() {
        localStorage.removeItem(this.key);
        location.reload();
    }
}

window.SettingsManager = SettingsManager;