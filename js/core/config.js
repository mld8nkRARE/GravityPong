export const CONFIG = {
    CANVAS: {
        WIDTH: 1200,
        HEIGHT: 700
    },
    BALL: {
        RADIUS: 8,
        INITIAL_SPEED: 8,
        MIN_SPEED: 8,
        MAX_SPEED: 25,
        TRAIL_LENGTH: 10
    },
    PADDLE: {
        WIDTH: 15,
        HEIGHT: 100,
        SPEED: 8,
        OFFSET: 50,
        COLORS: {
            PLAYER: '#00ff88',
            AI: '#ff4466'
        },
        ENLARGE_MULTIPLIER: 1.85
    },

    GAME: {
        MAX_LIVES: 5
    },
    HINTS: {
        FREEZE: {
            duration: 3000,
            uses: 2,
            color: '#00ccff'
        },
        SHIELD: {
            duration: 10000,
            uses: 1,
            color: '#ffaa00'
        },
        ENLARGE: {
            duration: 10000,
            uses: 2,
            multiplier: 1.5,
            color: '#00ff00'
        }
    },
    AI_DIFFICULTY: {
        EASY: {
            speed: 3,
            reactionDelay: 15,
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
