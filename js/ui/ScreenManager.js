export class ScreenManager {
    constructor() {
        this.screens = {};
        this.currentScreen = null;
    }

    init() {
        document.querySelectorAll('.menu-screen').forEach(screen => {
            this.screens[screen.id] = screen;
        });
    }

    show(screenId) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });

        const targetScreen = this.screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.style.display = 'flex';
            this.currentScreen = screenId;
            return true;
        }
        return false;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    showMainMenu() {
        this.show('main-menu');
    }
}
