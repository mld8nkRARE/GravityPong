export class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.musicEnabled = true;

        this.soundVolume = 0.5;
        this.musicVolume = 0.3;

        this.menuMusic = new Audio('assets/music/menu.mp3');
        this.gameMusic = new Audio('assets/music/game.mp3');

        this.menuMusic.loop = true;
        this.gameMusic.loop = true;

        this.menuMusic.volume = this.musicVolume;
        this.gameMusic.volume = this.musicVolume;

        this.currentMusic = null;

        this.soundPaths = {
            paddleHit: 'assets/sounds/paddle_hit.mp3',
            wallHit: 'assets/sounds/wall_hit.mp3',
            goal: 'assets/sounds/goal.mp3',
            powerup: 'assets/sounds/powerup.mp3',
            gameOver: 'assets/sounds/game_over.mp3',
            buttonClick: 'assets/sounds/button_click.mp3',
            hintAwarded: 'assets/sounds/hintAwarded.mp3'
        };
        this.context = 'menu';
        this.soundFiles = {};
        this.loadSoundFiles();
    }

    loadSoundFiles() {
        Object.keys(this.soundPaths).forEach(key => {
            const audio = new Audio(this.soundPaths[key]);
            audio.volume = this.soundVolume;
            audio.preload = 'auto';
            this.soundFiles[key] = audio;
        });
    }

    playMenuMusic() {
        this.context = 'menu';

        this.stopMusic();
        if (!this.musicEnabled) {
            return;
        }
        this.menuMusic.currentTime = 0;
        this.menuMusic.play().catch(() => { });
        this.currentMusic = this.menuMusic;
    }

    playGameMusic() {
        this.context = 'game';

        if (!this.musicEnabled) return;

        this.stopMusic();

        this.gameMusic.currentTime = 0;
        this.gameMusic.play().catch(() => { });
        this.currentMusic = this.gameMusic;
    }

    stopMusic() {
        if (this.menuMusic) {
            this.menuMusic.pause();
        }
        if (this.gameMusic) {
            this.gameMusic.pause();
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;

        if (!this.musicEnabled) {
            this.stopMusic();
        } else {
            if (this.context === 'game') {
                this.playGameMusic();
            } else {
                this.playMenuMusic();
            }
        }

        return this.musicEnabled;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));

        this.menuMusic.volume = this.musicVolume;
        this.gameMusic.volume = this.musicVolume;
    }

    playSound(name) {
        if (!this.soundEnabled) return;
        if (!this.soundFiles[name]) return;

        const sound = this.soundFiles[name].cloneNode();
        sound.volume = this.soundVolume;
        sound.play().catch(() => { });
    }

    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
}
