export const GAME_EVENT = 'gameEvent';

export function dispatchGameEvent(type, data = {}) {
    const event = new CustomEvent(GAME_EVENT, {
        detail: {
            type: type,
            timestamp: Date.now(),
            ...data
        }
    });

    window.dispatchEvent(event);
}

export const EVENT_TYPES = {
    GOAL: 'goal',
    HINT_USED: 'hintUsed',
    HINT_AWARDED: 'hintAwarded',
    GAME_OVER: 'gameOver',
    POWERUP_ACTIVATED: 'powerupActivated',
    PAUSE: 'pause',
    RESUME: 'resume',
    WALL_HIT: 'wallHit'
};
