import { settings } from '../core/settings.js';

export class SettingsManager {
    constructor(audioManager) {
        this.key = 'gravityPongSettings';
        this.audioManager = audioManager;
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.key);
            if (!saved) return;

            const parsed = JSON.parse(saved);

            Object.assign(settings, {
                planetCount: parsed.planetCount ?? settings.planetCount,
                speedIncrease: parsed.speedIncrease ?? settings.speedIncrease,
                showHints: parsed.showHints ?? true,
            });

            if (this.audioManager) {
                this.audioManager.soundEnabled = parsed.soundEnabled ?? true;
                this.audioManager.musicEnabled = parsed.musicEnabled ?? true;
                this.audioManager.soundVolume = parsed.soundVolume ?? 0.5;
                this.audioManager.musicVolume = parsed.musicVolume ?? 0.3;

                this.audioManager.setSoundVolume(this.audioManager.soundVolume);
                this.audioManager.setMusicVolume(this.audioManager.musicVolume);
            }
        } catch (e) {
            console.warn('Ошибка загрузки настроек', e);
        }
    }

    saveSettings() {
        try {
            const audio = this.audioManager || {};

            const dataToSave = {
                planetCount: settings.planetCount,
                speedIncrease: settings.speedIncrease,
                showHints: settings.showHints,
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
