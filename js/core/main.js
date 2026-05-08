// js/main.js

let game = null;
let menu = null;
let audioManager = null;
let musicStarted = false;
// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // Получаем canvas
    const canvas = document.getElementById('gameCanvas');

    // Устанавливаем размеры canvas
    canvas.width = CONFIG.CANVAS.WIDTH;
    canvas.height = CONFIG.CANVAS.HEIGHT;

    // Скрываем canvas до старта игры
    canvas.style.display = 'none';

    audioManager = new AudioManager();
    window.audioManager = audioManager;
    audioManager.playMenuMusic();
    document.addEventListener('click', startMusicOnce);
    document.addEventListener('keydown', startMusicOnce);
    //sada
    // Создаем меню
    menu = new Menu();

    // Создаем игру (но не запускаем)
    game = new Game(canvas);

    // Делаем игру доступной глобально для меню
    window.game = game;
    window.menu = menu;

    // Обработчик ESC для выхода в меню из игры
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && game.state === 'playing') {
            //pauseAndShowMenu();
        }
    });
}


// Предотвращаем скролл страницы при нажатии стрелок
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});

function startMusicOnce() {
    if (!musicStarted && window.audioManager) {
        audioManager.playMenuMusic();
        musicStarted = true;

        // Удаляем слушатели после первого запуска
        document.removeEventListener('click', startMusicOnce);
        document.removeEventListener('keydown', startMusicOnce);
    }
}