class PlayerPaddle extends Paddle {
    constructor(x) {
        super(x, true); // Вызываем конструктор родителя

        this.color = CONFIG.PADDLE.COLORS.PLAYER;
    }

    update(direction) {
        super.update(direction); // Вызываем базовое движение

        // Логика увеличения только для игрока
        if (this.isEnlarged) {
            this.enlargeTimer--;
            if (this.enlargeTimer <= 0) {
                this.deactivateEnlarge();
            }
        }

    }
    activateEnlarge() {
        this.isEnlarged = true;
        this.height = this.baseHeight * 1.85;
        this.enlargeTimer = 2 * CONFIG.HINTS.ENLARGE.duration / (1000 / CONFIG.GAME.FPS);
    }

    deactivateEnlarge() {
        this.isEnlarged = false;
        this.height = this.baseHeight;
    }

}

window.PlayerPaddle = PlayerPaddle;