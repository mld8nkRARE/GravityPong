// js/config.js

const CONFIG = {
    // Настройки canvas
    CANVAS: {
        WIDTH: 1200,
        HEIGHT: 700
    },
    BALL: {
        RADIUS: 8,
        INITIAL_SPEED: 8,
        MIN_SPEED: 8,
        MAX_SPEED: 25,  // Уменьшили с 15
        TRAIL_LENGTH: 10
    },

    // Настройки ракетки
    PADDLE: {
        WIDTH: 15,
        HEIGHT: 100,
        SPEED: 8,
        OFFSET: 50,  // Отступ от края
        COLORS: {
            PLAYER: '#00ff88',
            AI: '#ff4466'
        }
    },

    // Формы ракеток
    PADDLE_SHAPES: {
        RECTANGLE: 'rectangle',
        CONCAVE: 'concave',
        CONVEX: 'convex',
        STAR: 'star'
    },

    // Настройки планет
    PLANETS: {
        MIN_COUNT: 2,
        MAX_COUNT: 7,
        DEFAULT_COUNT: 3,
        MIN_RADIUS: 40,
        MAX_RADIUS: 80,
        GRAVITY_STRENGTH: 0.4,
        SPEED: 0.6,  // Скорость движения
        COLORS: ['#ff6b9d', '#4ecdc4', '#ffe66d', '#a8e6cf']
    },

    // Настройки игры
    GAME: {
        MAX_LIVES: 5,
        FPS: 60
    },

    // Подсказки
    HINTS: {
        FREEZE: {
            duration: 3000,  // мс
            uses: 2,
            cooldown: 15000,
            color: '#00ccff'
        },
        SHIELD: {
            duration: 10000,
            uses: 1,
            cooldown: 20000,
            color: '#ffaa00'
        },
        ENLARGE: {
            duration: 10000,
            uses: 2,
            multiplier: 1.5,
            cooldown: 12000,
            color: '#00ff00'
        }
    },

    // AI сложности
    AI_DIFFICULTY: {
        EASY: {
            speed: 3,
            reactionDelay: 15,  // кадры
            accuracy: 0.7,
            predictTrajectory: false
        },
        MEDIUM: {
            speed: 4,
            reactionDelay: 8,
            accuracy: 0.85,
            predictTrajectory: true
        },
        HARD: {
            speed: 5.5,
            reactionDelay: 3,
            accuracy: 0.95,
            predictTrajectory: true
        }
    },

    // Управление
    CONTROLS: {
        PLAYER1: {
            UP: 'KeyW',
            DOWN: 'KeyS',
            HINT1: 'Digit1',
            HINT2: 'Digit2',
            HINT3: 'Digit3'
        },
        PLAYER2: {
            UP: 'ArrowUp',
            DOWN: 'ArrowDown',
            HINT1: 'Digit7',
            HINT2: 'Digit8',
            HINT3: 'Digit9'
        }
    }
};

// Глобальные настройки игры (изменяемые из меню)
const SETTINGS = {
    gameMode: 'AI',  // 'AI' или 'PVP'
    difficulty: 'MEDIUM',
    planetCount: 3,
    speedIncrease: 1.05,
    speedIncreasePercent: 5,
    player1Shape: 'rectangle',
    player2Shape: 'rectangle',
    showHints: true
};