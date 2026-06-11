class AIPaddle extends Paddle {
    constructor(x) {
        super(x, false); // Вызываем конструктор родителя

        this.color = CONFIG.PADDLE.COLORS.AI;
    }

    // Переопределяем update для AI-логики (пока базовая)
    update(direction) {
        super.update(direction);
    }
}

window.AIPaddle = AIPaddle;