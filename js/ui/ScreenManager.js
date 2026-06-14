// js/ui/ScreenManager.js

class ScreenManager {
    constructor() {
        this.screens = {};
        this.currentScreen = null;
    }

    init() {
        // Находим все экраны
        document.querySelectorAll('.menu-screen').forEach(screen => {
            this.screens[screen.id] = screen;
        });
    }

    show(screenId) {
        // Скрываем все экраны
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });

        // Показываем нужный
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

    // Удобный метод для показа главного меню
    showMainMenu() {
        this.show('main-menu');
    }
}

window.ScreenManager = ScreenManager;