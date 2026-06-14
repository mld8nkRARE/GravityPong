// js/core/game.js

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);

        this.state = 'menu';
        this.keys = {};
        this.isRunning = false;
        this.animationFrameId = null;
        this.controlsSetup = false;
        this.hintSystem = new HintSystem();
        this.statistics = window.gameStatistics;
        this.pauseMenu = null;
    }

    init() {
        window.gameStartTime = Date.now();
        this.stop();

        this.resetGameObjects();
        this.setupPauseMenu();
        this.setupControlsOnce();
        this.setupEventListeners();

        this.state = 'playing';
    }

    resetGameObjects() {
        // Мяч
        this.ball = new Ball(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
        this.ball.reset(Math.random() > 0.5 ? 1 : -1);

        // Ракетки
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
        this.hintSystem.reset();

        // Жизни
        this.lives1 = CONFIG.GAME.MAX_LIVES;
        this.lives2 = CONFIG.GAME.MAX_LIVES;
    }

    setupPauseMenu() {
        if (!this.pauseMenu) {
            this.pauseMenu = new PauseMenu(this);
        }
    }

    setupControlsOnce() {
        if (this.controlsSetup) return;
        this.controlsSetup = true;

        this.keydownHandler = (e) => this.handleKeyDown(e);
        this.keyupHandler = (e) => { this.keys[e.code] = false; };

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;

        if (this.state === 'playing') {
            if (e.code === 'Escape' || e.code === 'Space') {
                this.pause();
                e.preventDefault();
                return;
            }

            this.handlePlayerHints(e);
        }
        else if (this.state === 'paused') {
            if (e.code === 'Escape' || e.code === 'Space') {
                this.resume();
                e.preventDefault();
            }
        }
        else if (this.state === 'gameOver') {
            if (e.code === 'Enter') this.restart();
            if (e.code === 'Escape') this.returnToMenu();
        }
    }

    handlePlayerHints(e) {
        // Игрок 1
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT1) this.activateHint('player1', 'freeze');
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT2) this.activateHint('player1', 'shield');
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT3) this.activateHint('player1', 'enlarge');

        // Игрок 2 (только PVP)
        if (SETTINGS.gameMode === 'PVP') {
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT1) this.activateHint('player2', 'freeze');
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT2) this.activateHint('player2', 'shield');
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT3) this.activateHint('player2', 'enlarge');
        }
    }

    setupEventListeners() {
        if (this.gameEventHandler) {
            window.removeEventListener(GAME_EVENT, this.gameEventHandler);
        }

        this.gameEventHandler = (e) => {
            const { type, ...data } = e.detail;
            console.log(`📡 Обработано событие: ${type}`, data);
        };

        window.addEventListener(GAME_EVENT, this.gameEventHandler);
    }

    // ====================== ОСНОВНОЙ ЦИКЛ ======================
    update() {
        if (this.state !== 'playing') return;
        if (!this.ball || !this.paddle1 || !this.paddle2) return;

        this.hintSystem.update();

        // Управление игроком 1
        let dir1 = 0;
        if (this.keys[CONFIG.CONTROLS.PLAYER1.UP]) dir1 = -1;
        if (this.keys[CONFIG.CONTROLS.PLAYER1.DOWN]) dir1 = 1;
        this.paddle1.update(dir1);

        // Управление игроком 2 или AI
        if (SETTINGS.gameMode === 'PVP') {
            let dir2 = 0;
            if (this.keys[CONFIG.CONTROLS.PLAYER2.UP]) dir2 = -1;
            if (this.keys[CONFIG.CONTROLS.PLAYER2.DOWN]) dir2 = 1;
            this.paddle2.update(dir2);
        } else if (this.ai) {
            this.ai.update(this.paddle2, this.ball, this.planets);
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

    draw() {
        this.renderer.clear();

        if (this.state === 'menu') return;

        // Планеты
        this.planets.forEach(p => p.draw(this.renderer.ctx));

        // Щиты
        if (this.hintSystem.hintManager1?.activeEffects.shield && this.paddle1) {
            this.renderer.drawShield(this.paddle1, true);
        }
        if (this.hintSystem.hintManager2?.activeEffects.shield && this.paddle2) {
            this.renderer.drawShield(this.paddle2, false);
        }

        // Ракетки
        this.paddle1?.draw(this.renderer.ctx);
        this.paddle2?.draw(this.renderer.ctx);

        // Эффект заморозки
        if (this.hintSystem.isFreezeActive() && this.ball) {
            this.renderer.drawFreezeEffect(this.ball);
        }

        // Мяч
        this.ball?.draw(this.renderer.ctx);

        // Жизни
        this.renderer.drawLives(this.lives1, this.lives2);

        // Подсказки (иконки + таймеры)
        this.hintSystem.drawHints(this.renderer);

        // Экраны состояния
        if (this.state === 'paused') this.renderer.drawPauseScreen();
        if (this.state === 'gameOver') this.renderer.drawGameOver(this.winner);
    }

    loop() {
        if (!this.isRunning) return;
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

    // ====================== ЛОГИКА ИГРЫ ======================
    pause() {
        this.state = 'paused';
        this.pauseMenu?.show();
    }

    resume() {
        this.state = 'playing';
        this.pauseMenu?.hide();
    }

    activateHint(player, type) {
        const success = this.hintSystem.activate(player, type);
        if (!success) return;

        this.hintSystem.applyEffect(player, type, this);
    }



    handleGoal(scorer) {
        dispatchGameEvent(EVENT_TYPES.GOAL, { scorer, lives1: this.lives1, lives2: this.lives2 });

        if (window.audioManager) window.audioManager.playSound('goal');


        if (this.hintSystem.checkShield(scorer, this)) {
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

        this.statistics.saveResult(winner, this.lives1, this.lives2, SETTINGS.gameMode, SETTINGS.difficulty);
        dispatchGameEvent(EVENT_TYPES.GAME_OVER, { winner, lives1: this.lives1, lives2: this.lives2, mode: SETTINGS.gameMode });

        if (window.audioManager) window.audioManager.playSound('gameOver');
    }

    restart() {
        this.resetGameObjects();
        this.state = 'playing';
    }

    returnToMenu() {
        this.stop();
        if (window.audioManager) window.audioManager.playMenuMusic();

        this.state = 'menu';
        this.ball = this.paddle1 = this.paddle2 = this.ai = null;
        this.planets = [];

        this.pauseMenu?.hide();

        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('menu').style.display = 'flex';

        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            document.querySelectorAll('.menu-screen').forEach(s => s.style.display = 'none');
            mainMenu.style.display = 'flex';
            mainMenu.classList.add('active');
        }
    }
}

window.Game = Game;