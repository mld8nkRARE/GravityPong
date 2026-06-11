// js/core/game.js

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.state = 'menu';
        this.keys = {};
        this.lastTime = 0;
        this.pauseMenu = null;
        this.controlsSetup = false;
        this.isRunning = false; // НОВЫЙ ФЛАГ
        this.animationFrameId = null; // НОВЫЙ ФЛАГ для отмены анимации
        this.statistics = window.gameStatistics;
    }

    init() {
        window.gameStartTime = Date.now();
        // Останавливаем предыдущий цикл если он был
        this.stop();

        // Пересоздаём мяч с начальной скоростью
        this.ball = new Ball(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
        this.ball.reset(Math.random() > 0.5 ? 1 : -1);

        this.paddle1 = new PlayerPaddle(CONFIG.PADDLE.OFFSET);

        if (SETTINGS.gameMode === 'AI') {
            this.paddle2 = new AIPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
            this.ai = new AI(SETTINGS.difficulty);
        } else {
            this.paddle2 = new PlayerPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
            this.ai = null;
        }
        // Планеты
        this.planets = [];
        for (let i = 0; i < SETTINGS.planetCount; i++) {
            this.planets.push(new Planet());
        }

        // Подсказки
        this.hintManager1 = new HintManager('player1');
        this.hintManager2 = new HintManager('player2');

        // AI
        if (SETTINGS.gameMode === 'AI') {
            this.ai = new AI(SETTINGS.difficulty);
        } else {
            this.ai = null;
        }

        // Жизни
        this.lives1 = CONFIG.GAME.MAX_LIVES;
        this.lives2 = CONFIG.GAME.MAX_LIVES;

        // Создаём меню паузы если ещё не создано
        if (!this.pauseMenu) {
            this.pauseMenu = new PauseMenu(this);
        }

        // Настраиваем управление только один раз
        if (!this.controlsSetup) {
            this.setupControls();
            this.controlsSetup = true;
        }
        //CUSTOM EVENT LISTENER 
        this.setupEventListeners();
        this.state = 'playing';
    }

    setupControls() {
        // Удаляем старые обработчики если они были
        if (this.keydownHandler) {
            window.removeEventListener('keydown', this.keydownHandler);
            window.removeEventListener('keyup', this.keyupHandler);
        }

        this.keydownHandler = (e) => {
            this.keys[e.code] = true;

            if (this.state === 'playing') {
                // ESC для паузы
                if (e.code === 'Escape') {
                    this.pause();
                    e.preventDefault();
                    return;
                }

                // Space для паузы (альтернатива)
                if (e.code === 'Space') {
                    this.pause();
                    e.preventDefault();
                    return;
                }

                // Подсказки Игрок 1
                if (e.code === CONFIG.CONTROLS.PLAYER1.HINT1) this.activateHint('player1', 'freeze');
                if (e.code === CONFIG.CONTROLS.PLAYER1.HINT2) this.activateHint('player1', 'shield');
                if (e.code === CONFIG.CONTROLS.PLAYER1.HINT3) this.activateHint('player1', 'enlarge');

                // Подсказки Игрок 2 (только PVP)
                if (SETTINGS.gameMode === 'PVP') {
                    if (e.code === CONFIG.CONTROLS.PLAYER2.HINT1) this.activateHint('player2', 'freeze');
                    if (e.code === CONFIG.CONTROLS.PLAYER2.HINT2) this.activateHint('player2', 'shield');
                    if (e.code === CONFIG.CONTROLS.PLAYER2.HINT3) this.activateHint('player2', 'enlarge');
                }
            }
            else if (this.state === 'paused') {
                // В паузе ESC или Space продолжают игру
                if (e.code === 'Escape' || e.code === 'Space') {
                    this.resume();
                    e.preventDefault();
                }
            }
            else if (this.state === 'gameOver') {
                if (e.code === 'Enter') {
                    this.restart();
                    e.preventDefault();
                }
                if (e.code === 'Escape') {
                    this.returnToMenu();
                    e.preventDefault();
                }
            }
        };

        this.keyupHandler = (e) => {
            this.keys[e.code] = false;
        };

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }
    setupEventListeners() {
        // Удаляем старый слушатель, если был
        if (this.gameEventHandler) {
            window.removeEventListener(GAME_EVENT, this.gameEventHandler);
        }

        this.gameEventHandler = (e) => {
            const { type, ...data } = e.detail;

            console.log(`Обработано событие: ${type}`, data);

            // Здесь можно добавлять логику (например, для статистики)
            if (type === EVENT_TYPES.GOAL) {
                console.log(`Гол! Забил: ${data.scorer}`);
            }

            if (type === EVENT_TYPES.GAME_OVER) {
                console.log(`Игра окончена! Победитель: ${data.winner}`);
            }
        };

        window.addEventListener(GAME_EVENT, this.gameEventHandler);
    }

    pause() {
        this.state = 'paused';
        if (this.pauseMenu) {
            this.pauseMenu.show();
        }
    }

    resume() {
        this.state = 'playing';
        if (this.pauseMenu) {
            this.pauseMenu.hide();
        }
    }

    activateHint(player, type) {
        const manager = player === 'player1' ? this.hintManager1 : this.hintManager2;
        if (!manager.activate(type)) return;
        // === CUSTOM EVENT ===
        dispatchGameEvent(EVENT_TYPES.HINT_USED, {
            player: player,
            hintType: type,
            remainingUses: manager.hints[type]
        });
        if (window.audioManager) {
            window.audioManager.playSound('powerup');
        }

        if (type === 'freeze') {
            const originalSpeedX = this.ball.velocityX;
            const originalSpeedY = this.ball.velocityY;

            this.ball.velocityX *= 0.3;
            this.ball.velocityY *= 0.3;
            this.ball.ignoreGravity = true;
            this.ball.isFrozen = true;
            setTimeout(() => {
                if (this.ball && this.isRunning) {
                    const currentSpeed = Math.sqrt(
                        this.ball.velocityX ** 2 +
                        this.ball.velocityY ** 2
                    );
                    if (currentSpeed > 0) {
                        // Сохраняем направление, но устанавливаем минимальную скорость
                        const minSpeed = 3; // минимум после заморозки
                        const scale = minSpeed / currentSpeed;

                        this.ball.velocityX *= scale;
                        this.ball.velocityY *= scale;
                    } else {
                        // На случай если скорость 0
                        this.ball.velocityX = 3;
                        this.ball.velocityY = 0;
                    }
                    //this.ball.velocityX = originalSpeedX;
                    //this.ball.velocityY = originalSpeedY;
                    this.ball.ignoreGravity = false;
                    this.ball.isFrozen = false;
                }
            }, CONFIG.HINTS.FREEZE.duration);
        }
        else if (type === 'enlarge') {
            const paddle = player === 'player1' ? this.paddle1 : this.paddle2;
            // Вызываем только если это PlayerPaddle (у AI нет этого метода)
            if (typeof paddle.activateEnlarge === 'function') {
                paddle.activateEnlarge();
            }
        }
    }

    update() {
        if (this.state !== 'playing') return;
        if (!this.ball || !this.paddle1 || !this.paddle2) return;

        this.hintManager1.update();
        this.hintManager2.update();

        let dir1 = 0;
        if (this.keys[CONFIG.CONTROLS.PLAYER1.UP]) dir1 = -1;
        if (this.keys[CONFIG.CONTROLS.PLAYER1.DOWN]) dir1 = 1;
        this.paddle1.update(dir1);

        if (SETTINGS.gameMode === 'PVP') {
            let dir2 = 0;
            if (this.keys[CONFIG.CONTROLS.PLAYER2.UP]) dir2 = -1;
            if (this.keys[CONFIG.CONTROLS.PLAYER2.DOWN]) dir2 = 1;
            this.paddle2.update(dir2);
        } else if (this.ai) {
            this.ai.update(this.paddle2, this.ball, this.planets);
            //this.ai.useHints(this, this.ball);
        }

        this.ball.update();

        if (!this.ball.ignoreGravity) {
            Physics.applyPlanetGravity(this.ball, this.planets);
        }

        Physics.limitSpeed(this.ball);

        this.planets.forEach(p => p.update());

        Physics.checkPaddleCollision(this.ball, this.paddle1);
        Physics.checkPaddleCollision(this.ball, this.paddle2);

        const goal = Physics.checkGoal(this.ball);
        if (goal) this.handleGoal(goal);
    }

    handleGoal(scorer) {
        // === CUSTOM EVENT ===
        dispatchGameEvent(EVENT_TYPES.GOAL, {
            scorer: scorer,
            lives1: this.lives1,
            lives2: this.lives2,
            player1HintManager: this.hintManager1 ? this.hintManager1.hints : null
        });
        if (window.audioManager) {
            window.audioManager.playSound('goal');
        }

        if (scorer === 'player2' && this.hintManager1.activeEffects.shield) {
            this.hintManager1.activeEffects.shield = false;
            this.ball.reset(-1);
            return;
        }
        if (scorer === 'player1' && this.hintManager2.activeEffects.shield) {
            this.hintManager2.activeEffects.shield = false;
            this.ball.reset(1);
            return;
        }

        if (scorer === 'player1') {
            this.lives2--;
            this.ball.reset(1);
        } else {
            this.lives1--;
            this.ball.reset(-1);
        }

        if (this.lives1 <= 0) this.gameOver('player2');
        else if (this.lives2 <= 0) this.gameOver('player1');
    }

    gameOver(winner) {
        this.state = 'gameOver';
        this.winner = winner;
        // === СОХРАНЕНИЕ СТАТИСТИКИ ===
        this.statistics.saveResult(
            winner,
            this.lives1,
            this.lives2,
            SETTINGS.gameMode,
            SETTINGS.difficulty
        );
        // === CUSTOM EVENT ===
        dispatchGameEvent(EVENT_TYPES.GAME_OVER, {
            winner: winner,
            lives1: this.lives1,
            lives2: this.lives2,
            mode: SETTINGS.gameMode
        });

        if (window.audioManager) {
            window.audioManager.playSound('gameOver');
        }
    }

    restart() {
        this.lives1 = CONFIG.GAME.MAX_LIVES;
        this.lives2 = CONFIG.GAME.MAX_LIVES;

        this.ball = new Ball(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
        this.ball.reset(Math.random() > 0.5 ? 1 : -1);

        this.hintManager1.reset();
        this.hintManager2.reset();

        this.planets = [];
        for (let i = 0; i < SETTINGS.planetCount; i++) {
            this.planets.push(new Planet());
        }

        this.paddle1 = new PlayerPaddle(CONFIG.PADDLE.OFFSET);

        if (SETTINGS.gameMode === 'AI') {
            this.paddle2 = new AIPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
        } else {
            this.paddle2 = new PlayerPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
        }

        this.state = 'playing';
    }

    returnToMenu() {
        // Останавливаем игровой цикл
        this.stop();
        if (window.audioManager) {
            window.audioManager.playMenuMusic();
        }
        // Очищаем игровое состояние
        this.state = 'menu';
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.planets = [];
        this.ai = null;

        // Скрываем меню паузы если открыто
        if (this.pauseMenu) {
            this.pauseMenu.hide();
        }

        // Скрываем canvas
        document.getElementById('gameCanvas').style.display = 'none';

        // Показываем меню контейнер
        const menuContainer = document.getElementById('menu');
        menuContainer.style.display = 'flex';

        // Убираем все active классы и скрываем все экраны
        const allScreens = menuContainer.querySelectorAll('.menu-screen');
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });

        // Показываем только главное меню
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.add('active');
            mainMenu.style.display = 'flex';
        }
    }

    draw() {
        this.renderer.clear();

        if (this.state === 'menu') return;

        if (this.planets && this.planets.length > 0) {
            this.planets.forEach(p => p.draw(this.renderer.ctx));
        }

        if (this.hintManager1 && this.hintManager1.activeEffects.shield && this.paddle1) {
            this.renderer.drawShield(this.paddle1, true);
        }
        if (this.hintManager2 && this.hintManager2.activeEffects.shield && this.paddle2) {
            this.renderer.drawShield(this.paddle2, false);
        }

        if (this.paddle1) this.paddle1.draw(this.renderer.ctx);
        if (this.paddle2) this.paddle2.draw(this.renderer.ctx);

        if ((this.hintManager1 && this.hintManager1.activeEffects.freeze) ||
            (this.hintManager2 && this.hintManager2.activeEffects.freeze)) {
            if (this.ball) this.renderer.drawFreezeEffect(this.ball);
        }

        if (this.ball) this.ball.draw(this.renderer.ctx);

        if (typeof this.lives1 !== 'undefined' && typeof this.lives2 !== 'undefined') {
            this.renderer.drawLives(this.lives1, this.lives2);
        }

        if (this.hintManager1) this.renderer.drawHints(this.hintManager1, true);
        if (this.hintManager2) this.renderer.drawHints(this.hintManager2, false);

        if (this.state === 'paused') this.renderer.drawPauseScreen();
        if (this.state === 'gameOver') this.renderer.drawGameOver(this.winner);
    }

    loop() {
        if (!this.isRunning) return; // ВАЖНО: Проверяем флаг

        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    start() {
        this.isRunning = true;
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

}

window.Game = Game;