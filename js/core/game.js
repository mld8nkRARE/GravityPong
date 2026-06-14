import { CONFIG } from './config.js';
import { settings } from './settings.js';
import { GAME_EVENT, dispatchGameEvent, EVENT_TYPES } from './events.js';
import { Ball } from '../entities/Ball.js';
import { PlayerPaddle } from '../entities/PlayerPaddle.js';
import { AIPaddle } from '../entities/AIPaddle.js';
import { Planet } from '../entities/Planet.js';
import { HintSystem } from '../systems/HintSystem.js';
import { Physics } from '../systems/Physics.js';
import { AI } from '../systems/AI.js';
import { Renderer } from '../systems/Renderer.js';
import { PauseMenu } from '../ui/PauseMenu.js';

export class Game {
    constructor(canvas, inputManager, audioManager, statistics) {
        this.canvas = canvas;
        this.inputManager = inputManager;
        this.audioManager = audioManager;
        this.statistics = statistics;

        this.renderer = new Renderer(canvas);

        this.state = 'menu';
        this.isRunning = false;
        this.animationFrameId = null;

        this.hintSystem = new HintSystem();
        this.pauseMenu = null;
        this.menu = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener(GAME_EVENT, (e) => {
            const { type, ...data } = e.detail;
            this.handleGameEvent(type, data);
        });
    }

    handleGameEvent(type, data) {
        switch (type) {
            case EVENT_TYPES.GOAL:
                if (this.audioManager) this.audioManager.playSound('goal');
                break;

            case EVENT_TYPES.HINT_USED:
                if (this.audioManager) this.audioManager.playSound('powerup');
                break;

            case EVENT_TYPES.GAME_OVER:
                if (this.audioManager) this.audioManager.playSound('gameOver');
                break;

            case EVENT_TYPES.PAUSE:
                if (this.audioManager) this.audioManager.playSound('wallHit');
                break;
        }
    }

    setMenu(menu) {
        this.menu = menu;
        this.pauseMenu = new PauseMenu(this, this.audioManager, menu);
    }

    init() {
        window.gameStartTime = Date.now();
        this.stop();

        this.resetGameObjects();
        this.setupControlsOnce();

        this.state = 'playing';
    }

    resetGameObjects() {
        this.ball = new Ball(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
        this.ball.reset(Math.random() > 0.5 ? 1 : -1);

        this.paddle1 = new PlayerPaddle(CONFIG.PADDLE.OFFSET);

        if (settings.gameMode === 'AI') {
            this.paddle2 = new AIPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
            this.ai = new AI(settings.difficulty);
        } else {
            this.paddle2 = new PlayerPaddle(CONFIG.CANVAS.WIDTH - CONFIG.PADDLE.OFFSET - CONFIG.PADDLE.WIDTH);
            this.ai = null;
        }

        this.planets = [];
        for (let i = 0; i < settings.planetCount; i++) {
            this.planets.push(new Planet());
        }

        this.hintSystem.reset();

        this.lives1 = CONFIG.GAME.MAX_LIVES;
        this.lives2 = CONFIG.GAME.MAX_LIVES;
    }

    setupControlsOnce() {
        this.keydownHandler = (e) => this.handleKeyDown(e);

        window.addEventListener('keydown', this.keydownHandler);
    }

    handleKeyDown(e) {
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
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT1) this.activateHint('player1', 'freeze');
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT2) this.activateHint('player1', 'shield');
        if (e.code === CONFIG.CONTROLS.PLAYER1.HINT3) this.activateHint('player1', 'enlarge');

        if (settings.gameMode === 'PVP') {
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT1) this.activateHint('player2', 'freeze');
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT2) this.activateHint('player2', 'shield');
            if (e.code === CONFIG.CONTROLS.PLAYER2.HINT3) this.activateHint('player2', 'enlarge');
        }
    }

    update() {
        if (this.state !== 'playing') return;
        if (!this.ball || !this.paddle1 || !this.paddle2) return;

        this.hintSystem.update();

        const dir1 = this.inputManager.getPlayer1Direction();
        this.paddle1.update(dir1);

        if (settings.gameMode === 'PVP') {
            const dir2 = this.inputManager.getPlayer2Direction();
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

        Physics.checkPaddleCollision(this.ball, this.paddle1, () => {
            if (this.audioManager) this.audioManager.playSound('paddleHit');
        });
        Physics.checkPaddleCollision(this.ball, this.paddle2, () => {
            if (this.audioManager) this.audioManager.playSound('paddleHit');
        });

        const goal = Physics.checkGoal(this.ball);
        if (goal) this.handleGoal(goal);

        this.checkSurvivalRewards();
    }

    checkSurvivalRewards() {
        const hint1Reward = this.hintSystem.hintManager1.checkSurvivalReward();
        if (hint1Reward) {
            this.showHintAward('player1', hint1Reward);
        }

        const hint2Reward = this.hintSystem.hintManager2.checkSurvivalReward();
        if (hint2Reward) {
            this.showHintAward('player2', hint2Reward);
        }
    }

    draw() {
        this.renderer.clear();

        if (this.state === 'menu') return;

        this.planets.forEach(p => this.renderer.drawPlanet(p));

        if (this.hintSystem.hintManager1?.activeEffects.shield && this.paddle1) {
            this.renderer.drawShield(this.paddle1, true);
        }
        if (this.hintSystem.hintManager2?.activeEffects.shield && this.paddle2) {
            this.renderer.drawShield(this.paddle2, false);
        }

        this.renderer.drawPaddle(this.paddle1);
        this.renderer.drawPaddle(this.paddle2);

        if (this.hintSystem.isFreezeActive() && this.ball) {
            this.renderer.drawFreezeEffect(this.ball);
        }

        this.renderer.drawBall(this.ball);

        this.renderer.drawLives(this.lives1, this.lives2);

        this.hintSystem.drawHints(this.renderer);

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

    pause() {
        this.state = 'paused';
        dispatchGameEvent(EVENT_TYPES.PAUSE);
        this.pauseMenu?.show();
    }

    resume() {
        this.state = 'playing';
        dispatchGameEvent(EVENT_TYPES.RESUME);
        this.pauseMenu?.hide();
    }

    activateHint(player, type) {
        const success = this.hintSystem.activate(player, type);
        if (!success) return;

        const ball = this.ball;
        const paddle = player === 'player1' ? this.paddle1 : this.paddle2;
        this.hintSystem.applyEffect(player, type, ball, paddle);
    }

    handleGoal(scorer) {
        dispatchGameEvent(EVENT_TYPES.GOAL, { scorer, lives1: this.lives1, lives2: this.lives2 });

        if (this.hintSystem.checkShield(scorer, this.ball)) {
            return;
        }

        let awardedHint = null;

        if (scorer === 'player1') {
            this.lives2--;
            this.ball.reset(1);
            awardedHint = this.hintSystem.hintManager1.onGoalScored();
            this.hintSystem.hintManager2.onGoalConceded();
        } else {
            this.lives1--;
            this.ball.reset(-1);
            awardedHint = this.hintSystem.hintManager2.onGoalScored();
            this.hintSystem.hintManager1.onGoalConceded();
        }

        if (awardedHint) {
            this.showHintAward(scorer, awardedHint);
        }

        if (this.lives1 <= 0) this.gameOver('player2');
        else if (this.lives2 <= 0) this.gameOver('player1');
    }

    showHintAward(player, hintType) {
        const hintNames = {
            freeze: 'Заморозка',
            shield: 'Щит',
            enlarge: 'Увеличение'
        };

        this.renderer.drawHintAward(hintNames[hintType]);
    }

    gameOver(winner) {
        this.state = 'gameOver';
        this.winner = winner;

        this.statistics.saveResult(winner, this.lives1, this.lives2, settings.gameMode, settings.difficulty);
        dispatchGameEvent(EVENT_TYPES.GAME_OVER, { winner, lives1: this.lives1, lives2: this.lives2, mode: settings.gameMode });
    }

    restart() {
        this.resetGameObjects();
        this.state = 'playing';
    }

    returnToMenu() {
        this.stop();
        if (this.audioManager) this.audioManager.playMenuMusic();

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
