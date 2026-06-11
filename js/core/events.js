// js/events.js

const GAME_EVENT = 'gameEvent';

function dispatchGameEvent(type, data = {}) {
    const event = new CustomEvent(GAME_EVENT, {
        detail: {
            type: type,
            timestamp: Date.now(),
            ...data
        }
    });

    window.dispatchEvent(event);
    console.log(`Game Event: ${type}`, data);
}

const EVENT_TYPES = {
    GOAL: 'goal',
    HINT_USED: 'hintUsed',
    GAME_OVER: 'gameOver',
    POWERUP_ACTIVATED: 'powerupActivated',
    PAUSE: 'pause',
    RESUME: 'resume'
};

window.GAME_EVENT = GAME_EVENT;
window.dispatchGameEvent = dispatchGameEvent;
window.EVENT_TYPES = EVENT_TYPES;
